"""
Utilitarios para gerar modelos 3D .glb por codigo, sem dependencias extras.

Usado por gerar-modelos-demo.py. Todas as medidas
em metros (unidade do glTF e do ViroReact).
"""
import json
import math
import struct


def cor(hexa, alfa=1.0):
    """Converte "#RRGGBB" (sRGB) para a cor linear que o glTF espera."""
    hexa = hexa.lstrip("#")

    def lin(c):
        c = c / 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    return [lin(int(hexa[i : i + 2], 16)) for i in (0, 2, 4)] + [alfa]


def material(nome, rgba, textura=False, rugosidade=0.7, metalico=0.0):
    pbr = {"baseColorFactor": rgba, "metallicFactor": metalico, "roughnessFactor": rugosidade}
    if textura:
        pbr["baseColorTexture"] = {"index": 0}
    return {"name": nome, "pbrMetallicRoughness": pbr}


class Malha:
    """Acumula triangulos de uma primitiva (mesmo material)."""

    def __init__(self, material, com_uv=False):
        self.material = material
        self.com_uv = com_uv
        self.pos, self.nor, self.uv, self.idx = [], [], [], []

    def tri(self, a, b, c, normal, uvs=None, normais=None):
        # Garante a ordem anti-horaria (frente do triangulo) em relacao a normal desejada.
        ab = [b[i] - a[i] for i in range(3)]
        ac = [c[i] - a[i] for i in range(3)]
        cruz = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]]
        if sum(cruz[i] * normal[i] for i in range(3)) < 0:
            b, c = c, b
            if uvs:
                uvs = [uvs[0], uvs[2], uvs[1]]
            if normais:
                normais = [normais[0], normais[2], normais[1]]
        base = len(self.pos)
        self.pos += [a, b, c]
        self.nor += normais or [normal] * 3
        if self.com_uv:
            self.uv += uvs or [[0, 0]] * 3
        self.idx += [base, base + 1, base + 2]

    def quad(self, a, b, c, d, normal, uvs=None, normais=None):
        self.tri(a, b, c, normal, [uvs[0], uvs[1], uvs[2]] if uvs else None,
                 [normais[0], normais[1], normais[2]] if normais else None)
        self.tri(a, c, d, normal, [uvs[0], uvs[2], uvs[3]] if uvs else None,
                 [normais[0], normais[2], normais[3]] if normais else None)


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


def revolucao(malha, perfil, eixo="y", segmentos=32, centro=(0.0, 0.0, 0.0)):
    """
    Superficie de revolucao (corpos redondos: resistor, LED, capacitor).
    perfil: lista de (raio, posicao_no_eixo), em ordem ao longo do eixo.
    Pontos com raio 0 nas pontas fecham o corpo.
    """
    def ponto(raio, a, ang):
        u, v = raio * math.cos(ang), raio * math.sin(ang)
        if eixo == "y":
            p = (u, a, v)
        elif eixo == "x":
            p = (a, u, v)
        else:
            p = (u, v, a)
        return tuple(p[i] + centro[i] for i in range(3))

    def normal(nr, na, ang):
        u, v = nr * math.cos(ang), nr * math.sin(ang)
        return (u, na, v) if eixo == "y" else (na, u, v) if eixo == "x" else (u, v, na)

    for (r0, a0), (r1, a1) in zip(perfil, perfil[1:]):
        dr, da = r1 - r0, a1 - a0
        comp = math.hypot(dr, da) or 1
        nr, na = da / comp, -dr / comp  # normal do segmento do perfil (apontando para fora)
        if a1 < a0:
            nr, na = -nr, -na
        for i in range(segmentos):
            t0 = 2 * math.pi * i / segmentos
            t1 = 2 * math.pi * (i + 1) / segmentos
            n0, n1 = normal(nr, na, t0), normal(nr, na, t1)
            tm = (t0 + t1) / 2
            malha.quad(ponto(r0, a0, t0), ponto(r0, a0, t1), ponto(r1, a1, t1), ponto(r1, a1, t0),
                       normal(nr, na, tm), normais=[n0, n1, n1, n0])


def extrusao(malha, contorno, y0, y1):
    """Extruda um contorno 2D (lista de (x, z), sentido anti-horario visto de cima) entre y0 e y1."""
    n = len(contorno)
    cx = sum(p[0] for p in contorno) / n
    cz = sum(p[1] for p in contorno) / n
    for i in range(n):
        (xa, za), (xb, zb) = contorno[i], contorno[(i + 1) % n]
        nx, nz = zb - za, -(xb - xa)
        comp = math.hypot(nx, nz) or 1
        nrm = (nx / comp, 0, nz / comp)
        if ((xa + xb) / 2 - cx) * nrm[0] + ((za + zb) / 2 - cz) * nrm[2] < 0:
            nrm = (-nrm[0], 0, -nrm[2])
        malha.quad((xa, y0, za), (xb, y0, zb), (xb, y1, zb), (xa, y1, za), nrm)
        malha.tri((cx, y1, cz), (xa, y1, za), (xb, y1, zb), (0, 1, 0))
        malha.tri((cx, y0, cz), (xa, y0, za), (xb, y0, zb), (0, -1, 0))


def salvar_glb(caminho, malhas, materiais, imagem_png=None, gerador="RA Lab"):
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
        if not malha.idx:
            continue
        atributos = {"POSITION": acessor(malha.pos, "VEC3", 3), "NORMAL": acessor(malha.nor, "VEC3", 3)}
        if malha.com_uv:
            atributos["TEXCOORD_0"] = acessor(malha.uv, "VEC2", 2)
        vista = adicionar(struct.pack(f"<{len(malha.idx)}I", *malha.idx), 34963)
        acessores.append({"bufferView": vista, "componentType": 5125, "count": len(malha.idx), "type": "SCALAR"})
        primitivas.append({"attributes": atributos, "indices": len(acessores) - 1, "material": malha.material})

    gltf = {
        "asset": {"version": "2.0", "generator": gerador},
        "scene": 0,
        "scenes": [{"nodes": [0]}],
        "nodes": [{"mesh": 0}],
        "meshes": [{"primitives": primitivas}],
        "materials": materiais,
    }
    if imagem_png is not None:
        gltf["images"] = [{"bufferView": adicionar(imagem_png), "mimeType": "image/png"}]
        gltf["samplers"] = [{"magFilter": 9729, "minFilter": 9987, "wrapS": 33071, "wrapT": 33071}]
        gltf["textures"] = [{"sampler": 0, "source": 0}]
    while len(binario) % 4:
        binario.append(0)
    gltf["accessors"] = acessores
    gltf["bufferViews"] = buffer_views
    gltf["buffers"] = [{"byteLength": len(binario)}]

    js = json.dumps(gltf, separators=(",", ":")).encode()
    js += b" " * ((4 - len(js) % 4) % 4)
    total = 12 + 8 + len(js) + 8 + len(binario)
    with open(caminho, "wb") as f:
        f.write(struct.pack("<III", 0x46546C67, 2, total))
        f.write(struct.pack("<II", len(js), 0x4E4F534A) + js)
        f.write(struct.pack("<II", len(binario), 0x004E4942) + bytes(binario))
