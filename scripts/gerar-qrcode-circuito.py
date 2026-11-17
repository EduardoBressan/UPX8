"""
Gera o QR Code de identificacao do circuito ESP32 + LED, que tambem e a imagem
de referencia (alvo) reconhecida pelo ARCore na tela de Circuitos.

A ideia e que cada circuito do laboratorio tenha o seu adesivo: o QR Code
identifica o circuito, e o app reconhece o adesivo e mostra o modelo 3D do
circuito em cima dele.

O adesivo tem so o QR Code, com o nome do circuito em cima e o nome do app
embaixo. Os textos tambem ajudam o ARCore, porque o QR Code sozinho e um
padrao repetitivo de quadrados.

O modelo 3D (assets/models/circuito-esp32-led.glb, em escala real) e centrado
no adesivo, deitado no mesmo plano, girado para a protoboard ficar na
horizontal (ESP32 a esquerda) e reduzido pela ESCALA_MODELO, para nao cobrir
demais o QR Code.

Saida:
  assets/markers/circuito-esp32-led-qrcode.png

Tambem imprime a posicao (u, v) e a altura de cada parte, usadas em
src/features/lab-ar/content/circuito-esp32-led.ts.

Uso:  python scripts/gerar-qrcode-circuito.py   (requer Pillow e segno)
"""
import math
import os

import segno
from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, "assets", "markers", "circuito-esp32-led-qrcode.png")

CONTEUDO_QR = "LabLens:circuito-esp32-led"
NOME = "Circuito ESP32 + LED"
LARGURA_METROS = 0.06  # tamanho real do adesivo impresso (ou exibido na tela)
TAMANHO_PX = 1200

ESCALA_MODELO = 0.5  # metade do tamanho real: a protoboard fica com ~8 x 3 cm sobre o QR Code de 6 cm
ROTACAO_Y = 90  # graus; deita a protoboard na horizontal, com o ESP32 a esquerda

# Partes apontadas no app: (x, z, topo y) no modelo, medidos nos vertices do .glb.
# Origem no centro da protoboard, X para a direita, Z para o lado do LED, Y para cima a partir da mesa.
PARTES = {
    "esp32": (0.0, -0.0458, 0.0158),
    "pino-d2": (-0.0140, -0.0660, 0.0231),
    "fio-laranja": (-0.0221, -0.0711, 0.0231),
    "resistor": (0.0, 0.0064, 0.0154),
    "led": (0.0204, 0.0130, 0.0259),
    "fio-roxo": (-0.0221, 0.0254, 0.0231),
}

# Fontes com acentos (Windows, Linux, macOS); sem nenhuma delas, usa a fonte embutida do Pillow.
FONTES = ["arialbd.ttf", "DejaVuSans-Bold.ttf", "/System/Library/Fonts/Supplemental/Arial Bold.ttf"]


def fonte(tamanho):
    for nome in FONTES:
        try:
            return ImageFont.truetype(nome, tamanho)
        except OSError:
            continue
    return ImageFont.load_default(size=tamanho)


def main():
    t = TAMANHO_PX
    imagem = Image.new("RGB", (t, t), "white")
    desenho = ImageDraw.Draw(imagem)

    # Nome do circuito em cima, QR Code no centro (com a margem branca exigida pelo padrao) e nome do app embaixo.
    titulo = fonte(int(t * 0.075))
    rodape = fonte(int(t * 0.05))
    qr = segno.make(CONTEUDO_QR, error="h")
    modulos = qr.symbol_size(border=4)[0]
    escala = int(t * 0.74 / modulos)
    lado_qr = modulos * escala
    inicio_x = (t - lado_qr) // 2
    inicio_y = int(t * 0.13)
    for linha, valores in enumerate(qr.matrix_iter(border=4)):
        for coluna, preto in enumerate(valores):
            if preto:
                x = inicio_x + coluna * escala
                y = inicio_y + linha * escala
                desenho.rectangle([x, y, x + escala - 1, y + escala - 1], fill="#000000")

    for texto, f, y in ((NOME, titulo, int(t * 0.045)), ("LabLens", rodape, int(t * 0.90))):
        caixa = desenho.textbbox((0, 0), texto, font=f)
        desenho.text(((t - (caixa[2] - caixa[0])) // 2 - caixa[0], y), texto, fill="#111111", font=f)

    imagem.save(SAIDA)

    print(f"alvo {t}x{t} px, largura fisica = {LARGURA_METROS:.3f} m, conteudo do QR: {CONTEUDO_QR}")
    print(f"modelo3D: posicao [0, 0, 0], rotacao [0, {ROTACAO_Y}, 0], escala {ESCALA_MODELO} (centrado no adesivo)")
    angulo = math.radians(ROTACAO_Y)
    for parte, (x, z, topo) in PARTES.items():
        # Mesma rotacao que o Viro aplica em torno do eixo Y, seguida da escala.
        xg = ESCALA_MODELO * (x * math.cos(angulo) + z * math.sin(angulo))
        zg = ESCALA_MODELO * (-x * math.sin(angulo) + z * math.cos(angulo))
        u = 0.5 + xg / LARGURA_METROS
        v = 0.5 + zg / LARGURA_METROS
        print(f"  {parte:12} u={u:.3f} v={v:.3f} alturaExtra={ESCALA_MODELO * topo:.4f}")


if __name__ == "__main__":
    main()
