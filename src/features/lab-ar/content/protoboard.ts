import { EquipamentoAR } from '../types';

/**
 * Protoboard (matriz de contatos).
 *
 * As posicoes (u, v) correspondem a imagem de DEMONSTRACAO
 * assets/markers/protoboard-demo.png. Protoboards reais sao uma grade
 * repetitiva de furos, dificil para o reconhecimento de imagem: no
 * laboratorio, prefira colar um marcador impresso com bastante detalhe ao
 * lado da protoboard e definir os pontos relativos a ele (u/v podem passar
 * de 0..1). Ver docs/RA-RECONHECIMENTO.md.
 */
export const protoboard: EquipamentoAR = {
  id: 'protoboard',
  nome: 'Protoboard',
  descricao: 'Placa de montagem de circuitos sem solda.',
  avisoModelo: 'Algumas protoboards longas têm o barramento de alimentação interrompido no meio. Confira com o multímetro.',
  alvo: {
    imagem: require('@/assets/markers/protoboard-demo.png'),
    // Imprima a imagem de demonstracao com 16,5 cm de largura (ou ajuste este valor ao tamanho exibido).
    larguraFisicaMetros: 0.165,
  },
  // Modelo de DEMONSTRACAO gerado por scripts/gerar-modelos-demo.py, ja alinhado com a imagem acima.
  modelo3D: {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- modelo 3D e um asset do Metro
    fonte: require('@/assets/models/protoboard-demo.glb'),
    tipo: 'GLB',
    posicao: [0, 0, 0],
    rotacao: [0, 0, 0],
    escala: [1, 1, 1],
    alturaSuperficie: 0.0085,
  },
  hotspots: [
    {
      id: 'barramento-positivo',
      numero: 1,
      nome: 'Barramento positivo (+)',
      rotuloCurto: 'Barramento +',
      posicao: { u: 0.3, v: 0.153 },
      alturaEtiqueta: 0.035,
      oQueE:
        'Fileira horizontal marcada em vermelho. Todos os furos dela estão ligados entre si e levam a alimentação positiva ao longo da placa.',
      comoUsar: 'Ligue aqui o positivo da fonte (ex.: +5 V). Depois puxe fios deste barramento para onde o circuito precisar.',
      cuidados: [
        { nivel: 'atencao', mensagem: 'Nunca ligue um fio direto do barramento + ao barramento −: isso é um curto-circuito na fonte.' },
      ],
    },
    {
      id: 'barramento-negativo',
      numero: 2,
      nome: 'Barramento negativo (− / GND)',
      rotuloCurto: 'Barramento − (GND)',
      posicao: { u: 0.3, v: 0.21 },
      alturaEtiqueta: 0.02,
      oQueE: 'Fileira marcada em azul, também toda ligada entre si. É o terra (GND) do circuito.',
      comoUsar: 'Ligue aqui o negativo/GND da fonte. Todos os componentes que precisam de terra se conectam a este barramento.',
      cuidados: [],
    },
    {
      id: 'coluna-conectada',
      numero: 3,
      nome: 'Coluna de 5 furos conectados',
      rotuloCurto: 'Coluna a–e (ligada)',
      posicao: { u: 0.4085, v: 0.41 },
      alturaEtiqueta: 0.03,
      oQueE:
        'Cada coluna numerada tem 5 furos (a até e) ligados entre si por uma lâmina metálica interna. É assim que os componentes se conectam.',
      comoUsar: 'Para ligar duas pernas de componentes diferentes, coloque-as na MESMA coluna.',
      dica: 'Erro clássico: colocar as duas pernas do MESMO componente na mesma coluna. Assim ele fica em curto e não faz nada no circuito.',
      cuidados: [],
    },
    {
      id: 'canal-central',
      numero: 4,
      nome: 'Canal central',
      rotuloCurto: 'Canal central',
      posicao: { u: 0.62, v: 0.556 },
      alturaEtiqueta: 0.025,
      oQueE: 'Divisão no meio da placa. Não há ligação elétrica entre o lado de cima (a–e) e o de baixo (f–j).',
      comoUsar: 'Circuitos integrados (CIs) em encapsulamento DIP são encaixados atravessando o canal, com uma fileira de pinos de cada lado.',
      cuidados: [],
    },
    {
      id: 'metade-inferior',
      numero: 5,
      nome: 'Colunas f–j',
      rotuloCurto: 'Coluna f–j',
      posicao: { u: 0.62, v: 0.7 },
      alturaEtiqueta: 0.03,
      oQueE: 'Mesma lógica da parte de cima: os 5 furos de cada coluna (f até j) estão ligados entre si.',
      comoUsar: 'A coluna 12 de cima (a–e) NÃO está ligada à coluna 12 de baixo (f–j). Para ligar as duas, use um fio jumper.',
      cuidados: [],
    },
    {
      id: 'coordenadas',
      numero: 6,
      nome: 'Letras e números (coordenadas)',
      rotuloCurto: 'Coordenadas',
      posicao: { u: 0.091, v: 0.306 },
      alturaEtiqueta: 0.025,
      oQueE: 'As letras (linhas) e números (colunas) dão um "endereço" a cada furo, como numa batalha naval.',
      comoUsar: 'Use as coordenadas para seguir esquemas de montagem e descrever ligações ao professor (ex.: "resistor de a10 até a15").',
      cuidados: [],
    },
  ],
  procedimentos: [
    {
      id: 'led-resistor',
      titulo: 'Montar um LED com resistor',
      objetivo: 'Primeiro circuito: acender um LED com fonte de 5 V e resistor de 330 Ω.',
      passos: [
        {
          hotspotId: null,
          instrucao: 'Deixe a fonte DESLIGADA enquanto monta.',
          alerta: { nivel: 'atencao', mensagem: 'Montar ou alterar o circuito energizado pode causar curtos acidentais.' },
        },
        { hotspotId: 'barramento-positivo', instrucao: 'Ligue o positivo da fonte (+5 V) ao barramento +.' },
        { hotspotId: 'barramento-negativo', instrucao: 'Ligue o negativo/GND da fonte ao barramento −.' },
        {
          hotspotId: 'coluna-conectada',
          instrucao: 'Coloque um terminal do resistor de 330 Ω no barramento + e o outro numa coluna livre (ex.: coluna 12).',
        },
        {
          hotspotId: 'coluna-conectada',
          instrucao:
            'Coloque o ANODO do LED (perna mais longa) na MESMA coluna do resistor, e o CATODO (perna curta) numa coluna vizinha.',
          alerta: {
            nivel: 'perigo',
            mensagem: 'Nunca ligue um LED sem resistor em série: ele queima quase na hora.',
          },
        },
        { hotspotId: 'barramento-negativo', instrucao: 'Ligue um fio da coluna do catodo até o barramento −.' },
        {
          hotspotId: null,
          instrucao: 'Confira a montagem e ligue a fonte. Se o LED não acender, desligue e verifique se ele não está invertido.',
        },
      ],
    },
    {
      id: 'encaixar-ci',
      titulo: 'Encaixar um circuito integrado (CI)',
      objetivo: 'Ex.: um 555, um 741 ou portas lógicas da família 74xx.',
      passos: [
        {
          hotspotId: 'canal-central',
          instrucao: 'Posicione o CI atravessando o canal central: uma fileira de pinos no lado a–e e a outra no lado f–j.',
        },
        {
          hotspotId: 'coordenadas',
          instrucao: 'Localize o pino 1 (ao lado do entalhe ou ponto no corpo do CI) e anote a coordenada dele.',
        },
        {
          hotspotId: 'coluna-conectada',
          instrucao: 'Cada pino agora tem a sua própria coluna. Use os furos livres da coluna para ligar fios e componentes àquele pino.',
        },
        {
          hotspotId: 'barramento-positivo',
          instrucao: 'Ligue os pinos de alimentação (VCC e GND) aos barramentos, conforme o datasheet do CI.',
          alerta: {
            nivel: 'perigo',
            mensagem: 'Inverter VCC e GND pode destruir o CI. Confira a pinagem no datasheet antes de ligar a fonte.',
          },
        },
      ],
    },
  ],
  cuidadosGerais: [
    { nivel: 'atencao', mensagem: 'Protoboards são para baixa tensão e baixa corrente. Não use com tensão da rede elétrica.' },
  ],
};
