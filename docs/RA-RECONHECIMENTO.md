# RA por reconhecimento de imagem (padrão WL01)

O app reconhece o equipamento real pela câmera, ancora sobre ele **pinos 3D numerados com etiquetas** apontando cada parte e mostra, num painel na parte de baixo da tela:

- o que é cada parte e como usar (toque no número, na peça ou na lista);
- **guias passo a passo** ("Medir tensão DC", "Montar um LED com resistor"...): a cada passo, a parte certa acende em laranja **na própria peça**;
- alertas de segurança por nível (dica / atenção / perigo).

Fluxo (o mesmo do WL01 do professor):

```
câmera → ARCore reconhece a imagem de referência → âncora → pinos/etiquetas 3D (+ modelo .glb opcional) → toque → explicação/guia
```

## Onde fica cada coisa

```
src/features/lab-ar/
├── content/            ← CONTEÚDO DIDÁTICO (é aqui que a equipe mais mexe)
│   ├── multimetro.ts   partes, guias de uso, cuidados, imagem de referência
│   ├── protoboard.ts
│   └── index.ts        catálogo: lista de tudo que o app reconhece
├── scene/
│   ├── LabRecognitionScene.tsx   cena Viro: registra os alvos e ancora os pinos
│   └── HotspotMarker3D.tsx       pino + linha + etiqueta 3D (billboard)
├── ui/ARHud.tsx        interface 2D por cima da câmera (status, painéis, guia)
├── arStore.ts          estado compartilhado entre a cena 3D e a interface 2D
├── geometry.ts         converte (u, v) da imagem → posição 3D em metros
├── ARView.tsx          ViroARSceneNavigator + HUD
└── ARView.web.tsx      aviso no navegador (Viro não roda na web)

assets/markers/         imagens de referência (alvos)
scripts/gerar-marcadores-demo.py   gera as imagens de demonstração
```

## 1. Rodar no celular (development build via EAS)

O ViroReact é código nativo: **não funciona no Expo Go**. É preciso um *development build* (um APK do próprio app) instalado num Android **compatível com ARCore** ([lista oficial](https://developers.google.com/ar/devices)).

```bash
npm install --global eas-cli
eas login
eas build --profile development --platform android
```

Quando o build terminar, abra o link/QR code que o EAS mostra no celular e instale o APK. Depois, no computador:

```bash
npx expo start
```

e abra o app instalado (ele se conecta ao Metro como o Expo Go fazia). Só é preciso gerar um build novo quando mudar dependências nativas ou o `app.json`. Mudanças em `src/` e em `content/` recarregam na hora.

## 2. Testar sem o equipamento (imagens de demonstração)

`assets/markers/multimetro-demo.png` e `assets/markers/protoboard-demo.png` são desenhos com bastante detalhe, feitos para o ARCore reconhecer bem. Para testar:

1. abra uma delas na tela do computador (ou imprima: multímetro com **12 cm** de largura, protoboard com **16,5 cm**);
2. no app, toque em **Abrir câmera de RA** e aponte para a imagem;
3. os pinos numerados aparecem sobre o display, o seletor, os bornes etc.

> Se exibir na tela do PC, a largura real na tela deve ser parecida com `larguraFisicaMetros`. Se não for, os pinos aparecem um pouco deslocados (o ARCore estima a distância pelo tamanho informado).

## 3. Trocar pelas fotos dos equipamentos reais do laboratório

Para cada equipamento:

1. **Fotografe** o painel de frente, bem iluminado, sem reflexo, e **recorte** só a área do painel.
2. Salve em `assets/markers/` (ex.: `multimetro-lab.png`) e troque o `require(...)` em `alvo.imagem`.
3. **Meça com uma régua** a largura real da área recortada e coloque em `larguraFisicaMetros` (em metros: 9,5 cm = `0.095`).
4. **Recalcule os pontos** de cada parte: abra a foto num editor de imagem, veja o pixel (x, y) do centro da parte e use
   `u = x / largura_da_imagem` e `v = y / altura_da_imagem`.
5. Ajuste `alturaEtiqueta` dos pontos vizinhos para as etiquetas não ficarem sobrepostas.

Dicas para a imagem ser bem reconhecida (recomendações do ARCore):
- muito detalhe e contraste (texto, símbolos, bordas). Evite áreas lisas ou padrões repetitivos;
- no mínimo 300×300 px;
- o Google tem a ferramenta `arcoreimg` (no ARCore SDK) que dá uma nota de 0 a 100 para a imagem: use imagens com nota **≥ 75**.

**Protoboard real:** é uma grade repetitiva de furos, ruim para reconhecer. Cole um **marcador impresso** (ex.: a própria imagem demo, ou um cartão com logo e texto) num ponto fixo ao lado da protoboard e defina os pontos em relação a ele. `u` e `v` podem ser menores que 0 ou maiores que 1 para pontos fora do marcador (ex.: `u: 1.4` = à direita do marcador, a 40% da largura dele).

## 4. Adicionar os modelos 3D (.glb / .obj)

O Metro já aceita `.glb`, `.gltf`, `.bin`, `.obj` e `.mtl` (ver `metro.config.js`).

Já existem **modelos de demonstração** (`assets/models/multimetro-demo.glb` e `protoboard-demo.glb`), gerados por `python scripts/gerar-modelos-demo.py`. Eles usam a própria imagem de referência como textura na face de cima e já vêm alinhados com ela, por isso usam `posicao/rotacao [0, 0, 0]` e `escala [1, 1, 1]`. `alturaSuperficie` (espessura do modelo) e `alturaExtraNoModelo` (peças saltadas, como o seletor) fazem os pinos ficarem em cima do modelo, e não escondidos dentro dele.

Para trocar pelo modelo real:

1. Coloque o arquivo em `assets/models/` (ex.: `multimetro.glb`). Prefira **.glb** (um arquivo só, com texturas embutidas) e modelos leves (< 5 MB).
2. Em `content/multimetro.ts`, descomente o bloco `modelo3D` e aponte para o arquivo.
3. Ajuste `escala`, `rotacao` e `posicao`. O sistema de coordenadas é o da imagem reconhecida: origem no centro, X para a direita, **Y saindo da imagem** e Z para a parte de baixo da imagem, em metros. Modelos .glb costumam vir com Y para cima, então um painel modelado de frente geralmente precisa de `rotacao: [-90, 0, 0]` para "deitar" sobre a imagem.
4. O botão **Modelo 3D** aparece no topo da tela de RA para mostrar/ocultar o modelo.

Para `.obj`, use `tipo: 'OBJ'` e passe o `.mtl` e as texturas em `recursos: [require(...), ...]`.

## 5. Adicionar um equipamento novo (ex.: osciloscópio)

1. Copie `content/multimetro.ts` para `content/osciloscopio.ts` e preencha: imagem, largura, partes (`hotspots`) e guias (`procedimentos`).
2. Inclua no array `EQUIPAMENTOS_AR` em `content/index.ts`.

A cena registra o alvo novo sozinha. Não é preciso mexer em `scene/` nem em `ui/`.

## Limitações conhecidas

- Só reconhece o que estiver cadastrado em `content/` (escolha do projeto: reconhecimento por imagem, sem IA na nuvem).
- Quando a imagem sai do enquadramento, o ARCore mantém os pinos na última posição conhecida e o app avisa "fora de vista".
- As posições dos pinos dependem de `larguraFisicaMetros` estar correta.
- Não foi testado em iOS (o projeto está configurado para Android/ARCore).
