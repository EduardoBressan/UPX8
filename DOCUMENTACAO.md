# Assistente de RA + IA para Laboratório de Elétrica e Eletrônica

Documentação técnica do MVP implementado. Este documento é o relatório do que foi construído, as decisões tomadas e como rodar/testar o projeto.

> **Atualização: RA 3D por reconhecimento de imagem.** O fluxo principal do app passou a ser a RA ao vivo com ViroReact (padrão WL01 do professor): a câmera reconhece o equipamento, ancora pinos e etiquetas 3D em cada parte e mostra guias de uso passo a passo. Isso substitui a decisão da seção 5.1 (overlay sobre foto parada). Detalhes, build pelo EAS e como cadastrar os equipamentos reais estão em [docs/RA-RECONHECIMENTO.md](docs/RA-RECONHECIMENTO.md). O fluxo antigo (foto → Gemini → marcadores 2D) descrito abaixo **foi removido do código** (fica no histórico do Git); o backend em `server/` também foi removido: a tela de Circuitos usa o mesmo reconhecimento de imagem dos equipamentos ([docs/CIRCUITOS.md](docs/CIRCUITOS.md)).

## 1. Visão geral

Aplicativo educacional que usa a câmera do celular para identificar componentes eletrônicos em uma placa ou controles de um equipamento de laboratório (multímetro), exibindo marcadores tocáveis sobre a foto capturada com explicações didáticas. A identificação visual é feita por uma IA (Google Gemini); o conteúdo educacional exibido vem de uma base de conhecimento curada manualmente, nunca gerado pela IA — isso evita que o aplicativo "invente" explicações técnicas incorretas.

## 2. O que foi implementado

- **Tela inicial** com escolha entre "Circuitos eletrônicos" e "Equipamentos de laboratório".
- **Tela de câmera** por modo, com permissão, preview ao vivo, captura, estados de carregamento e erro.
- **Overlay de RA** sobre a foto capturada: marcadores discretos e pulsantes, card compacto ao tocar (informação progressiva) e painel completo de detalhes ao pedir "Ver detalhes".
- **Escolher foto da galeria** como alternativa à câmera ao vivo (`expo-image-picker`) — permite testar o app com uma foto já existente (ex.: uma foto de um multímetro) sem precisar de device físico nem da câmera ao vivo; funciona inclusive no navegador (`npx expo start --web`), rodando no mesmo computador que o backend.
- **Backend** (Node/Express/TypeScript) que recebe a foto, chama a Gemini com um prompt restrito ao domínio e schema JSON obrigatório, cruza o resultado com a base de conhecimento e devolve tudo pronto para o app renderizar.
- **Base de conhecimento** cadastrada: 5 componentes (resistor, capacitor, LED, transistor bipolar, circuito integrado) e 1 equipamento completo (multímetro digital, com 5 controles: seletor de função, display, entrada COM, entrada V/Ω, entrada de corrente), cada um com o que é, para que serve, como funciona/usar, identificação visual e alertas de segurança por nível (info/atenção/perigo).
- **Tratamento de incerteza**: se a IA não identificar nada com segurança, ou identificar com baixa confiança, o app avisa o aluno em vez de apresentar a informação como certeza.
- **Segurança**: chave da API nunca chega ao app; rate limiting; validação de payload; imagens não ficam armazenadas no backend.

## 3. Arquitetura

```
TesteUPX/
├── src/                          # App Expo (frontend)
│   ├── app/
│   │   ├── index.tsx             # Tela inicial (escolha do modo)
│   │   ├── _layout.tsx           # Layout raiz (Stack de navegação, sem tabs)
│   │   └── scanner/[mode].tsx    # Câmera + fluxo completo por modo
│   ├── features/
│   │   ├── camera/capturePhoto.ts        # Captura + redimensiona/comprime a foto
│   │   └── ar-overlay/                   # MarkerPin, MiniInfoCard, DetailPanel, OverlayCanvas
│   ├── services/api.ts           # Chamada HTTP ao backend
│   ├── types/analysis.ts         # Tipos espelhados do backend
│   └── components/, constants/, hooks/   # Base de UI reaproveitada do template (tema, ThemedText/View)
│
└── server/                       # Backend (Node + Express + TypeScript)
    └── src/
        ├── index.ts              # Bootstrap do Express
        ├── routes/analyze.ts     # POST /api/analyze
        ├── services/
        │   ├── geminiVision.ts     # Prompt + chamada a Gemini + validação da resposta
        │   └── knowledgeLookup.ts  # Junta identificação da IA com a base de conhecimento
        ├── knowledge/             # components.ts, equipment.ts, types.ts, index.ts
        └── middleware/            # validação de request, rate limit, tratamento de erro
```

### Fluxo de dados

1. App captura a foto (já redimensionada/comprimida) e envia `POST /api/analyze` com `{ mode, imageBase64, mimeType }`.
2. Backend valida a requisição e monta uma lista de **rótulos permitidos** vindos da própria base de conhecimento (a IA só pode escolher um destes — nunca inventa um nome novo).
3. Backend chama `ai.models.generateContent` da Gemini com a imagem + prompt + schema JSON obrigatório (`responseSchema`), pedindo `label`, `confidence` e `box_2d` para cada item visível.
4. Backend filtra qualquer rótulo fora da lista permitida (defesa extra), busca o conteúdo curado correspondente na base de conhecimento e converte as coordenadas para o formato usado pelo app.
5. App recebe a lista de itens + eventual aviso de incerteza, desenha os marcadores sobre a foto parada e exibe o painel de detalhes quando o aluno toca em um marcador.

## 4. Tecnologias e por quê

| Tecnologia | Papel | Motivo |
|---|---|---|
| Expo SDK 57 + expo-router | App Android (e potencialmente iOS/web) | Já era a base do projeto; permite build de desenvolvimento nativo via EAS sem exigir Xcode/Android Studio completos. |
| expo-camera | Captura de foto | API oficial, mantida, com permissões já resolvidas pelo plugin de config. |
| expo-image-manipulator | Redimensionar/comprimir a foto antes do envio | Reduz custo e tempo de resposta da IA; fotos de celular são grandes demais para enviar sem tratamento. |
| Node.js + Express + TypeScript | Backend | Mesma linguagem do app (menos troca de contexto); simples e suficiente para o escopo. |
| `@google/genai` (Gemini API) | Identificação visual | Camada gratuita viável para uso acadêmico; suporta saída JSON estruturada (`responseSchema`), essencial para não depender de "adivinhar" o formato da resposta em texto livre. |
| zod | Validação de entrada/saída | Garante que tanto a requisição do app quanto a resposta da IA tenham exatamente o formato esperado antes de confiar neles. |
| express-rate-limit | Proteção da cota gratuita da IA | Evita que um loop ou uso indevido esgote o limite diário da API. |

## 5. Decisões técnicas importantes

### 5.1 RA por overlay sobre foto, não ARCore/ViroReact

Decisão tomada em conjunto com você: em vez de rastreamento 3D real do ambiente (ARCore/ViroReact), os marcadores são posicionados sobre a foto capturada, usando as coordenadas normalizadas que a própria IA retorna. **Limitação assumida conscientemente**: se o aluno mover o celular, os marcadores não seguem o objeto em tempo real — só atualizam na próxima captura. Essa troca foi feita deliberadamente por confiabilidade, simplicidade e para evitar dependência de uma biblioteca de AR nativa (ViroReact) cuja compatibilidade com Expo SDK 57 não estava validada no momento da decisão.

### 5.2 IA identifica, a base de conhecimento explica

A Gemini só recebe permissão para responder com rótulos que já existem na base de conhecimento (lista fechada, reforçada tanto no prompt quanto por um filtro no backend) e nunca gera o texto explicativo — isso atende diretamente ao requisito do projeto de nunca deixar a IA "inventar" informação técnica. A resposta final que o app recebe sempre carrega a origem da informação (`identificacao_visual` vs conteúdo da base).

### 5.3 Equipamento identifica controles, não o aparelho inteiro

No modo "equipamento", os rótulos válidos são os **controles individuais** do multímetro (seletor, display, entradas), não "multímetro" como um todo — é isso que permite mostrar uma explicação por botão/entrada, como pedido na especificação original.

### 5.4 API do Gemini: `generateContent`, não a "Interactions API"

A documentação pública atual da Gemini destaca uma "Interactions API" (`ai.interactions.create`). Ao testar contra o pacote `@google/genai` realmente instalado (v1.52.0), essa API tem um formato bem mais complexo (`Turn`) e não é o caminho mais estável para este caso de uso. Foi usado `ai.models.generateContent` com `responseMimeType`/`responseSchema`, validado diretamente contra os tipos do pacote instalado — API mais simples, madura e adequada para "enviar uma imagem, receber um JSON validado".

## 6. Segurança implementada

- `GEMINI_API_KEY` só existe em `server/.env` (nunca commitado — `.gitignore` cobre `.env`, `.env.local` e `server/.env`).
- Rate limit de 20 requisições/minuto no endpoint `/api/analyze`.
- Validação de payload: `mode` restrito a `circuito`/`equipamento`, imagem limitada a ~7MB em base64, apenas JPEG/PNG.
- Fotos processadas em memória e descartadas após a resposta — o backend não grava imagens em disco.
- Erros nunca vazam detalhes internos para o app (mensagens genéricas ao cliente, detalhes só no log do servidor, sem nunca logar a imagem).

## 7. Como rodar o projeto

### 7.1 Backend

```bash
cd server
npm install
cp .env.example .env
# Edite server/.env e cole sua chave em GEMINI_API_KEY
# (gere uma gratuitamente em https://aistudio.google.com/apikey)
npm run dev
```

O servidor sobe em `http://localhost:3000` (ou a porta definida em `PORT`).

### 7.2 Frontend

```bash
# na raiz do projeto
cp .env.example .env
# Edite .env: EXPO_PUBLIC_API_URL deve ser o IP local do computador
# rodando o backend (ex.: http://192.168.1.42:3000), NUNCA "localhost"
# — no celular físico, "localhost" aponta para o próprio celular.

npx expo start
```

### 7.3 Testando rapidamente no navegador, sem celular

Se você só quer testar a identificação (não a câmera ao vivo), pode rodar tudo no seu computador:

```bash
# EXPO_PUBLIC_API_URL pode ser http://localhost:3000 nesse caso —
# navegador e backend estão na mesma máquina.
npx expo start --web
```

Abra a tela de "Circuitos" ou "Equipamentos", toque em **"escolher uma foto já salva"** (ou no ícone de galeria ao lado do botão de captura) e selecione uma foto de um multímetro/placa que você já tenha no computador. O fluxo de identificação roda normalmente a partir daí — só a câmera ao vivo é que exige o development build no celular.

Como o app usa `expo-camera` (módulo nativo), **não funciona no Expo Go**. É necessário gerar um development build:

```bash
npx eas login
npx eas build:configure
npx eas build --profile development --platform android
```

Instale o `.apk`/build gerado no celular físico, mantenha-o na mesma rede Wi-Fi do computador rodando o backend, e rode `npx expo start` normalmente — o development build vai se conectar ao Metro bundler.

### 7.4 Variáveis de ambiente (resumo)

| Arquivo | Variável | Uso |
|---|---|---|
| `server/.env` | `GEMINI_API_KEY` | Chave da Gemini (obrigatória) |
| `server/.env` | `PORT` | Porta do backend (padrão 3000) |
| `server/.env` | `CORS_ORIGIN` | Origem permitida (padrão `*` em dev) |
| `.env` (raiz) | `EXPO_PUBLIC_API_URL` | IP:porta do backend, usado pelo app |

## 8. O que foi validado automaticamente (e o que não)

Validado nesta sessão, sem acesso a um dispositivo físico:

- **Backend**: `npx tsc --noEmit` limpo. Teste end-to-end local: subi o servidor com uma chave inválida de propósito e confirmei, pelo log do servidor, que a requisição chegou de fato ao servidor da Google e voltou com `"API key not valid"` — ou seja, toda a cadeia (Express → validação → Gemini SDK → schema) está corretamente ligada; só falta uma chave real seguir.
- **Frontend**: `npx tsc --noEmit` limpo, `npx expo lint` limpo, e `npx expo export --platform web` gerou o bundle e pré-renderizou as rotas `/` e `/scanner/[mode]` sem erros.

**Não foi possível validar** (dependem do seu dispositivo físico e de uma chave real da Gemini):

- Câmera real, permissões no Android físico, qualidade da captura em condições reais de laboratório.
- Precisão da identificação da Gemini em componentes/controles reais (iluminação, ângulo, foco).
- Comportamento do development build gerado via EAS.
- Posicionamento visual dos marcadores em fotos reais (a lógica de conversão de coordenadas foi implementada conforme a documentação, mas nunca vista "ao vivo").

Recomendo, como próximo passo seu: gerar uma chave Gemini gratuita, rodar o backend, gerar o development build e testar o fluxo completo com a placa e o multímetro reais — aí ajustamos junto qualquer imprecisão (ex.: prompt, limiares de confiança, posicionamento dos pinos).

## 9. Conteúdo educacional cadastrado no MVP

**Componentes (modo circuito):** resistor, capacitor, LED, transistor bipolar (BJT), circuito integrado.

**Equipamento (modo equipamento):** multímetro digital — seletor de função, display, entrada COM, entrada V/Ω, entrada de corrente. Cada um com avisos de segurança (ex.: nunca medir resistência em circuito energizado; nunca inserir o multímetro em paralelo ao medir corrente).

Adicionar um novo componente ou controle é só acrescentar uma entrada em `server/src/knowledge/components.ts` ou `equipment.ts` — nenhuma mudança de código é necessária em outro lugar.

## 10. Limitações honestas do projeto

- **RA sem rastreamento 3D real**: marcadores fixos na foto capturada, não no espaço físico (ver seção 5.1).
- **Sem osciloscópio ainda**: só o multímetro foi cadastrado no MVP, por decisão de escopo (menos controles, valida o fluxo mais rápido).
- **Dependência de internet**: a identificação exige chamada ao backend e à Gemini; sem conexão, o app mostra erro e permite tentar novamente, mas não funciona offline.
- **Cota gratuita da Gemini**: a camada free tier tem limites diários/por minuto; uso intenso simultâneo por vários alunos pode esbarrar nesse limite.
- **Identificação depende de boas condições de imagem**: pouca luz, desfoque ou ângulo ruim reduzem a confiança — o app já foi desenhado para avisar nesses casos, mas a precisão real só será conhecida em teste de campo.

## 11. Próximos passos sugeridos

1. Testar em campo com a placa e o multímetro reais; ajustar prompt/conteúdo conforme os erros observados.
2. Cadastrar o osciloscópio seguindo a mesma estrutura do multímetro.
3. Avaliar se o limiar de confiança (atualmente 0,5) precisa de ajuste.
4. Preparar prints/vídeo do fluxo funcionando para a apresentação acadêmica.
5. (Opcional, fora do MVP) Deploy do backend em um serviço gratuito (Render/Railway) caso você queira testar sem depender da rede local.

## 12. Arquivos criados, modificados e removidos nesta sessão

- **Criados**: toda a pasta `server/`, `src/types/analysis.ts`, `src/services/api.ts`, `src/features/camera/capturePhoto.ts`, `src/features/ar-overlay/*`, `src/app/scanner/[mode].tsx`, `.env.example` (raiz), `expo-env.d.ts`, este documento.
- **Modificados**: `src/app/index.tsx` (conteúdo do projeto em vez do template), `src/app/_layout.tsx` (Stack em vez de tabs), `src/constants/theme.ts` (novas cores semânticas), `src/components/animated-icon.tsx`/`.web.tsx` (splash sem logo do Expo), `src/hooks/use-color-scheme.web.ts` (correção de lint pré-existente), `app.json` (plugin da câmera), `.gitignore` (proteção de `.env`), `package.json`/`package-lock.json` (novas dependências).
- **Removidos** (artefatos do template padrão, sem relação com o projeto): tela "Explore", navegação em tabs, `HintRow`, `WebBadge`, imagens/ícones de exemplo do Expo/React não utilizados.

Nada foi commitado nem enviado ao GitHub, conforme solicitado — todas as mudanças estão apenas na sua working tree local.
