"""
Gera as imagens de referencia (alvos do reconhecimento) do multimetro
FT-266 a partir das fotos em docs/fotos/: uma da FRENTE e uma de TRAS.

Cada foto e endireitada e recortada so no corpo preto (sem o papel em volta,
que muda de lugar para lugar e atrapalharia o reconhecimento). As medidas
vem do modelo 3D assets/models/alicate-ft266.glb, que esta em escala real
(metros), entao os alvos e o modelo ficam alinhados.

Saidas:
  assets/markers/ft266-frente.jpg     alvo da frente
  assets/markers/ft266-traseira.jpg   alvo de tras (girado com a garra para cima)
  docs/fotos/ft266-*-conferencia.jpg  pontos das partes desenhados sobre a foto

Tambem imprime, para cada lado, a transformacao do modelo 3D e a posicao
(u, v) de cada parte, usadas em src/features/lab-ar/content/multimetro-ft266.ts.

Para usar outra foto: tire de cima, com o aparelho deitado, e ajuste os
pontos de calibracao (bordas do corpo na foto) no dicionario LADOS.

Uso:  python scripts/gerar-alvo-ft266.py   (requer Pillow)
"""
import math
import os

from PIL import Image, ImageDraw

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOTOS = os.path.join(RAIZ, "docs", "fotos")
MARCADORES = os.path.join(RAIZ, "assets", "markers")

# --- Medidas do modelo 3D (metros, sistema do .glb: X direita, Y espessura, Z para os bornes) ---
CORPO_X_CENTRO = 0.0108
CORPO_LARGURA = 0.068
CORPO_Z_BASE = 0.1183
MARGEM = 0.0015  # nao pegar o papel em volta do corpo
PIXELS_POR_METRO = 6000

LADOS = {
    "frente": {
        "foto": "ft266-frente-referencia.jpg",
        "girar_foto": 0,  # foto ja com a garra para cima
        # Bordas do corpo na foto: esquerda e direita, cada uma com dois pontos (x, y). Base do corpo em BASE_Y.
        "borda_esq": ((450, 1000), (459, 1480)),
        "borda_dir": ((821, 1000), (831, 1480)),
        "base_y": 1502,
        # Na frente, +X do modelo aparece a direita na foto; atras (aparelho virado), a esquerda.
        "sinal_x": 1,
        "superficie_y": 0.035,  # face de cima do corpo
        "z0": -0.026,  # logo abaixo da cabeca da garra
        "partes": {
            "seletor": (0.0108, 0.0260),
            "display": (0.0108, 0.0753),
            "borne-v-ohm": (-0.0086, 0.1071),
            "borne-com": (0.0108, 0.1071),
            "borne-ext": (0.0302, 0.1071),
            "data-hold": (0.0457, -0.0232),
        },
    },
    "traseira": {
        "foto": "ft266-traseira-referencia.jpg",
        "girar_foto": 90,  # a foto original esta deitada (garra a direita): gira para a garra ficar para cima
        "borda_esq": ((342, 1000), (339, 1450)),
        "borda_dir": ((711, 1000), (711, 1450)),
        "base_y": 1470,
        "sinal_x": -1,
        "superficie_y": 0.0,  # face de baixo do corpo
        "z0": -0.030,  # inclui o adesivo logo abaixo da cabeca da garra
        "partes": {
            "etiqueta-aviso": (0.0110, 0.0080),
            "parafuso-tampa": (0.0108, 0.0523),
            "tampa-bateria": (0.0108, 0.0870),
        },
    },
}


def calibracao(lado):
    esq, dir_ = lado["borda_esq"], lado["borda_dir"]
    largura_px = ((dir_[0][0] - esq[0][0]) + (dir_[1][0] - esq[1][0])) / 2
    escala = largura_px / CORPO_LARGURA
    dy = esq[1][1] - esq[0][1]
    inclinacao = math.atan2(((esq[1][0] - esq[0][0]) + (dir_[1][0] - dir_[0][0])) / 2, dy)
    centro_y0 = (esq[0][0] + dir_[0][0]) / 2
    base_x = centro_y0 + math.tan(inclinacao) * (lado["base_y"] - esq[0][1])
    return escala, inclinacao, base_x


def modelo_para_foto(lado, x, z, cal):
    escala, theta, base_x = cal
    dx = (x - CORPO_X_CENTRO) * lado["sinal_x"]
    dz = z - CORPO_Z_BASE
    c, s = math.cos(theta), math.sin(theta)
    return base_x + escala * (dx * c + dz * s), lado["base_y"] + escala * (-dx * s + dz * c)


def gerar(nome, lado):
    foto = Image.open(os.path.join(FOTOS, lado["foto"])).convert("RGB")
    if lado["girar_foto"]:
        foto = foto.rotate(lado["girar_foto"], expand=True)
    cal = calibracao(lado)

    # Regiao do alvo em coordenadas da IMAGEM (u para a direita): xa e a posicao "para a direita" em metros.
    meia = CORPO_LARGURA / 2 - MARGEM
    z0, z1 = lado["z0"], CORPO_Z_BASE - MARGEM
    largura = round(2 * meia * PIXELS_POR_METRO)
    altura = round((z1 - z0) * PIXELS_POR_METRO)

    def x_modelo(xa):  # xa: metros a partir da borda esquerda da imagem
        return CORPO_X_CENTRO + lado["sinal_x"] * (xa - meia)

    def ponto(ox, oy):
        return modelo_para_foto(lado, x_modelo(ox / PIXELS_POR_METRO), z0 + oy / PIXELS_POR_METRO, cal)

    p00, p10, p01 = ponto(0, 0), ponto(1, 0), ponto(0, 1)
    coef = (p10[0] - p00[0], p01[0] - p00[0], p00[0], p10[1] - p00[1], p01[1] - p00[1], p00[1])
    alvo = foto.transform((largura, altura), Image.AFFINE, coef, resample=Image.BICUBIC)
    alvo.save(os.path.join(MARCADORES, f"ft266-{nome}.jpg"), quality=93)

    conferencia = foto.copy()
    desenho = ImageDraw.Draw(conferencia)
    cantos = [ponto(0, 0), ponto(largura, 0), ponto(largura, altura), ponto(0, altura)]
    desenho.polygon(cantos, outline=(0, 255, 0), width=3)
    for parte, (x, z) in lado["partes"].items():
        px, py = modelo_para_foto(lado, x, z, cal)
        desenho.ellipse([px - 9, py - 9, px + 9, py + 9], outline=(0, 200, 255), width=4)
        desenho.text((px + 12, py - 8), parte, fill=(0, 200, 255))
    conferencia.save(os.path.join(FOTOS, f"ft266-{nome}-conferencia.jpg"), quality=85)

    # Centro do alvo no sistema do modelo e transformacao do modelo 3D para o sistema do alvo.
    cx, cy, cz = CORPO_X_CENTRO, lado["superficie_y"], (z0 + z1) / 2
    if lado["sinal_x"] == 1:
        rotacao, posicao = (0, 0, 0), (-cx, -cy, -cz)
    else:
        # Aparelho virado: girar 180 graus em Z leva a face de tras (-Y) para cima e espelha X.
        rotacao, posicao = (0, 0, 180), (cx, cy, -cz)

    print(f"[{nome}] alvo {largura}x{altura} px, largura fisica = {2 * meia:.4f} m, escala da foto {cal[0]:.0f} px/m")
    print(f"  modelo3D: posicao [{posicao[0]:.4f}, {posicao[1]:.4f}, {posicao[2]:.4f}], rotacao {list(rotacao)}")
    for parte, (x, z) in lado["partes"].items():
        u = ((x - CORPO_X_CENTRO) * lado["sinal_x"] + meia) / (2 * meia)
        v = (z - z0) / (z1 - z0)
        print(f"  {parte:15} u={u:.3f} v={v:.3f}")


if __name__ == "__main__":
    for nome, lado in LADOS.items():
        gerar(nome, lado)
