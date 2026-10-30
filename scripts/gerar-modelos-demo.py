"""
Gera o modelo 3D (.glb) de DEMONSTRACAO da protoboard a partir da imagem de referencia:

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
import os

from PIL import Image

from glb_util import Malha, caixa, cor, material, salvar_glb

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MARCADORES = os.path.join(RAIZ, "assets", "markers")
SAIDA = os.path.join(RAIZ, "assets", "models")


def topo_texturizado(malha, largura, altura, y):
    w, h = largura / 2, altura / 2
    # v = 0 no topo da imagem (Z negativo), igual ao sistema (u, v) dos hotspots.
    malha.quad((-w, y, -h), (w, y, -h), (w, y, h), (-w, y, h), (0, 1, 0), [[0, 0], [1, 0], [1, 1], [0, 1]])


def png_reduzido(nome, largura_max=1024):
    img = Image.open(os.path.join(MARCADORES, nome)).convert("RGB")
    if img.width > largura_max:
        img = img.resize((largura_max, round(img.height * largura_max / img.width)), Image.LANCZOS)
    from io import BytesIO

    saida = BytesIO()
    img.save(saida, "PNG", optimize=True)
    return img.size, saida.getvalue()


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
    salvar_glb(os.path.join(SAIDA, "protoboard-demo.glb"), [painel, base], materiais, png, gerador="RA Lab gerar-modelos-demo.py")
    return E


if __name__ == "__main__":
    os.makedirs(SAIDA, exist_ok=True)
    print("protoboard: espessura", protoboard(), "m")
    print("Modelos gerados em", SAIDA)
