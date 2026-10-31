# ⚡ LabLens — Realidade Aumentada para Laboratório de Eletrônica

> **Projeto da disciplina UPX8 — Realidade Aumentada.**
> Aplicativo Android de Realidade Aumentada que ancora informações e guias de uso aos equipamentos e circuitos reais do laboratório de eletrônica.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![Plataforma](https://img.shields.io/badge/plataforma-Android-green)
![RA](https://img.shields.io/badge/RA-ViroReact%20%2B%20ARCore-blue)
![Expo](https://img.shields.io/badge/Expo-SDK%2057-black)

---

## 1. Identificação do Projeto

| Item | Informação |
|---|---|
| **Projeto** | LabLens — Laboratório de Eletrônica |
| **Equipe** | VantageAR |
| **Curso** | Engenharia da Computação |
| **Turma** | TIN2 |
| **Instituição** | Centro Universitário Facens — Sorocaba, SP |
| **Disciplina** | UPX8 — Realidade Aumentada |
| **Professor** | Daniel Ohata |
| **Semestre** | 2026.2 |
| **Artigo científico** | Uso de realidade aumentada para a identificação e o uso de equipamentos de laboratório de eletrônica no ensino de engenharia |

### Integrantes

| Nome | RA | Responsabilidade |
|---|---|---|
| Eduardo Bressan Paixão | 235246 | Requisitos, dataset, anotação de imagens e desenvolvimento |
| Felipe Rondello A. Lopes | 234763 | Pesquisa e documentação |
| João Guilherme Borges Feliciano | 235216 | UI/UX e análise de dados |
| Lucas Vinícius Tomé | 200354 | Modelo de visão computacional |
| Luiza Santos Mascarenhas Bottesi | 234894 | Gerência de projeto e desenvolvimento mobile |
| William Rocchi Dias | 235149 | Testes e experimento com usuários |

---

## 2. Visão Geral

Estudantes iniciantes de engenharia têm dificuldade para identificar as partes dos equipamentos de laboratório e para executar procedimentos básicos, como medir com um multímetro ou montar um circuito em protoboard. Isso consome tempo de monitoria e reduz o aproveitamento das aulas práticas.

O **LabLens** é um aplicativo móvel para Android voltado a esses estudantes. Ao apontar a câmera para um equipamento ou circuito do laboratório, o aluno vê, **ancorados à peça real**, um modelo 3D, pinos e etiquetas que indicam cada parte. Ao tocar numa parte, ele consulta o nome, a função e os cuidados. Nos guias passo a passo, cada etapa indica em 3D a parte envolvida e mostra os alertas de segurança aplicáveis.

A Realidade Aumentada é o centro da solução: o ARCore reconhece a imagem de referência e estima continuamente sua posição e orientação, e o ViroReact posiciona o conteúdo virtual sobre a peça. Tudo funciona no próprio celular, sem hardware dedicado e sem internet.

O aplicativo é também o instrumento de uma pesquisa, descrita no artigo científico da equipe, que vai medir o efeito da RA sobre o desempenho dos estudantes em comparação ao material impresso.

![Circuito montado usado nos testes do protótipo](docs/images/fotos/circuito-esp32-led-referencia.jpg)

---

## 3. Problema

**Contexto.** A formação em engenharia depende de atividades práticas de laboratório, nas quais o estudante precisa reconhecer equipamentos físicos e associá-los à teoria. A eletrônica é pré-requisito para disciplinas de instrumentação, controle e sistemas embarcados, então dificuldades nessa etapa tendem a se propagar pela formação.

**Situação atual.** A orientação depende de monitores, professores e materiais impressos, separados do equipamento real. O aluno precisa alternar a atenção entre o material e a peça.

**Dificuldade.** O problema não está na complexidade teórica do circuito, mas no reconhecimento dos elementos físicos e na sua correspondência com a representação simbólica. Parte do tempo de laboratório é consumida em dúvidas operacionais, e não na compreensão dos conceitos.

**Público afetado.** Estudantes iniciantes de engenharia e, indiretamente, monitores e professores que os acompanham.

**Impacto.** Menor aproveitamento das aulas práticas, maior dependência de acompanhamento individual, risco de erro em procedimentos e, em medições na rede elétrica, risco à segurança. O tema se relaciona ao **ODS 4**, Educação de Qualidade, na meta de ampliar o acesso a uma formação técnica e profissional efetiva.

**Lacuna.** A literatura indica efeito positivo médio da RA sobre a aprendizagem, condicionado ao modo como a informação é integrada à tarefa. Porém, as avaliações em eletrônica concentram-se na aceitação, na percepção dos estudantes ou no desempenho técnico do sistema, e são escassos os estudos que medem o desempenho dos estudantes na tarefa em comparação a recursos convencionais.

---

## 4. Objetivos

### 4.1 Objetivo Geral

Desenvolver e avaliar uma aplicação de realidade aumentada que ancora informações e guias de uso a equipamentos de laboratório de eletrônica, verificando seu efeito sobre o desempenho de estudantes de engenharia em comparação a material impresso.

### 4.2 Questão de pesquisa e hipótese

**RQ1 —** Qual é o efeito de uma aplicação de realidade aumentada que ancora informações aos equipamentos reais na taxa de acerto, no sucesso e no tempo de estudantes de engenharia durante a identificação de partes e a execução de procedimentos com multímetro e protoboard, em comparação ao uso de material impresso com conteúdo equivalente?

**H1 —** Estudantes que utilizarem a aplicação apresentarão maior taxa de acerto na identificação das partes, maior taxa de sucesso na execução do procedimento e menor tempo de execução do que estudantes que utilizarem material impresso com conteúdo equivalente.

### 4.3 Objetivos Técnicos

- Reconhecer imagens de referência com ARCore e estimar continuamente sua posição e orientação.
- Ancorar modelos 3D, pinos e etiquetas às partes reais com ViroReact.
- Permitir a consulta do nome, da função e dos cuidados de cada parte.
- Oferecer guias passo a passo com indicação em 3D e alertas de segurança.
- Sinalizar ao usuário a perda de rastreamento.
- Registrar as interações em sessões anônimas e exportá-las em CSV.
- Verificar tecnicamente o protótipo antes da avaliação com usuários.
- Executar o aplicativo em celulares Android, sem hardware dedicado e sem internet.

---

## 5. Público-Alvo

**Perfil:** estudantes de engenharia em início de curso, com pouca ou nenhuma experiência em laboratório de eletrônica. O experimento previsto terá estudantes de Engenharia da Computação do Centro Universitário Facens, do primeiro ao quarto semestre.

**Contexto de uso:** atividades práticas em bancada, com o equipamento à frente e o celular na mão.

**Necessidades:** localizar as partes no equipamento real, compreender a função de cada uma, executar procedimentos corretamente e receber alertas de segurança no momento do uso.

**Familiaridade tecnológica:** basta saber usar um smartphone. Os textos usam linguagem adequada a iniciantes, e não é necessário cadastro.

**Limitações:** é necessário um celular Android compatível com ARCore.

---

## 6. Funcionalidades

Os requisitos RF01 a RF09 são os definidos no artigo científico.

| ID | Funcionalidade | Descrição | Status |
|---|---|---|---|
| RF01 | Reconhecer o equipamento | Reconhece a imagem de referência e estima continuamente sua posição e orientação | ✅ |
| RF02 | Indicar as partes em 3D | Exibe pinos e etiquetas ancorados às partes, voltados para a câmera | ✅ |
| RF03 | Consultar uma parte | Ao tocar numa etiqueta, mostra nome, função e cuidados | ✅ |
| RF04 | Executar guia passo a passo | Apresenta passos sequenciais com indicação em 3D, e permite avançar e retornar | ✅ |
| RF05 | Exibir alertas de segurança | Mostra os alertas dos passos com risco ao usuário ou ao equipamento | ✅ |
| RF06 | Sinalizar perda de rastreamento | Informa quando o equipamento sai do campo de visão da câmera | ✅ |
| RF07 | Identificar a sessão | Inicia uma sessão com código anônimo de participante | ⬜ |
| RF08 | Registrar interações | Registra guias, partes consultadas, passos repetidos e perdas de rastreamento | ⬜ |
| RF09 | Exportar registros | Exporta os registros de cada sessão em arquivo CSV | ⬜ |
| RF10 | Tela inicial | Escolha entre Equipamentos e Circuitos | ✅ |
| RF11 | Reconhecer circuitos | Reconhece um circuito montado a partir de uma peça rígida, como o microcontrolador | ✅ |
| RF12 | Exibir modelo 3D | Mostra um modelo `.glb` em escala real sobre a peça, com opção de ocultar | ✅ |
| RF13 | Manter posição | Mantém o conteúdo no lugar quando a imagem sai de vista | ✅ |
| RF14 | Reconhecer novos modelos sem cadastro prévio | Ampliar o reconhecimento para outros modelos de equipamento e outros circuitos | ⬜ |
| RF15 | Marcador impresso | Folha A4 com marcador para reconhecer o circuito de mais longe | ❌ |

**Legenda:** ✅ Implementado · 🚧 Em desenvolvimento · ⬜ Planejado · ❌ Cancelado

---

## 7. Requisitos Não Funcionais

Os requisitos abaixo são os definidos no artigo científico. As metas numéricas ainda serão medidas na verificação técnica (seção 22).

| ID | Categoria | Requisito | Situação |
|---|---|---|---|
| RNF01 | Plataforma | Executar em Android compatível com ARCore; iOS fora do escopo do protótipo | ✅ |
| RNF02 | Funcionamento offline | Conteúdo e registros no próprio dispositivo, sem depender de internet | 🚧 Conteúdo atendido; registros planejados |
| RNF03 | Tempo de reconhecimento | Reconhecer em até 4 segundos após o enquadramento | ⬜ A medir |
| RNF04 | Desempenho | Média de 30 quadros por segundo | ⬜ A medir |
| RNF05 | Qualidade de rastreamento | Imagens planas, sem padrões repetitivos e com nota mínima 75 na ferramenta do ARCore | ⬜ A medir |
| RNF06 | Estabilidade | Conteúdo ancorado durante a movimentação e operação sem interrupções | 🚧 Em verificação |
| RNF07 | Ambiente de utilização | Funcionar sob a iluminação dos laboratórios, a distâncias de 30 cm a 1 m | 🚧 Em verificação |
| RNF08 | Usabilidade | Etiquetas legíveis e textos adequados a iniciantes | 🚧 Em verificação |
| RNF09 | Privacidade | Identificar o participante só por código anônimo, sem armazenar imagens da câmera | 🚧 Sem imagens armazenadas; registros planejados |

---

## 8. Tecnologias Utilizadas

| Tecnologia | Versão | Utilização |
|---|---|---|
| Expo | SDK 57 (57.0.23) | Plataforma de desenvolvimento e build |
| React Native | 0.86.3 | Interface e execução no Android |
| React | 19.2.3 | Componentes da interface |
| TypeScript | 6.0.3 | Linguagem do aplicativo |
| Expo Router | 57.0.29 | Navegação entre as telas |
| ViroReact (`@reactvision/react-viro`) | 2.57.3 | Cena 3D e integração com a RA |
| ARCore | fornecido pelo Google Play Services for AR | Reconhecimento e rastreamento de imagens no Android |
| Node.js | 22.12.0 | Ambiente de desenvolvimento |
| npm | 11.12.0 | Gerenciamento de pacotes |
| EAS CLI | 16 ou superior | Geração do APK na nuvem |
| Blender | 5.2 | Modelagem 3D (exportador glTF 5.2.40) |
| Python | 3.12.10 | Scripts que geram as imagens de referência |
| Pillow / NumPy | 12.3.0 / 2.5.2 | Tratamento das fotos nos scripts |
| Git | 2.51.2 | Controle de versão |
| GitHub | — | Hospedagem do código e da documentação |

Para o registro de interações (RF08 e RF09), o artigo prevê o uso de SQLite com `expo-sqlite`, ainda não adicionado ao projeto.

---

## 9. Hardware Utilizado

| Equipamento | Modelo | Característica relevante | Utilização |
|---|---|---|---|
| Smartphone | Samsung Galaxy S25 Ultra | Android, compatível com ARCore | Execução e testes |
| Computador | Lenovo 82MG | Windows 11, Intel Core i5-11300H, 16 GB de RAM, NVIDIA GTX 1650 | Desenvolvimento |
| Multímetro | FT-266 | Exemplar usado nos testes, frente e parte de trás | Equipamento de referência |
| Placa de desenvolvimento | ESP32 DevKit (ESP-WROOM-32) | Exemplar usado nos testes | Referência visual do circuito |
| Protoboard | 830 furos | 165 × 55 mm | Equipamento de referência e montagem do circuito |
| Componentes | LED vermelho, resistor de 1 kΩ, 3 fios jumper | Circuito do pino D2 ao GND | Circuito usado nos testes |

---

## 10. Arquitetura do Sistema

A arquitetura organiza-se em cinco camadas, conforme o artigo científico. Não há servidor nem banco de dados remoto.

| Camada | Componentes | Função |
|---|---|---|
| Física | Equipamento real, imagem de referência e celular | A câmera e os sensores capturam o ambiente |
| Rastreamento | ARCore | Reconhece a imagem e estima sua pose em relação ao celular |
| Cena em RA | ViroReact, `LabRecognitionScene`, `HotspotMarker3D` | Posiciona o modelo, os pinos e as etiquetas e trata os toques |
| Aplicação | React Native, Expo Router, `ARView`, `ARHud`, `arStore` | Controla a navegação, os painéis e o andamento dos guias |
| Dados | Conteúdo em `content/`, assets locais e módulo de registro (planejado) | Guarda o conteúdo dos equipamentos e, no futuro, as interações em CSV |

![Arquitetura do sistema](docs/diagrams/arquitetura.svg)

### Fluxo resumido

```text
Câmera e sensores (camada física)
   ↓
ARCore reconhece a imagem e informa a pose (rastreamento)
   ↓
ViroReact posiciona o conteúdo sobre a peça (cena em RA)
   ↓
Toque do usuário vai para os painéis e guias (aplicação)
   ↓
Conteúdo correspondente é exibido (dados)
```

---

## 11. Funcionamento da Realidade Aumentada

### 11.1 Técnica utilizada

O projeto usa **Image Tracking** (rastreamento de imagens naturais): cada objeto possui uma ou mais imagens de referência (os "alvos"). O ARCore procura essas imagens na câmera e estima continuamente sua posição e orientação no espaço. A técnica foi adotada por dispensar o treinamento de modelos de detecção, cujo desempenho em dispositivos móveis ainda é limitado, e por manter o rastreamento mesmo quando a imagem sai temporariamente de vista.

O protótipo usa os exemplares abaixo como referência. Outros modelos e circuitos são adicionados pelo cadastro descrito na seção 13.

| Referência no protótipo | Imagem de referência | Largura real |
|---|---|---|
| Multímetro FT-266, frente | `assets/markers/ft266-frente.jpg` | 6,5 cm |
| Multímetro FT-266, parte de trás | `assets/markers/ft266-traseira.jpg` | 6,5 cm |
| Protoboard de demonstração | `assets/markers/protoboard-demo.png` | 16,5 cm |
| Circuito ESP32 + LED | `assets/markers/circuito-esp32-led.jpg`, `-2.jpg` e `-3.jpg` | 2,6 cm |

### 11.2 Fluxo técnico

![Fluxo de RA](docs/diagrams/fluxo-ra.svg)

1. O usuário escolhe **Equipamentos** ou **Circuitos**, e `ARView` abre a sessão de RA com o catálogo correspondente.
2. `LabRecognitionScene` registra as imagens com `ViroARTrackingTargets`, informando a largura física de cada uma.
3. O ARCore compara os quadros da câmera com as imagens cadastradas.
4. Ao encontrar uma imagem, o `ViroARImageMarker` dispara `onAnchorFound`, e o `arStore` registra qual objeto e qual imagem estão ativos.
5. O modelo `.glb` e os pinos são desenhados como filhos do marcador, na posição do objeto real. As coordenadas são em metros, com origem no centro da imagem.
6. A cada atualização, `onAnchorUpdated` informa se a imagem está na câmera (`tracking`) ou fora de vista (`lastKnownPose`). Fora de vista, o conteúdo fica na última posição conhecida.
7. Ao tocar num pino ou abrir um guia, o `ARHud` mostra a explicação e a parte correspondente fica em destaque.

### 11.3 Elementos virtuais

- modelo 3D do objeto, em escala real;
- pinos numerados, com linha e etiqueta voltada para a câmera;
- destaque laranja da parte selecionada ou do passo atual;
- animação do botão Data Hold no modelo do multímetro;
- painéis 2D com explicações, guias e alertas de segurança;
- indicação do estado do reconhecimento.

### 11.4 Alinhamento do modelo com a peça real

Os modelos estão em escala real e são posicionados a partir de cálculos feitos sobre as fotos:

- `scripts/gerar-alvo-circuito-esp32.py` endireita a foto por uma homografia, calculada com furos e números impressos da protoboard;
- o mesmo script recorta só a placa do ESP32, que é rígida e cheia de detalhes;
- as fotos extras são alinhadas pelos 4 furos de fixação do ESP32, então as três imagens têm o mesmo enquadramento e usam as mesmas posições;
- o script imprime a transformação do modelo e a posição `(u, v)` de cada parte, usadas no arquivo de conteúdo.

![Conferência do alinhamento na foto](docs/images/fotos/circuito-esp32-led-conferencia.jpg)

---

## 12. Estrutura do Projeto

```text
UPX8/
│
├── assets/
│   ├── images/               Ícones e tela de abertura
│   ├── markers/              Imagens de referência (alvos)
│   └── models/               Modelos 3D (.glb)
│
├── docs/
│   ├── diagrams/             Diagramas técnicos
│   ├── documents/            Guias complementares
│   └── images/               Capturas de tela e fotos de referência
│
├── scripts/                  Geração de alvos e modelos de demonstração
│
├── src/
│   ├── app/                  Telas (Expo Router)
│   ├── components/           Componentes de tema
│   ├── constants/            Cores e espaçamentos
│   ├── hooks/                Tema claro e escuro
│   └── features/lab-ar/      Realidade aumentada
│       ├── content/          Partes, guias e alertas de cada objeto
│       ├── scene/            Cena 3D, alvos e pinos
│       ├── ui/               Interface 2D sobre a câmera
│       ├── ARView.tsx        Sessão de RA de cada tela
│       ├── arStore.ts        Estado compartilhado
│       ├── geometry.ts       Posições e nomes dos alvos
│       └── types.ts          Tipos do conteúdo
│
├── app.json                  Configuração do Expo
├── eas.json                  Perfis de build
├── package.json              Dependências
└── README.md
```

### Pastas principais

| Pasta | Finalidade |
|---|---|
| `src/features/lab-ar/content` | Conteúdo didático: é onde se cadastra um objeto novo |
| `src/features/lab-ar/scene` | Reconhecimento das imagens e desenho do conteúdo 3D |
| `src/features/lab-ar/ui` | Status, painéis e guias sobre a câmera |
| `assets/markers` | Imagens que a câmera reconhece |
| `assets/models` | Modelos 3D em escala real |
| `scripts` | Scripts em Python que geram os alvos e as posições |
| `docs/documents` | Documentos complementares |

---

## 13. Principais Scripts

| Arquivo | Responsabilidade |
|---|---|
| `src/app/index.tsx` | Tela inicial, com a escolha entre Equipamentos e Circuitos |
| `src/app/ar.tsx`, `src/app/circuito.tsx` | Rotas que abrem a RA com cada catálogo |
| `src/features/lab-ar/ARView.tsx` | Inicia a sessão de RA e combina a câmera com a interface |
| `src/features/lab-ar/scene/LabRecognitionScene.tsx` | Registra os alvos, trata os eventos do ARCore e desenha o modelo e os pinos |
| `src/features/lab-ar/scene/HotspotMarker3D.tsx` | Desenha o pino, a linha e a etiqueta 3D |
| `src/features/lab-ar/ui/ARHud.tsx` | Mostra o status, os painéis de explicação e os guias |
| `src/features/lab-ar/arStore.ts` | Guarda o objeto reconhecido, a parte selecionada e o passo do guia |
| `src/features/lab-ar/geometry.ts` | Converte posições da imagem em posições 3D e nomeia os alvos |
| `src/features/lab-ar/content/index.ts` | Define os catálogos de Equipamentos e de Circuitos |
| `src/features/lab-ar/content/multimetro-ft266.ts` | Conteúdo do multímetro |
| `src/features/lab-ar/content/protoboard.ts` | Conteúdo da protoboard |
| `src/features/lab-ar/content/circuito-esp32-led.ts` | Conteúdo do circuito ESP32 + LED |
| `scripts/gerar-alvo-ft266.py` | Gera os alvos do multímetro e calcula as posições das partes |
| `scripts/gerar-alvo-circuito-esp32.py` | Gera os alvos do circuito e calcula as posições das partes |

### Como adicionar um equipamento ou circuito

1. Modele o objeto em escala real, em metros, e exporte o `.glb` para `assets/models/`.
2. Tire uma foto bem de cima, com boa luz e sem reflexo, e salve em `docs/images/fotos/`.
3. Prefira uma área rígida e cheia de detalhes. Evite padrões repetitivos, como a grade de furos da protoboard.
4. Copie um script de `scripts/`, ajuste os pontos de calibração, o recorte e as partes, e rode o script.
5. Crie o conteúdo seguindo `multimetro-ft266.ts` ou `circuito-esp32-led.ts`, com os valores impressos pelo script.
6. Inclua o objeto em `EQUIPAMENTOS_AR` ou em `CIRCUITOS_AR`, no arquivo `content/index.ts`. A cena registra os alvos sozinha.
7. Para reconhecer o objeto em outras condições de luz, acrescente fotos do mesmo recorte em `alvo.imagensExtras`.

---

## 14. Dependências

As dependências ficam em `package.json`, e `npm install` instala todas elas. As essenciais para o funcionamento são:

```text
expo ~57.0.23
expo-router ~57.0.29
expo-dev-client ~57.0.19
react 19.2.3
react-native 0.86.3
react-native-reanimated 4.5.1
react-native-gesture-handler ~2.32.0
react-native-safe-area-context ~5.7.0
react-native-screens ~4.26.0
@reactvision/react-viro 2.57.3
```

| Biblioteca essencial | Onde obter |
|---|---|
| ViroReact | [github.com/ReactVision/viro](https://github.com/ReactVision/viro) |
| Expo | [docs.expo.dev/versions/v57.0.0](https://docs.expo.dev/versions/v57.0.0/) |
| Google Play Services for AR | [Lista de aparelhos compatíveis](https://developers.google.com/ar/devices) |

Os scripts de `scripts/` são opcionais e só são necessários para gerar alvos novos:

```bash
python -m pip install pillow numpy
```

---

## 15. Configuração do Ambiente

### Pré-requisitos

- Windows 10 ou 11;
- [Node.js](https://nodejs.org/) 22.13 ou superior, na linha 22 LTS (versões anteriores instalam, mas o Metro avisa que não são suportadas);
- [Git](https://git-scm.com/);
- conta gratuita no [Expo](https://expo.dev/signup), para gerar o APK;
- celular Android [compatível com ARCore](https://developers.google.com/ar/devices), com o Google Play Services for AR atualizado;
- Python 3.12, somente para gerar alvos novos.

> O ViroReact usa código nativo, então o projeto **não funciona no Expo Go**. É preciso instalar um *development build*, que é o APK do próprio aplicativo. O Android Studio não é necessário, porque o APK é gerado na nuvem.

### Procedimento

1. Instale o Node.js e o Git.
2. Clone o repositório e instale as dependências (seção 16).
3. Instale a ferramenta de build e entre na sua conta:

```bash
npm install --global eas-cli
```

```bash
eas login
```

4. Quem não faz parte do projeto no Expo deve apagar `extra.eas.projectId` do `app.json` e vincular a própria conta:

```bash
eas init
```

5. Gere o APK. O build roda na nuvem e leva de 10 a 25 minutos:

```bash
eas build --profile development --platform android
```

6. No final, o terminal mostra um link e um QR code. Abra-os no celular, baixe o APK e permita a instalação.

Só é preciso gerar outro APK quando mudarem as dependências nativas ou o `app.json`.

---

## 16. Como Executar

```bash
git clone https://github.com/EduardoBressan/UPX8.git
```

```bash
cd UPX8
```

```bash
npm install
```

```bash
npx expo start
```

Depois:

1. Deixe o celular e o computador na mesma rede Wi-Fi.
2. Abra no celular o aplicativo **LabLens** instalado na seção 15. Não use o Expo Go.
3. Toque no servidor que aparece na lista ou digite `http://SEU_IP:8081` e toque em **Connect**.
4. Para descobrir o IP, rode `ipconfig` e veja o "Endereço IPv4" da rede Wi-Fi.
5. Se não conectar, libere o Node.js no firewall do Windows ou use `npx expo start --tunnel`.

Para gerar um APK que funciona sem o computador ligado:

```bash
eas build --profile preview --platform android
```

---

## 17. Como Utilizar a Aplicação

### Equipamentos

1. Abra o aplicativo e toque em **Equipamentos**.
2. Autorize o acesso à câmera.
3. Deite o multímetro na mesa, com o painel para cima e o **seletor em OFF**.
4. Aponte o celular para o painel, a cerca de 30 cm, e mova devagar.
5. Quando o modelo 3D aparecer, toque nos números para ver cada parte.
6. Abra um guia, como **Medir tensão contínua (DC)**, e siga os passos.
7. Vire o multímetro para ver a parte de trás e o guia **Trocar a bateria**.

### Circuitos

1. Toque em **Circuitos**.
2. Aproxime o celular do ESP32, de cima, até a placa ocupar cerca de metade da tela.
3. Mantenha boa luz e evite fios por cima do ESP32 e reflexo no módulo prateado.
4. Quando o modelo aparecer, você pode afastar o celular: ele fica preso na posição.
5. Toque nos números ou abra um guia, como **Seguir o caminho da corrente**.

<img src="docs/images/tela-inicial.png" alt="Tela inicial do LabLens" width="300">

---

## 18. Fluxo de Funcionamento

```mermaid
flowchart TD
    A[Início] --> B[Abrir o aplicativo]
    B --> C{Escolher a tela}
    C --> D[Equipamentos]
    C --> E[Circuitos]
    D --> F[Iniciar a câmera de RA]
    E --> F
    F --> G{Imagem reconhecida?}
    G -- Não --> F
    G -- Sim --> H[Exibir o modelo 3D e os pinos]
    H --> I{O que fazer?}
    I -- Tocar numa parte --> J[Ler a explicação]
    I -- Abrir um guia --> K[Seguir os passos]
    J --> L[Fim]
    K --> L
```

---

## 19. Caso de Uso

![Caso de uso](docs/diagrams/caso-de-uso.svg)

---

## 20. Fluxo de Navegação

![Fluxo de navegação](docs/diagrams/navegacao.svg)

---

## 21. Interface

### Tela inicial

<img src="docs/images/tela-inicial.png" alt="Tela inicial" width="300">

- **Finalidade:** escolher o que estudar.
- **Elementos:** cartões **Equipamentos** e **Circuitos** e aviso de segurança.
- **Ação do usuário:** tocar em um dos cartões.
- **Observação:** imagem capturada na versão web da mesma tela.

### Câmera de RA em Circuitos

<img src="docs/images/tela-circuitos-camera.jpg" alt="Câmera de RA na tela de Circuitos" width="300">

- **Finalidade:** reconhecer o circuito.
- **Elementos:** botão de voltar, indicador de estado e orientação para o usuário.
- **Ação do usuário:** aproximar o celular do ESP32. Nesta captura, o circuito ainda não foi reconhecido porque está longe da câmera.

### Multímetro reconhecido

<img src="docs/images/experiencia-ra-multimetro.jpg" alt="Multímetro reconhecido com o modelo 3D e os pinos numerados" width="300">

- **Finalidade:** explicar o equipamento sobre a peça real.
- **Elementos:** indicador verde de reconhecimento, botões **Etiquetas** e **Modelo 3D**, modelo 3D com pinos numerados e painel com as partes e os guias de uso.
- **Ação do usuário:** tocar num número ou abrir um guia.

### Circuito reconhecido

<img src="docs/images/experiencia-ra-circuito.jpg" alt="Circuito montado com o modelo 3D e os pinos numerados" width="300">

- **Finalidade:** explicar o circuito montado.
- **Elementos:** modelo 3D do circuito, pinos numerados e painel com as partes e os guias. O indicador amarelo mostra que o conteúdo está na última posição conhecida, porque o celular se afastou do ESP32.
- **Ação do usuário:** tocar num número ou abrir um guia, como **Seguir o caminho da corrente**.

---

## 22. Testes Técnicos

### 22.1 Testes realizados

| Teste | Procedimento | Resultado esperado | Resultado obtido | Status |
|---|---|---|---|---|
| Tipos | `npx tsc --noEmit` | Nenhum erro | Nenhum erro | ✅ |
| Lint | `npx expo lint` | Nenhum erro | Nenhum erro | ✅ |
| Instalação limpa | Clonar o repositório, rodar `npm ci` e `npx expo start` e verificar os tipos | Dependências instalam e o código compila | Instalou e compilou | ✅ |
| Scripts dos alvos | Rodar os scripts de `scripts/` | Geram imagens idênticas às do projeto | Imagens idênticas | ✅ |
| Multímetro | Apontar a câmera para o painel do multímetro | Reconhecer e exibir o modelo 3D | Reconheceu e exibiu | ✅ |
| Guia passo a passo | Abrir **Medir tensão contínua (DC)** com o multímetro reconhecido | Avançar os passos com a parte em destaque | Passos e destaques funcionaram | ✅ |
| Circuito: alvo com a protoboard | Usar um alvo com protoboard, fios e mesa | Reconhecer e exibir o modelo 3D | Exibiu uma vez e não repetiu | ❌ |
| Circuito: alvo só com o ESP32 | Aproximar o celular do ESP32 | Reconhecer e exibir o modelo 3D | Reconheceu e exibiu, mas exige aproximação | ✅ |
| Manter posição | Afastar o celular depois do reconhecimento | Conteúdo continua no lugar | Conteúdo mantido, com aviso na tela | ✅ |

### 22.2 Verificação técnica planejada

Antes do experimento, o artigo científico prevê:

| Teste | Procedimento | Requisitos | Status |
|---|---|---|---|
| Funcionais | Roteiro de casos de teste para cada requisito funcional | RF01 a RF09 | 🚧 |
| Reconhecimento | 9 tentativas por equipamento, a 30, 60 e 100 cm, com ângulos de 0°, 30° e 45°, na iluminação dos laboratórios | RNF03, RNF07 | ⬜ |
| Posicionamento e estabilidade | Conferir pinos e etiquetas durante a movimentação e após perder e recuperar o rastreamento | RF02, RF06, RNF06 | 🚧 |
| Desempenho | Medir a taxa de quadros durante o uso | RNF04 | ⬜ |
| Compatibilidade | Executar nos dispositivos do experimento | RNF01 | 🚧 |
| Registro | Comparar os registros exportados com eventos de um roteiro controlado | RF08, RF09 | ⬜ |
| Teste-piloto | Aplicar o procedimento completo com 3 voluntários fora da amostra | — | ⬜ |

### 22.3 Experimento com usuários

O experimento ainda não foi realizado. Está previsto um delineamento entre grupos: o grupo experimental usa o aplicativo, e o grupo de controle usa material impresso com o mesmo conteúdo. As tarefas são identificar 3 partes e executar um procedimento com multímetro e protoboard. Serão medidos a taxa de acerto, o sucesso no procedimento e o tempo de cada tarefa, com a pontuação SUS e entrevistas como dados complementares.

---

## 23. Dispositivos Testados

| Dispositivo | Sistema | Resultado |
|---|---|---|
| Samsung Galaxy S25 Ultra | Android | Compatível: reconheceu o multímetro e o circuito |

---

## 24. Limitações Conhecidas

- O reconhecimento depende de referências visuais cadastradas: outros modelos de equipamento e outros circuitos precisam ser cadastrados. Ampliar esse reconhecimento é uma evolução planejada (RF14).
- O registro de interações, a sessão anônima e a exportação em CSV (RF07 a RF09) ainda não foram implementados.
- As metas de 4 segundos, 30 quadros por segundo e nota 75 nas imagens ainda não foram medidas.
- Referências pequenas exigem aproximação: a placa usada no circuito tem 2,6 cm de largura na imagem de referência, e o reconhecimento dela ocorre abaixo da faixa de 30 cm a 1 m prevista em RNF07.
- Protoboards reais são difíceis de reconhecer, porque a grade de furos é um padrão repetitivo.
- O conteúdo do circuito acompanha a montagem cadastrada: com fios em outros furos, o 3D não coincide com a placa real.
- No modelo do circuito, algumas peças ficam cerca de 4 mm deslocadas em relação à montagem real.
- Fios sobre a peça de referência, pouca luz e reflexos dificultam o reconhecimento.
- No multímetro, o seletor faz parte da imagem reconhecida e deve estar em OFF.
- Depois que a imagem sai de vista, o conteúdo fica na última posição conhecida: se a peça for movida, ele não acompanha.
- O projeto foi testado apenas no Android, não funciona no Expo Go, e iOS está fora do escopo do protótipo.

---

## 25. Evidências de Funcionamento

- **Aplicativo em execução:** veja as capturas da seção 21.
- **Imagens de referência:** o circuito é reconhecido pelas três imagens abaixo.

| Mesa clara | Mesa escura, de perto | Mesa escura, de cima |
|---|---|---|
| <img src="assets/markers/circuito-esp32-led.jpg" alt="Alvo em mesa clara" width="180"> | <img src="assets/markers/circuito-esp32-led-2.jpg" alt="Alvo em mesa escura, de perto" width="180"> | <img src="assets/markers/circuito-esp32-led-3.jpg" alt="Alvo em mesa escura, de cima" width="180"> |

- **Experiência de RA:** o multímetro e o circuito reconhecidos, com o modelo 3D na tela.

| Multímetro | Circuito montado |
|---|---|
| <img src="docs/images/experiencia-ra-multimetro.jpg" alt="Multímetro reconhecido" width="260"> | <img src="docs/images/experiencia-ra-circuito.jpg" alt="Circuito reconhecido" width="260"> |

- **Vídeo:** [assistir à demonstração do multímetro](docs/images/demonstracao-multimetro.mp4), com o reconhecimento e um guia de medição.

---

## 26. Repositórios e Recursos

| Recurso | Link |
|---|---|
| Código-fonte | [github.com/EduardoBressan/UPX8](https://github.com/EduardoBressan/UPX8) |
| Modelo da documentação | [github.com/dr-ohata/upx-modelo](https://github.com/dr-ohata/upx-modelo) |
| Vídeo | [Demonstração do multímetro](docs/images/demonstracao-multimetro.mp4) |

---

## 27. Cronograma Técnico

As etapas seguem a metodologia do artigo científico.

| Atividade | Responsável | Status |
|---|---|---|
| Revisão bibliográfica | Felipe Rondello A. Lopes | ✅ |
| Definição do problema e levantamento de requisitos | Eduardo Bressan Paixão | ✅ |
| Projeto da solução e interface | João Guilherme Borges Feliciano | ✅ |
| Prototipação e desenvolvimento mobile | Luiza Santos Mascarenhas Bottesi, Eduardo Bressan Paixão | 🚧 |
| Registro de interações e exportação em CSV | Equipe | ⬜ |
| Verificação técnica | William Rocchi Dias | 🚧 |
| Experimento com usuários | William Rocchi Dias | ⬜ |
| Coleta e análise dos dados | João Guilherme Borges Feliciano | ⬜ |
| Documentação | Felipe Rondello A. Lopes | 🚧 |

---

## 28. Controle de Versão

O desenvolvimento está registrado em commits na branch `main`. A parte de circuitos foi feita na branch `circuitos` e integrada pelo Pull Request #1.

| Commit | Alteração |
|---|---|
| `2b7f43b` | Realidade aumentada com reconhecimento de imagem e modelos 3D |
| `b40042b` | Modelo 3D do multímetro e ajuste da RA para esse modelo |
| `ab8078a` | Reconhecimento dos circuitos |
| `22bdb5d` | Melhorias na interface e no reconhecimento do circuito |
| `481e513` | Três imagens de referência para o circuito |

Daqui em diante, as mensagens seguem o padrão abaixo:

```text
feat: adiciona novo circuito ao catálogo
fix: corrige posição do modelo 3D
docs: atualiza instruções de execução
test: registra teste em dispositivo Android
```

---

## 29. Problemas Encontrados e Soluções

### Problema 1 — Modelo do circuito quase nunca aparecia

**Problema:** o modelo 3D do circuito apareceu uma vez e não voltou a aparecer.  
**Causa:** a imagem de referência era quase toda grade de furos, um padrão repetitivo, e incluía fios e mesa, que mudam de uma montagem para outra.  
**Solução:** recortar a imagem só na placa do ESP32, que é rígida e cheia de detalhes.

### Problema 2 — Reconhecimento difícil com pouca luz

**Problema:** em mesa escura e com pouca luz, o circuito continuava difícil de reconhecer.  
**Causa:** havia uma única imagem de referência, feita em mesa clara e com luz forte.  
**Solução:** cadastrar o mesmo recorte a partir de três fotos, alinhadas pelos 4 furos de fixação do ESP32.

### Problema 3 — Risco de conteúdo duplicado com várias imagens

**Problema:** com várias imagens do mesmo circuito, o modelo poderia aparecer duplicado e um guia aberto poderia reiniciar.  
**Causa:** cada imagem reconhecida gera um marcador próprio.  
**Solução:** o `arStore` guarda a imagem ativa, e o conteúdo só troca de imagem quando a atual sai de vista.

### Problema 4 — Parte de trás do multímetro não era reconhecida

**Problema:** o app não reconhecia a parte de trás enquanto ainda guardava a frente.  
**Causa:** o ARCore rastreava menos imagens ao mesmo tempo do que as cadastradas.  
**Solução:** definir `numberOfTrackedImages` com o número total de imagens do catálogo.

### Problema 5 — Modelo piscava com a câmera em movimento

**Problema:** o conteúdo sumia e voltava quando a câmera tremia ou inclinava.  
**Causa:** o ARCore perde a imagem por instantes durante esses movimentos.  
**Solução:** manter o conteúdo na última posição conhecida e aplicar uma tolerância de 800 ms antes de considerar o objeto fora de vista.

### Problema 6 — Erro de plugin ao trocar de branch

**Problema:** `npx expo start` falhava com `Failed to resolve plugin for module "expo-camera"`.  
**Causa:** o `git checkout` trocou os arquivos do projeto, mas a pasta `node_modules` continuava com as dependências de outra branch.  
**Solução:** voltar à branch correta ou rodar `npm install` depois de trocar de branch.

---

## 30. Melhorias Futuras

- Ampliar o reconhecimento para outros modelos de equipamento e outros circuitos (RF14).
- Implementar a sessão anônima, o registro de interações e a exportação em CSV (RF07 a RF09).
- Avaliar as imagens de referência com a ferramenta do ARCore e refazê-las com fotos de maior resolução.
- Aumentar a distância de reconhecimento para atender à faixa de 30 cm a 1 m.
- Ajustar o modelo 3D do circuito para coincidir com a montagem real.

---

## 31. Custos e Recursos

| Recurso | Tipo | Custo/Condição |
|---|---|---|
| Expo e EAS Build | Software | Plano gratuito |
| ViroReact | Software | Código aberto |
| Blender | Software | Gratuito |
| Python, Pillow e NumPy | Software | Gratuitos |
| GitHub | Serviço | Plano gratuito |
| Smartphone e computador | Hardware | Equipamentos da equipe |
| Multímetro, ESP32, protoboard e componentes | Hardware | Equipamentos de integrantes da equipe |

---

## 32. Licença

Projeto acadêmico desenvolvido para fins educacionais na disciplina de UPX8 — Realidade Aumentada.

O arquivo `LICENSE` é a licença MIT do template inicial do Expo, usado como base do projeto.

---

## 33. Autores

**Equipe VantageAR — turma TIN2**

- **Eduardo Bressan Paixão** — Requisitos, dataset, anotação de imagens e desenvolvimento
- **Felipe Rondello A. Lopes** — Pesquisa e documentação
- **João Guilherme Borges Feliciano** — UI/UX e análise de dados
- **Lucas Vinícius Tomé** — Modelo de visão computacional
- **Luiza Santos Mascarenhas Bottesi** — Gerência de projeto e desenvolvimento mobile
- **William Rocchi Dias** — Testes e experimento com usuários

**Instituição:** Centro Universitário Facens  
**Disciplina:** UPX8 — Realidade Aumentada  
**Semestre:** 2026.2

Estrutura de realidade aumentada baseada nos templates **WL01 Recognition AR** e **WL02 Spatial AR** fornecidos pelo professor.

---

## Checklist de Entrega

- [x] Código-fonte atualizado
- [x] README completamente preenchido
- [x] Versões das tecnologias registradas
- [x] Arquitetura apresentada
- [x] Funcionamento da RA explicado
- [x] Estrutura de pastas documentada
- [x] Scripts principais descritos
- [x] Procedimento de instalação testado
- [x] Procedimento de execução testado
- [x] Screenshots reais adicionados
- [x] Testes registrados
- [x] Dispositivos testados informados
- [x] Limitações conhecidas documentadas
- [x] Evidência de funcionamento adicionada
- [x] Commits representam a evolução do projeto
