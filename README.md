# ⚡ RA Lab — Realidade Aumentada para Laboratório de Eletrônica

Aplicativo Android que usa **realidade aumentada** para ajudar estudantes em laboratórios de eletrônica. O aluno aponta a câmera do celular para um equipamento (o **multímetro FT-266** e uma protoboard) ou para um **circuito montado** (ESP32 + LED) e o app:

- **reconhece o equipamento** pela câmera;
- mostra um **modelo 3D** sobre a peça real;
- aponta, com **pinos numerados e etiquetas 3D**, o que cada parte faz;
- explica cada parte (o que é, como usar, dicas e alertas de segurança);
- oferece **guias passo a passo** ("Medir tensão DC", "Montar um LED com resistor"...), acendendo na própria peça a parte usada em cada passo.

> Projeto acadêmico. O conteúdo é educacional: em procedimentos de risco, siga sempre a orientação do professor.

## Equipamentos e Circuitos

A tela inicial tem dois caminhos, que usam o mesmo mecanismo de reconhecimento:

- **Equipamentos**: multímetro FT-266 (frente e parte de trás) e protoboard;
- **Circuitos**: circuito ESP32 + LED montado na protoboard. O app reconhece a placa do ESP32, coloca o modelo 3D do circuito sobre a montagem real e explica cada parte (ESP32, pino D2, resistor, LED e fios), com guias para seguir o caminho da corrente e conferir a montagem com o multímetro. Detalhes em **[docs/CIRCUITOS.md](docs/CIRCUITOS.md)**.

## Como funciona

O app segue o padrão **WL01 (Recognition AR)** com [ViroReact](https://viro-community.readme.io/):

```
câmera → ARCore reconhece a imagem de referência → âncora 3D → modelo + pinos + etiquetas → toque → explicação / guia
```

Cada equipamento tem uma **imagem de referência** cadastrada. Quando a câmera encontra essa imagem, o conteúdo 3D fica "preso" a ela e acompanha o equipamento quando o celular se move.

**O que já está cadastrado:**

| Equipamento | Partes explicadas | Guias de uso |
|---|---|---|
| Multímetro FT-266, frente (equipamento real, com modelo 3D próprio) | Seletor, display, bornes V Ω / COM / EXT, botão Data Hold | Tensão DC, tensão AC, resistência, continuidade |
| Multímetro FT-266, parte de trás | Etiqueta de aviso, parafuso e tampa da bateria | Trocar a bateria |
| Protoboard | Barramentos + e −, colunas conectadas, canal central, coordenadas | Montar LED com resistor, encaixar um CI |
| Circuito ESP32 + LED (com modelo 3D próprio) | ESP32, pino D2, fio de GND, resistor 1 kΩ, LED, fio do catodo | Caminho da corrente, conferir a montagem com o multímetro |

## Tecnologias

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) + Expo Router + React Native 0.86 + TypeScript
- [ViroReact](https://github.com/ReactVision/viro) 2.57 (ARCore no Android) para a realidade aumentada
- EAS Build para gerar o APK de desenvolvimento

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou 22 (LTS)
- Celular **Android compatível com ARCore** ([lista de aparelhos](https://developers.google.com/ar/devices)) com o app **Google Play Services for AR** instalado/atualizado
- Conta grátis no [Expo](https://expo.dev/signup) (para gerar o APK na nuvem)

> ⚠️ **Não funciona no Expo Go.** O ViroReact usa código nativo, então é preciso instalar um *development build* (o APK do próprio app). O passo a passo está abaixo.

## Como rodar

### 1. Instalar as dependências

```bash
npm install
```

### 2. Gerar e instalar o APK (só na primeira vez)

```bash
npm install --global eas-cli
eas login
eas build --profile development --platform android
```

O build roda na nuvem e leva de 10 a 25 minutos. No final, o terminal mostra um **link e um QR code**:

1. abra o link no celular e toque em **Install** para baixar o `.apk`;
2. permita **instalar apps desta fonte** quando o Android pedir;
3. se o Play Protect avisar, toque em **Mais detalhes → Instalar mesmo assim**.

Só é preciso gerar um APK novo quando mudarem dependências nativas ou o `app.json`.

### 3. Iniciar o servidor e conectar o celular

```bash
npx expo start
```

Com o **celular e o computador na mesma rede Wi-Fi**, abra o app **TesteUPX** no celular (não o Expo Go) e:

- toque no servidor que aparece na lista; **ou**
- digite `http://SEU_IP:8081` e toque em **Connect** (descubra o IP com `ipconfig`, em "Endereço IPv4" da rede Wi-Fi).

Se não conectar, libere o Node.js no firewall do Windows ou use `npx expo start --tunnel`.

Mudanças no código aparecem na hora. Se precisar, aperte `r` no terminal para recarregar.

## Como testar

**Com o multímetro FT-266 real:**

1. deite o multímetro numa mesa, com o painel para cima e o **seletor em OFF** (como na foto de referência);
2. no app, toque em **Equipamentos** e permita a câmera;
3. aponte o celular para o painel a uns 30 cm e mova devagar;
4. o modelo 3D aparece sobre o aparelho real: toque nos números e experimente os **Guias de uso**. As partes usadas em cada passo acendem em laranja (e o botão Data Hold é pressionado no modelo);
5. vire o multímetro com a parte de trás para cima: o app reconhece o outro lado e mostra a tampa da bateria e o guia **Trocar a bateria**.

**Sem o multímetro:** abra `assets/markers/ft266-frente.jpg` (ou `ft266-traseira.jpg`) na tela do computador com **6,5 cm de largura** (a largura real do corpo do aparelho) e aponte o celular para ela.

**Protoboard de demonstração:** use `assets/markers/protoboard-demo.png` com **cerca de 16,5 cm** de largura.

**Circuito ESP32 + LED:** toque em **Circuitos** e aproxime o celular até o ESP32 ocupar cerca de metade da tela, de cima e com boa luz. Depois que o modelo aparecer, dá para afastar: ele fica preso na posição. Sem o circuito, abra `assets/markers/circuito-esp32-led.jpg` na tela com **2,6 cm** de largura.

**Se não reconhecer:** diminua o brilho do monitor (reflexo atrapalha), segure o celular de frente para a tela e mova devagar. Imagens impressas costumam funcionar melhor.

## Estrutura do projeto

```
src/
├── app/                      Telas (Expo Router)
│   ├── index.tsx             Tela inicial
│   ├── ar.tsx                Câmera de RA: Equipamentos
│   └── circuito.tsx          Câmera de RA: Circuitos
└── features/lab-ar/          Toda a realidade aumentada
    ├── content/              ← CONTEÚDO DIDÁTICO (partes, guias, alertas)
    │   ├── multimetro-ft266.ts   (frente e parte de trás)
    │   ├── protoboard.ts
    │   ├── circuito-esp32-led.ts
    │   └── index.ts          Catálogos de Equipamentos e de Circuitos
    ├── scene/                Cena 3D do ViroReact (alvos, pinos, etiquetas)
    ├── ui/                   Interface 2D por cima da câmera
    ├── arStore.ts            Estado compartilhado entre a cena 3D e a interface
    └── geometry.ts           Converte posições da imagem em posições 3D

assets/
├── markers/                  Imagens de referência (o que a câmera reconhece)
└── models/                   Modelos 3D (.glb)

scripts/
├── gerar-alvo-ft266.py       Gera a imagem de referência do FT-266 a partir da foto
├── gerar-alvo-circuito-esp32.py  Gera a imagem de referência do circuito ESP32 + LED
├── gerar-marcadores-demo.py  Gera a imagem de demonstração da protoboard
└── gerar-modelos-demo.py     Gera o modelo 3D de demonstração da protoboard

docs/RA-RECONHECIMENTO.md     Guia detalhado de personalização
docs/CIRCUITOS.md             Tela de Circuitos e como cadastrar um circuito novo
```

## Personalizando

Tudo está explicado em **[docs/RA-RECONHECIMENTO.md](docs/RA-RECONHECIMENTO.md)**. Resumo:

- **Usar o equipamento real do laboratório:** fotografe o painel, salve em `assets/markers/`, meça a largura real e recalcule as posições das partes no arquivo de conteúdo.
- **Trocar o modelo 3D:** coloque o `.glb` em `assets/models/` e aponte para ele no arquivo de conteúdo (ex.: `content/multimetro-ft266.ts`). Bons lugares para encontrar modelos: [Sketchfab](https://sketchfab.com) (filtro "downloadable", formato glTF/GLB) e [Poly Pizza](https://poly.pizza). Confira sempre a licença.
- **Adicionar um equipamento novo** (ex.: osciloscópio): copie `content/multimetro-ft266.ts`, preencha e inclua em `content/index.ts`. Não é preciso mexer na cena 3D.
- **Regerar as imagens de referência do FT-266** (frente e trás) a partir das fotos em `docs/fotos/`. O script também imprime a posição de cada parte e gera `docs/fotos/ft266-*-conferencia.jpg` para conferir:

  ```bash
  python scripts/gerar-alvo-ft266.py
  ```

- **Regerar a protoboard de demonstração** (requer Python com Pillow):

  ```bash
  python scripts/gerar-marcadores-demo.py
  python scripts/gerar-modelos-demo.py
  ```

## Limitações conhecidas

- Só reconhece o que estiver cadastrado em `src/features/lab-ar/content/`.
- Protoboards reais são difíceis de reconhecer (grade repetitiva). Por isso o circuito é reconhecido pelo ESP32, e por isso é preciso chegar perto.
- A posição dos pinos depende da largura física (`larguraFisicaMetros`) estar correta.
- Configurado e testado apenas para Android.

## Créditos

- Estrutura de realidade aumentada baseada nos templates **WL01 Recognition AR** e **WL02 Spatial AR** fornecidos pelo professor.
- Modelos 3D do FT-266 (`assets/models/alicate-ft266.glb`) e do circuito ESP32 + LED (`assets/models/circuito-esp32-led.glb`) feitos pela equipe no Blender.
- Imagem e modelo de demonstração da protoboard gerados pelos scripts em `scripts/`.
