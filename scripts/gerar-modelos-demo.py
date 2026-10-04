"""
Gera modelos 3D (.glb) de DEMONSTRACAO a partir das imagens de referencia:

  assets/models/multimetro-demo.glb  -> corpo com espessura, seletor rotativo e bornes em relevo
  assets/models/protoboard-demo.glb  -> placa com espessura

A face de cima de cada modelo usa a propria imagem de referencia como
textura, entao o modelo "nasce" exatamente em cima da imagem reconhecida.

O modelo ja e gerado no sistema de coordenadas do ViroARImageMarker
(origem no centro da imagem, X para a direita, Y saindo da imagem, Z para a
parte de baixo da imagem, em metros). Por isso, no conteudo, basta usar
posicao [0, 0, 0], rotacao [0, 0, 0] e escala [1, 1, 1].

Sao modelos simples, para testar o fluxo. Para o projeto final, troquem por
modelos feitos no Blender/Sketchfab (ver docs/RA-RECONHECIMENTO.md).

Uso:  python scripts/gerar-modelos-demo.py   (sem dependencias extras)
"""
import json
import math
import os
import struct

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MARCADORES = os.path.join(RAIZ, "assets", "markers")
SAIDA = os.path.join(RAIZ, "assets", "models")


def cor(hexa, alfa=1.0):
    hexa = hexa.lstrip("#")
    # glTF usa cores lineares; converte de sRGB para que a cor final fique parecida com a do hexa.
    def lin(c):
        c = c / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    return [lin(int(hexa[i : i + 2], 16)) for i in (0, 2, 4)] + [alfa]


class Malha:
    """Acumula triangulos de uma primitiva (mesmo material)."""

    def __init__(self, material, com_uv=False):
        self.material = material
        self.com_uv = com_uv
        self.pos, self.nor, self.uv, self.idx = [], [], [], []

    def tri(self, a, b, c, normal, uvs=None):
        # Garante a ordem anti-horaria (frente do triangulo) em relacao a normal desejada.
        ab = [b[i] - a[i] for i in range(3)]
        ac = [c[i] - a[i] for i in range(3)]
        cruz = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]]
        if sum(cruz[i] * normal[i] for i in range(3)) < 0:
            b, c = c, b
            if uvs:
                uvs = [uvs[0], uvs[2], uvs[1]]
        base = len(self.pos)
        self.pos += [a, b, c]
        self.nor += [normal] * 3
        if self.com_uv:
            self.uv += uvs or [[0, 0]] * 3
        self.idx += [base, base + 1, base + 2]

    def quad(self, a, b, c, d, normal, uvs=None):
        self.tri(a, b, c, normal, [uvs[0], uvs[1], uvs[2]] if uvs else None)
        self.tri(a, c, d, normal, [uvs[0], uvs[2], uvs[3]] if uvs else None)


def caixa(malha, x0, x1, y0, y1, z0, z1, pular_topo=False):
    faces = [
        ((0, 1, 0), [(x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1)]),
        ((0, -1, 0), [(x0, y0, z0), (x1, y0, z0), (x1, y0, z1), (x0, y0, z1)]),
        ((1, 0, 0), [(x1, y0, z0), (x1, y1, z0), (x1, y1, z1), (x1, y0, z1)]),
        ((-1, 0, 0), [(x0, y0, z0), (x0, y1, z0), (x0, y1, z1), (x0, y0, z1)]),
        ((0, 0, 1), [(x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]),
        ((0, 0, -1), [(x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0)]),
    ]
    for normal, (a, b, c, d) in faces:
        if pular_topo and normal == (0, 1, 0):
            continue
        malha.quad(a, b, c, d, normal)


def cilindro(malha, cx, cz, raio, y0, y1, segmentos=40, tampa=True):
    for i in range(segmentos):
        t0 = 2 * math.pi * i / segmentos
        t1 = 2 * math.pi * (i + 1) / segmentos
        p0 = (cx + raio * math.cos(t0), cz + raio * math.sin(t0))
        p1 = (cx + raio * math.cos(t1), cz + raio * math.sin(t1))
        tm = (t0 + t1) / 2
        normal = (math.cos(tm), 0, math.sin(tm))
        malha.quad((p0[0], y0, p0[1]), (p1[0], y0, p1[1]), (p1[0], y1, p1[1]), (p0[0], y1, p0[1]), normal)
        if tampa:
            malha.tri((cx, y1, cz), (p0[0], y1, p0[1]), (p1[0], y1, p1[1]), (0, 1, 0))


def topo_texturizado(malha, largura, altura, y):
    w, h = largura / 2, altura / 2
    # v = 0 no topo da imagem (Z negativo), igual ao sistema (u, v) dos hotspots.
    malha.quad((-w, y, -h), (w, y, -h), (w, y, h), (-w, y, h), (0, 1, 0), [[0, 0], [1, 0], [1, 1], [0, 1]])


def salvar_glb(caminho, malhas, materiais, imagem_png):
    binario = bytearray()
    buffer_views, acessores, primitivas = [], [], []

    def adicionar(dados, alvo=None):
        while len(binario) % 4:
            binario.append(0)
        inicio = len(binario)
        binario.extend(dados)
        vista = {"buffer": 0, "byteOffset": inicio, "byteLength": len(dados)}
        if alvo:
            vista["target"] = alvo
        buffer_views.append(vista)
        return len(buffer_views) - 1

    def acessor(valores, tipo, comps):
        planos = [c for v in valores for c in v]
        vista = adicionar(struct.pack(f"<{len(planos)}f", *planos), 34962)
        item = {"bufferView": vista, "componentType": 5126, "count": len(valores), "type": tipo}
        if tipo == "VEC3":
            item["min"] = [min(v[i] for v in valores) for i in range(comps)]
            item["max"] = [max(v[i] for v in valores) for i in range(comps)]
        acessores.append(item)
        return len(acessores) - 1

    for malha in malhas:
        atributos = {"POSITION": acessor(malha.pos, "VEC3", 3), "NORMAL": acessor(malha.nor, "VEC3", 3)}
        if malha.com_uv:
            atributos["TEXCOORD_0"] = acessor(malha.uv, "VEC2", 2)
        vista = adicionar(struct.pack(f"<{len(malha.idx)}I", *malha.idx), 34963)
        acessores.append({"bufferView": vista, "componentType": 5125, "count": len(malha.idx), "type": "SCALAR"})
        primitivas.append({"attributes": atributos, "indices": len(acessores) - 1, "material": malha.material})

    vista_imagem = adicionar(imagem_png)
    while len(binario) % 4:
        binario.append(0)

    gltf = {
        "asset": {"version": "2.0", "generator": "RA Lab gerar-modelos-demo.py"},
        "scene": 0,
        "scenes": [{"nodes": [0]}],
        "nodes": [{"mesh": 0}],
        "meshes": [{"primitives": primitivas}],
        "materials": materiais,
        "images": [{"bufferView": vista_imagem, "mimeType": "image/png"}],
        "samplers": [{"magFilter": 9729, "minFilter": 9987, "wrapS": 33071, "wrapT": 33071}],
        "textures": [{"sampler": 0, "source": 0}],
        "accessors": acessores,
        "bufferViews": buffer_views,
        "buffers": [{"byteLength": len(binario)}],
    }
    js = json.dumps(gltf, separators=(",", ":")).encode()
    js += b" " * ((4 - len(js) % 4) % 4)
    total = 12 + 8 + len(js) + 8 + len(binario)
    with open(caminho, "wb") as f:
        f.write(struct.pack("<III", 0x46546C67, 2, total))
        f.write(struct.pack("<II", len(js), 0x4E4F534A) + js)
        f.write(struct.pack("<II", len(binario), 0x004E4942) + bytes(binario))


def material(nome, rgba, textura=False, rugosidade=0.7):
    pbr = {"baseColorFactor": rgba, "metallicFactor": 0.0, "roughnessFactor": rugosidade}
    if textura:
        pbr["baseColorTexture"] = {"index": 0}
    return {"name": nome, "pbrMetallicRoughness": pbr}


def png_reduzido(nome, largura_max=1024):
    img = Image.open(os.path.join(MARCADORES, nome)).convert("RGB")
    if img.width > largura_max:
        img = img.resize((largura_max, round(img.height * largura_max / img.width)), Image.LANCZOS)
    from io import BytesIO

    saida = BytesIO()
    img.save(saida, "PNG", optimize=True)
    return img.size, saida.getvalue()


def multimetro():
    # Mesmas medidas do alvo: 12 cm de largura (larguraFisicaMetros) e proporcao 1000x1600 da imagem.
    (pw, ph), png = png_reduzido("multimetro-demo.png")
    L = 0.12
    A = L * ph / pw
    E = 0.032  # espessura do corpo (3,2 cm)

    def xz(u, v):
        return (u - 0.5) * L, (v - 0.5) * A

    painel, corpo, preto, borne_vermelho, cinza = (Malha(0, True), Malha(1), Malha(2), Malha(3), Malha(4))
    topo_texturizado(painel, L, A, E)
    caixa(corpo, -L / 2, L / 2, 0, E, -A / 2, A / 2, pular_topo=True)

    # Seletor rotativo saltado (centro u=0.5, v=0.4875; raio de 210 px em 1000 px)
    cx, cz = xz(0.5, 0.4875)
    raio = 0.21 * L
    cilindro(preto, cx, cz, raio, E, E + 0.007)
    # Ponteiro do seletor (aponta para OFF, para cima da imagem)
    caixa(borne_vermelho, cx - 0.002, cx + 0.002, E + 0.007, E + 0.010, cz - raio * 0.85, cz - raio * 0.15)

    # Bornes em relevo (v=0.844; u=0.25 / 0.5 / 0.75; raio externo 70 px)
    for u, malha_anel in ((0.25, borne_vermelho), (0.5, preto), (0.75, borne_vermelho)):
        bx, bz = xz(u, 0.844)
        cilindro(malha_anel, bx, bz, 0.07 * L, E, E + 0.005)
        cilindro(cinza, bx, bz, 0.025 * L, E + 0.005, E + 0.0055)

    materiais = [
        material("painel", [1, 1, 1, 1], textura=True, rugosidade=0.5),
        material("corpo", cor("#F2B705"), rugosidade=0.6),
        material("preto", cor("#151515"), rugosidade=0.4),
        material("vermelho", cor("#C62828"), rugosidade=0.5),
        material("furo", cor("#050505"), rugosidade=0.9),
    ]
    salvar_glb(os.path.join(SAIDA, "multimetro-demo.glb"), [painel, corpo, preto, borne_vermelho, cinza], materiais, png)
    return E


def protoboard():
    (pw, ph), png = png_reduzido("protoboard-demo.png", largura_max=1650)
    L = 0.165
    A = L * ph / pw
    E = 0.0085
    painel, base = Malha(0, True), Malha(1)
    topo_texturizado(painel, L, A, E)
    caixa(base, -L / 2, L / 2, 0, E, -A / 2, A / 2, pular_topo=True)
    materiais = [
        material("painel", [1, 1, 1, 1], textura=True, rugosidade=0.8),
        material("base", cor("#E8E4DA"), rugosidade=0.8),
    ]
    salvar_glb(os.path.join(SAIDA, "protoboard-demo.glb"), [painel, base], materiais, png)
    return E


if __name__ == "__main__":
    os.makedirs(SAIDA, exist_ok=True)
    print("multimetro: espessura", multimetro(), "m")
    print("protoboard: espessura", protoboard(), "m")
    print("Modelos gerados em", SAIDA)
