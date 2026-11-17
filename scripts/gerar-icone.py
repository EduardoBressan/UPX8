"""
Gera o icone do LabLens: uma lente de lupa com um raio laranja (o mesmo do
app) sobre um fundo azul-escuro com uma grade suave, lembrando a camera de RA.

Saidas (assets/images/):
  icon.png                     icone completo (Android antigo, web e iOS)
  android-icon-background.png  fundo do icone adaptativo do Android
  android-icon-foreground.png  lente e raio do icone adaptativo (dentro da area segura)
  android-icon-monochrome.png  silhueta branca para o icone tematico do Android 13+
  splash-icon.png              lente e raio da tela de abertura
  favicon.png                  icone da versao web

Uso:  python scripts/gerar-icone.py   (requer Pillow)
"""
import os

from PIL import Image, ImageDraw

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, "assets", "images")

TAMANHO = 1024
AMOSTRAGEM = 4  # desenha 4x maior e reduz: bordas suaves

AZUL_CLARO = (21, 101, 192)
AZUL_ESCURO = (11, 37, 69)  # tambem usado como cor de fundo da abertura no app.json
LARANJA = (255, 152, 0)
BRANCO = (255, 255, 255)

# Raio em coordenadas relativas (altura 1, centrado na origem).
RAIO = [(0.05, -0.5), (-0.27, 0.07), (-0.03, 0.07), (-0.12, 0.5), (0.27, -0.1), (0.03, -0.1), (0.2, -0.5)]


def fundo(t):
    imagem = Image.new("RGB", (t, t))
    pixels = imagem.load()
    for y in range(t):
        for x in range(t):
            f = (x + y) / (2 * (t - 1))  # degrade na diagonal
            pixels[x, y] = tuple(round(a + (b - a) * f) for a, b in zip(AZUL_CLARO, AZUL_ESCURO))
    desenho = ImageDraw.Draw(imagem, "RGBA")
    passo = t // 12
    for i in range(1, 12):
        desenho.line([(i * passo, 0), (i * passo, t)], fill=(255, 255, 255, 18), width=max(1, t // 512))
        desenho.line([(0, i * passo), (t, i * passo)], fill=(255, 255, 255, 18), width=max(1, t // 512))
    return imagem


def lente(t, cor_raio=LARANJA, cor_lente=BRANCO, vidro=True):
    """Lente, cabo e raio sobre fundo transparente, dentro da area segura do icone adaptativo."""
    imagem = Image.new("RGBA", (t, t), (0, 0, 0, 0))
    desenho = ImageDraw.Draw(imagem)
    s = t / 1024
    cx, cy, raio_ext, espessura = 462 * s, 462 * s, 205 * s, 52 * s

    # Cabo: do aro na diagonal ate o canto inferior direito, com pontas arredondadas.
    inicio = (cx + raio_ext * 0.68, cy + raio_ext * 0.68)
    fim = (690 * s, 690 * s)
    largura_cabo = 78 * s
    desenho.line([inicio, fim], fill=cor_lente, width=round(largura_cabo))
    r = largura_cabo / 2
    desenho.ellipse([fim[0] - r, fim[1] - r, fim[0] + r, fim[1] + r], fill=cor_lente)

    if vidro:
        desenho.ellipse([cx - raio_ext, cy - raio_ext, cx + raio_ext, cy + raio_ext], fill=(255, 255, 255, 40))
    desenho.ellipse([cx - raio_ext, cy - raio_ext, cx + raio_ext, cy + raio_ext], outline=cor_lente, width=round(espessura))

    altura = 250 * s
    pontos = [(cx + x * altura, cy + y * altura) for x, y in RAIO]
    desenho.polygon(pontos, fill=cor_raio)
    return imagem


def reduzir(imagem, tamanho):
    return imagem.resize((tamanho, tamanho), Image.LANCZOS)


def main():
    t = TAMANHO * AMOSTRAGEM
    base = fundo(t)
    frente = lente(t)

    completo = base.convert("RGBA")
    completo.alpha_composite(frente)
    reduzir(completo, TAMANHO).save(os.path.join(SAIDA, "icon.png"))
    reduzir(completo, 48).save(os.path.join(SAIDA, "favicon.png"))

    reduzir(base, TAMANHO).save(os.path.join(SAIDA, "android-icon-background.png"))
    reduzir(frente, TAMANHO).save(os.path.join(SAIDA, "android-icon-foreground.png"))
    reduzir(frente, 512).save(os.path.join(SAIDA, "splash-icon.png"))

    # Silhueta toda branca (o Android aplica a cor do tema): sem o vidro, o raio continua visivel dentro do aro.
    mono = lente(t, cor_raio=BRANCO, vidro=False)
    reduzir(mono, TAMANHO).save(os.path.join(SAIDA, "android-icon-monochrome.png"))
    print("icones gerados em", SAIDA)


if __name__ == "__main__":
    main()
