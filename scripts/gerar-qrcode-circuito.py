"""
Gera o QR Code de identificacao do circuito ESP32 + LED, que tambem e a imagem
de referencia (alvo) reconhecida pelo ARCore na tela de Circuitos.

A ideia e que cada circuito do laboratorio tenha o seu adesivo: o QR Code
identifica o circuito, e o app reconhece o adesivo e mostra o modelo 3D do
circuito em cima dele.

Um QR Code sozinho e um padrao repetitivo de quadrados, ruim para o ARCore.
Por isso o QR fica no centro de uma moldura com desenhos, texto e cores sem
repeticao nem simetria: e a moldura que garante o reconhecimento rapido.

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
import random

import segno
from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, "assets", "markers", "circuito-esp32-led-qrcode.png")

CONTEUDO_QR = "LabLens:circuito-esp32-led"
NOME = "Circuito ESP32 + LED"
LARGURA_METROS = 0.06  # tamanho real do adesivo impresso (ou exibido na tela)
TAMANHO_PX = 1200
SEMENTE = 2026  # fixa o desenho da moldura: rodar de novo gera a mesma imagem

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
CORES = ["#111111", "#1f3a93", "#c0392b", "#e67e22", "#27ae60", "#8e44ad", "#555555"]


def fonte(tamanho):
    for nome in FONTES:
        try:
            return ImageFont.truetype(nome, tamanho)
        except OSError:
            continue
    return ImageFont.load_default(size=tamanho)


def desenhar_moldura(desenho, t, area_livre):
    """Formas aleatorias (com semente fixa) so na moldura, fora da area do QR Code."""
    sorteio = random.Random(SEMENTE)
    x0, y0, x1, y1 = area_livre
    colocadas = 0
    while colocadas < 70:
        cx, cy = sorteio.uniform(0.06, 0.94) * t, sorteio.uniform(0.06, 0.94) * t
        raio = sorteio.uniform(0.015, 0.045) * t
        if x0 - raio < cx < x1 + raio and y0 - raio < cy < y1 + raio:
            continue
        cor = sorteio.choice(CORES)
        forma = sorteio.random()
        if forma < 0.45:
            lados = sorteio.randint(3, 6)
            angulos = sorted(sorteio.uniform(0, 2 * math.pi) for _ in range(lados))
            pontos = []
            for a in angulos:
                r = raio * sorteio.uniform(0.5, 1)
                pontos.append((cx + r * math.cos(a), cy + r * math.sin(a)))
            desenho.polygon(pontos, fill=cor)
        elif forma < 0.75:
            desenho.ellipse([cx - raio, cy - raio, cx + raio, cy + raio], outline=cor, width=max(3, int(raio * 0.35)))
        else:
            desenho.rectangle([cx - raio, cy - raio * 0.45, cx + raio, cy + raio * 0.45], fill=cor)
        colocadas += 1


def main():
    t = TAMANHO_PX
    imagem = Image.new("RGB", (t, t), "white")
    desenho = ImageDraw.Draw(imagem)

    # QR Code no centro, ocupando pouco mais da metade do adesivo, com a margem branca exigida pelo padrao.
    qr = segno.make(CONTEUDO_QR, error="h")
    modulos = qr.symbol_size(border=4)[0]
    escala = int(t * 0.56 / modulos)
    lado_qr = modulos * escala
    inicio = (t - lado_qr) // 2
    matriz = qr.matrix_iter(border=4)
    for linha, valores in enumerate(matriz):
        for coluna, preto in enumerate(valores):
            if preto:
                x = inicio + coluna * escala
                y = inicio + linha * escala
                desenho.rectangle([x, y, x + escala - 1, y + escala - 1], fill="#000000")

    desenhar_moldura(desenho, t, (inicio, inicio, inicio + lado_qr, inicio + lado_qr))

    # Textos em faixas brancas: ajudam o reconhecimento e identificam o circuito para o aluno.
    for texto, tamanho, y in (("LabLens", int(t * 0.07), int(t * 0.045)), (NOME, int(t * 0.045), int(t * 0.885))):
        f = fonte(tamanho)
        caixa = desenho.textbbox((0, 0), texto, font=f)
        largura = caixa[2] - caixa[0]
        x = (t - largura) // 2
        desenho.rectangle([x - 18, y - 8, x + largura + 18, y + (caixa[3] - caixa[1]) + 22], fill="white")
        desenho.text((x - caixa[0], y), texto, fill="#111111", font=f)

    desenho.rectangle([0, 0, t - 1, t - 1], outline="#111111", width=int(t * 0.02))
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
