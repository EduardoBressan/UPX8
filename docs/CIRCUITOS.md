# Circuitos

A tela **Circuitos** usa o mesmo reconhecimento de imagem da tela **Equipamentos**: cada circuito do laboratório tem uma imagem de referência (o "alvo") e um modelo 3D. Quando a câmera reconhece o circuito, o modelo aparece sobre a montagem real, com pinos numerados em cada parte e guias passo a passo. Tudo roda no celular, sem internet.

As duas telas compartilham o código de `src/features/lab-ar/`; muda só o catálogo:

| Tela | Rota | Catálogo (`content/index.ts`) |
|---|---|---|
| Equipamentos | `src/app/ar.tsx` | `EQUIPAMENTOS_AR` (multímetro FT-266, protoboard) |
| Circuitos | `src/app/circuito.tsx` | `CIRCUITOS_AR` (circuito ESP32 + LED) |

## Circuito ESP32 + LED

Caminho da corrente: pino D2 → fio preto → resistor 1 kΩ → LED vermelho → fio roxo → barramento − → fio laranja → GND do ESP32.

| Arquivo | Conteúdo |
|---|---|
| `assets/models/circuito-esp32-led.glb` | modelo 3D, em escala real (metros) |
| `docs/fotos/circuito-esp32-led-referencia.jpg` | foto de cima da montagem (mesa clara) |
| `docs/fotos/circuito-esp32-led-mesa-escura-*.jpg` | fotos da mesma montagem em mesa escura, para os alvos extras |
| `scripts/gerar-alvo-circuito-esp32.py` | endireita a foto, gera o alvo e imprime as posições das partes e do modelo |
| `assets/markers/circuito-esp32-led.jpg` | alvo: a placa do ESP32 (2,6 cm de largura real) |
| `assets/markers/circuito-esp32-led-2.jpg`, `-3.jpg` | o mesmo recorte em mesa escura e com pouca luz |
| `docs/fotos/circuito-esp32-led-conferencia.jpg` | furos e partes desenhados sobre a foto, para conferência |
| `src/features/lab-ar/content/circuito-esp32-led.ts` | partes, explicações e guias |

### Por que o alvo é só o ESP32

O ARCore reconhece imagens pelos detalhes. A placa do ESP32 é rígida e tem muito texto e componentes; já a grade de furos da protoboard é um padrão repetitivo, e fios e mesa mudam de uma montagem para outra. Por isso o alvo é só o ESP32, e o resto do circuito é posicionado em relação a ele.

O mesmo recorte do ESP32 é cadastrado a partir de três fotos (mesa clara e mesa escura com pouca luz), em `alvo.imagensExtras`: o circuito é reconhecido por qualquer uma delas. O script alinha cada foto extra pelos 4 furos de fixação do ESP32, então todas têm o mesmo enquadramento e tamanho e usam as mesmas posições das partes. Para acrescentar uma foto, coloque-a em `docs/fotos/`, inclua em `FOTOS_EXTRAS` com a posição dos 4 furos e rode o script.

### Como usar

- Aproxime o celular até o ESP32 ocupar cerca de metade da tela, de cima, com boa luz e sem reflexo no módulo prateado.
- Mova o celular devagar até o modelo aparecer. Depois disso, pode afastar: o modelo fica preso na posição.
- Não deixe fios passando por cima do ESP32.

## Adicionar outro circuito

1. Modele o circuito em escala real (metros) e exporte o `.glb` para `assets/models/`.
2. Tire uma foto bem de cima e salve em `docs/fotos/`.
3. Copie `scripts/gerar-alvo-circuito-esp32.py`, ajuste os pontos de calibração (`CALIBRACAO`), o recorte (`X0`, `X1`, `Z0`, `Z1`) e as `PARTES`, e rode o script.
4. Crie o arquivo de conteúdo seguindo `circuito-esp32-led.ts`, com os valores impressos pelo script, e inclua em `CIRCUITOS_AR`.
