"""
Gera a imagem de referencia (alvo do reconhecimento) do circuito ESP32 + LED
a partir da foto docs/fotos/circuito-esp32-led-referencia.jpg, no mesmo padrao
de scripts/gerar-alvo-ft266.py.

A foto foi tirada de cima, mas com um pouco de perspectiva. Por isso ela e
endireitada por uma homografia calculada a partir de pontos conhecidos da
protoboard (furos e numeros impressos das fileiras). As medidas vem do modelo
3D assets/models/circuito-esp32-led.glb, que esta em escala real (metros):
  - furos a 2,54 mm; colunas A..E a esquerda e F..J a direita do canal central;
  - a fileira r da metade A-E fica em z = (32 - r) * 2,54 mm;
  - a metade F-J e numerada ao contrario: o numero n dela fica na fileira 61 - n.

O recorte pega a largura da protoboard, do ESP32 ate a fileira ~22 (onde
estao o resistor e o LED). O ESP32 e a parte com mais detalhes: e ela que
o ARCore usa para reconhecer o circuito.

Saidas:
  assets/markers/circuito-esp32-led.jpg            alvo
  docs/fotos/circuito-esp32-led-conferencia.jpg    furos e partes desenhados sobre a foto

Tambem imprime a transformacao do modelo 3D e a posicao (u, v) de cada parte,
usadas em src/features/lab-ar/content/circuito-esp32-led.ts.

Uso:  python scripts/gerar-alvo-circuito-esp32.py   (requer Pillow e numpy)
"""
import os

import numpy as np
from PIL import Image, ImageDraw

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOTO = os.path.join(RAIZ, "docs", "fotos", "circuito-esp32-led-referencia.jpg")
ALVO = os.path.join(RAIZ, "assets", "markers", "circuito-esp32-led.jpg")
CONFERENCIA = os.path.join(RAIZ, "docs", "fotos", "circuito-esp32-led-conferencia.jpg")

# --- Medidas do modelo 3D (metros, sistema do .glb: X direita, Y para cima, Z para o lado do LED) ---
PASSO = 0.00254
X_COLUNA_A = -0.01397
X_COLUNA_J = 0.01397
DIST_NUMERO = 0.0021  # numeros impressos ficam ~2 mm para fora das colunas A e J
SUPERFICIE_Y = 0.0085  # face de cima da protoboard
PIXELS_POR_METRO = 10000

# Regiao do alvo no modelo: largura da protoboard (sem a borda) e do ESP32 ate a fileira ~22.
X0, X1 = -0.026, 0.026
Z0, Z1 = -0.081, 0.026


def z_fileira(r):
    """z do furo da fileira r da metade A-E (a fileira n da metade F-J e a 61 - n)."""
    return (32 - r) * PASSO


# Pontos de calibracao: (x, y) na foto -> (x, z) no modelo.
CALIBRACAO = [
    # numeros impressos a esquerda (metade A-E)
    ((392, 613), (X_COLUNA_A - DIST_NUMERO, z_fileira(55))),
    ((393, 733), (X_COLUNA_A - DIST_NUMERO, z_fileira(50))),
    ((400, 855), (X_COLUNA_A - DIST_NUMERO, z_fileira(45))),
    ((412, 1265), (X_COLUNA_A - DIST_NUMERO, z_fileira(30))),
    ((425, 1552), (X_COLUNA_A - DIST_NUMERO, z_fileira(20))),
    # numeros impressos a direita (metade F-J, numeracao invertida)
    ((697, 585), (X_COLUNA_J + DIST_NUMERO, z_fileira(61 - 5))),
    ((708, 707), (X_COLUNA_J + DIST_NUMERO, z_fileira(61 - 10))),
    ((717, 833), (X_COLUNA_J + DIST_NUMERO, z_fileira(61 - 15))),
    ((777, 1533), (X_COLUNA_J + DIST_NUMERO, z_fileira(61 - 40))),
    # furos
    ((419.3, 859.3), (X_COLUNA_A, z_fileira(45))),
    ((696, 862.7), (X_COLUNA_J, z_fileira(45))),
    ((448, 1544), (X_COLUNA_A, z_fileira(20))),
    ((751, 1560), (X_COLUNA_J, z_fileira(20))),
]

# Partes apontadas no app: (x, z, topo y) no modelo, medidos nos vertices do .glb.
PARTES = {
    "esp32": (0.0, -0.0458, 0.0158),
    "pino-d2": (-0.0140, -0.0660, 0.0231),
    "fio-laranja": (-0.0221, -0.0711, 0.0231),
    "resistor": (0.0, 0.0064, 0.0154),
    "led": (0.0204, 0.0130, 0.0259),
    "fio-roxo": (-0.0221, 0.0254, 0.0231),
}


def homografia(pontos):
    linhas = []
    for (u, v), (x, z) in pontos:
        linhas.append([x, z, 1, 0, 0, 0, -u * x, -u * z, -u])
        linhas.append([0, 0, 0, x, z, 1, -v * x, -v * z, -v])
    _, _, vt = np.linalg.svd(np.array(linhas))
    h = vt[-1].reshape(3, 3)
    return h / h[2, 2]


def para_foto(h, x, z):
    p = h @ [x, z, 1]
    return p[0] / p[2], p[1] / p[2]


def main():
    h = homografia(CALIBRACAO)
    erros = [np.hypot(*np.subtract(para_foto(h, x, z), uv)) for uv, (x, z) in CALIBRACAO]
    print(f"calibracao: erro medio {np.mean(erros):.1f} px, maximo {np.max(erros):.1f} px")

    foto = Image.open(FOTO).convert("RGB")
    largura = round((X1 - X0) * PIXELS_POR_METRO)
    altura = round((Z1 - Z0) * PIXELS_POR_METRO)
    # Pixel do alvo -> metros do modelo -> pixel da foto.
    m = h @ np.array([[1 / PIXELS_POR_METRO, 0, X0], [0, 1 / PIXELS_POR_METRO, Z0], [0, 0, 1]])
    m = m / m[2, 2]
    alvo = foto.transform((largura, altura), Image.PERSPECTIVE, tuple(m.flatten()[:8]), resample=Image.BICUBIC)
    alvo.save(ALVO, quality=93)

    conferencia = foto.copy()
    desenho = ImageDraw.Draw(conferencia)
    colunas = [X_COLUNA_A + i * PASSO for i in range(5)] + [X_COLUNA_J - i * PASSO for i in range(5)]
    for r in range(1, 64):
        for x in colunas:
            px, py = para_foto(h, x, z_fileira(r))
            desenho.ellipse([px - 3, py - 3, px + 3, py + 3], outline=(0, 255, 0))
    cantos = [para_foto(h, x, z) for x, z in ((X0, Z0), (X1, Z0), (X1, Z1), (X0, Z1))]
    desenho.polygon(cantos, outline=(255, 0, 255), width=3)
    for parte, (x, z, _) in PARTES.items():
        px, py = para_foto(h, x, z)
        desenho.ellipse([px - 9, py - 9, px + 9, py + 9], outline=(0, 200, 255), width=4)
        desenho.text((px + 12, py - 8), parte, fill=(0, 200, 255))
    conferencia.save(CONFERENCIA, quality=85)

    # O centro do alvo fica na face de cima da protoboard: o modelo e deslocado para esse ponto ir a origem.
    zc = (Z0 + Z1) / 2
    print(f"alvo {largura}x{altura} px, largura fisica = {X1 - X0:.4f} m")
    print(f"modelo3D: posicao [{-(X0 + X1) / 2:.4f}, {-SUPERFICIE_Y:.4f}, {-zc:.4f}], rotacao [0, 0, 0]")
    for parte, (x, z, topo) in PARTES.items():
        u = (x - X0) / (X1 - X0)
        v = (z - Z0) / (Z1 - Z0)
        print(f"  {parte:12} u={u:.3f} v={v:.3f} alturaExtra={topo - SUPERFICIE_Y:.4f}")


if __name__ == "__main__":
    main()
