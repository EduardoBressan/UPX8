"""
Gera as imagens de referencia (targets) de DEMONSTRACAO usadas pelo
reconhecimento de imagem (ViroARImageMarker):

  assets/markers/multimetro-demo.png  -> painel frontal estilizado de um multimetro
  assets/markers/protoboard-demo.png  -> protoboard estilizada

Servem para testar o app sem ter o equipamento real em maos: abra a imagem
na tela do computador ou imprima no tamanho indicado em
src/features/lab-ar/content/*.ts (physicalWidthMeters) e aponte o celular.

Para o laboratorio real, substitua pelas FOTOS dos equipamentos (ver
docs/RA-RECONHECIMENTO.md). As posicoes dos hotspots nos arquivos de
conteudo foram calculadas a partir das coordenadas usadas aqui.

Uso:  python scripts/gerar-marcadores-demo.py   (requer Pillow)
"""
import os
import random

from PIL import Image, ImageDraw, ImageFont

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, "assets", "markers")
FONTES = "C:/Windows/Fonts"


def fonte(tamanho, negrito=True):
    nome = "arialbd.ttf" if negrito else "arial.ttf"
    try:
        return ImageFont.truetype(os.path.join(FONTES, nome), tamanho)
    except OSError:
        return ImageFont.load_default()


def textura_borda(draw, largura, altura, espessura, semente):
    """Borda com blocos aleatorios: da ao ARCore muitos pontos de referencia (features)."""
    rnd = random.Random(semente)
    passo = 20
    for x in range(0, largura, passo):
        for y in range(0, altura, passo):
            na_borda = x < espessura or y < espessura or x >= largura - espessura or y >= altura - espessura
            if na_borda and rnd.random() < 0.5:
                cor = rnd.choice(["#111111", "#1565C0", "#C62828", "#2E7D32", "#F9A825"])
                draw.rectangle([x, y, x + passo - 1, y + passo - 1], fill=cor)


def centralizado(draw, xy, texto, f, cor):
    caixa = draw.textbbox((0, 0), texto, font=f)
    w, h = caixa[2] - caixa[0], caixa[3] - caixa[1]
    draw.text((xy[0] - w / 2, xy[1] - h / 2 - caixa[1]), texto, font=f, fill=cor)


def multimetro():
    W, H = 1000, 1600
    img = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(img)
    textura_borda(d, W, H, 60, semente=7)

    # Corpo
    d.rounded_rectangle([90, 90, W - 90, H - 90], radius=60, fill="#F2B705", outline="#222222", width=8)
    d.rounded_rectangle([130, 130, W - 130, H - 130], radius=40, fill="#2B2B2B")
    centralizado(d, (W / 2, 190), "RA LAB  DT-830", fonte(48), "#F2B705")

    # Display (centro aprox. u=0.50, v=0.20)
    d.rectangle([200, 240, 800, 400], fill="#A8B89A", outline="#111111", width=6)
    centralizado(d, (500, 320), "-12.48 V", fonte(96), "#1B1B1B")

    # Seletor rotativo (centro u=0.50, v=0.49)
    cx, cy, r = 500, 780, 210
    d.ellipse([cx - r - 90, cy - r - 90, cx + r + 90, cy + r + 90], fill="#3A3A3A")
    posicoes = [
        ("OFF", -90), ("DCV", -45), ("ACV", 0), ("DCA", 45), ("10A", 90),
        ("hFE", 135), ("•)))", 180), ("Ω", 225),
    ]
    import math
    for rotulo, ang in posicoes:
        a = math.radians(ang)
        tx, ty = cx + (r + 55) * math.cos(a), cy + (r + 55) * math.sin(a)
        centralizado(d, (tx, ty), rotulo, fonte(40), "#FFFFFF")
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill="#111111", outline="#F2B705", width=8)
    d.polygon([(cx - 30, cy), (cx + 30, cy), (cx + 8, cy - r + 20), (cx - 8, cy - r + 20)], fill="#F2B705")
    centralizado(d, (cx, cy + 60), "FUNÇÃO", fonte(34), "#BBBBBB")

    # Bornes (v=0.84): 10A u=0.25, COM u=0.50, VΩmA u=0.75
    bornes = [("10A", 250, "#C62828"), ("COM", 500, "#111111"), ("VΩmA", 750, "#C62828")]
    for rotulo, x, cor in bornes:
        y = 1350
        d.ellipse([x - 70, y - 70, x + 70, y + 70], fill="#DDDDDD", outline=cor, width=14)
        d.ellipse([x - 25, y - 25, x + 25, y + 25], fill="#000000")
        centralizado(d, (x, y - 115), rotulo, fonte(44), "#FFFFFF")
    centralizado(d, (500, 1450), "MAX 600V CAT II    10A FUSED", fonte(28, False), "#BBBBBB")

    img.save(os.path.join(SAIDA, "multimetro-demo.png"))


def protoboard():
    W, H = 1650, 620
    img = Image.new("RGB", (W, H), "white")
    d = ImageDraw.Draw(img)
    textura_borda(d, W, H, 40, semente=21)
    d.rounded_rectangle([60, 60, W - 60, H - 60], radius=20, fill="#F4F1EA", outline="#999999", width=4)

    colunas = 30
    x0, passo = 190, 44
    furo = 9

    def linha_furos(y, cor_furo="#444444"):
        for c in range(colunas):
            x = x0 + c * passo
            d.rectangle([x - furo, y - furo, x + furo, y + furo], fill=cor_furo)

    # Barramentos superiores (v ~ 0.17 e 0.22)
    for y, cor, sinal in [(95, "#C62828", "+"), (130, "#1565C0", "−")]:
        d.line([150, y - 22 if sinal == "+" else y + 22, W - 120, y - 22 if sinal == "+" else y + 22], fill=cor, width=6)
        linha_furos(y)
        centralizado(d, (115, y), sinal, fonte(40), cor)

    # Area de terminais: linhas a-e acima do canal central, f-j abaixo
    letras_sup = "abcde"
    letras_inf = "fghij"
    ys_sup = [190, 222, 254, 286, 318]
    ys_inf = [372, 404, 436, 468, 500]
    for letra, y in zip(letras_sup, ys_sup):
        linha_furos(y)
        centralizado(d, (150, y), letra, fonte(26), "#555555")
    for letra, y in zip(letras_inf, ys_inf):
        linha_furos(y)
        centralizado(d, (150, y), letra, fonte(26), "#555555")

    # Canal central (v ~ 0.45)
    d.rectangle([170, 338, x0 + colunas * passo - 20, 352], fill="#CFC8B8")

    # Numeracao das colunas
    for c in range(0, colunas, 5):
        x = x0 + c * passo
        centralizado(d, (x, 168), str(c + 1), fonte(22), "#555555")

    # Destaque: uma coluna de 5 furos conectados (coluna 12, a-e)
    xc = x0 + 11 * passo
    d.rounded_rectangle([xc - 16, 172, xc + 16, 336], radius=10, outline="#2E7D32", width=5)

    centralizado(d, (W / 2, 538), "RA LAB · PROTOBOARD 400", fonte(24), "#777777")
    img.save(os.path.join(SAIDA, "protoboard-demo.png"))


if __name__ == "__main__":
    os.makedirs(SAIDA, exist_ok=True)
    multimetro()
    protoboard()
    print("Marcadores gerados em", SAIDA)
