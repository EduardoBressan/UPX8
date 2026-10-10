"""
Gera a imagem de referencia (target) de DEMONSTRACAO da protoboard usada
pelo reconhecimento de imagem (ViroARImageMarker):

  assets/markers/protoboard-demo.png  -> protoboard estilizada

(O alvo do alicate FT-266 vem de uma foto real: ver scripts/gerar-alvo-ft266.py.)

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
    protoboard()
    print("Marcadores gerados em", SAIDA)
