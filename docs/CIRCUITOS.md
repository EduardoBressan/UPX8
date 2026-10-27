# Circuitos (RA por reconhecimento de imagem)

A tela **Circuitos** agora funciona igual à de **Equipamentos**: cada circuito do laboratório tem uma imagem de referência (o "alvo") e um modelo 3D pronto. Quando a câmera reconhece o circuito, o modelo 3D aparece em cima da montagem real, com os pinos numerados de cada parte e guias passo a passo. Não precisa de internet nem do backend.

O código é o mesmo da RA de equipamentos (`src/features/lab-ar/`); muda só o catálogo:

| Tela | Rota | Catálogo (`content/index.ts`) |
|---|---|---|
| Equipamentos | `src/app/ar.tsx` | `EQUIPAMENTOS_AR` (multímetro FT-266, protoboard) |
| Circuitos | `src/app/circuito.tsx` | `CIRCUITOS_AR` (circuito ESP32 + LED) |

## Circuito ESP32 + LED

Pino D2 → fio preto → resistor 1 kΩ → LED vermelho → fio roxo → barramento − → fio laranja → GND do ESP32.

| Arquivo | O que é |
|---|---|
| `assets/models/circuito-esp32-led.glb` | modelo 3D (escala real, em metros) |
| `docs/fotos/circuito-esp32-led-referencia.jpg` | foto de cima da montagem |
| `scripts/gerar-alvo-circuito-esp32.py` | endireita a foto e gera o alvo; imprime posições das partes e do modelo |
| `assets/markers/circuito-esp32-led.jpg` | alvo (5,2 cm de largura real) |
| `docs/fotos/circuito-esp32-led-conferencia.jpg` | furos e partes desenhados sobre a foto, para conferir |
| `src/features/lab-ar/content/circuito-esp32-led.ts` | partes, explicações e guias |

Dicas de uso: aponte de cima, com o **ESP32 inteiro** na tela (é a parte com mais detalhes, por onde o circuito é reconhecido) e boa luz.

## Adicionar outro circuito

1. Modele o circuito em escala real (metros) e exporte `.glb` para `assets/models/`.
2. Tire uma foto bem de cima e coloque em `docs/fotos/`.
3. Copie `scripts/gerar-alvo-circuito-esp32.py`, ajuste os pontos de calibração (`CALIBRACAO`), o recorte e as `PARTES`, e rode o script.
4. Crie o arquivo de conteúdo seguindo `circuito-esp32-led.ts`, com os valores impressos pelo script, e inclua em `CIRCUITOS_AR`.

---

A primeira versão (a IA lia a foto e o app montava uma protoboard virtual) foi removida do código.
