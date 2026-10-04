import { EquipamentoAR } from '../types';

/**
 * Multimetro digital (layout tipo DT-830, comum em laboratorios didaticos).
 *
 * As posicoes (u, v) abaixo correspondem a imagem de DEMONSTRACAO
 * assets/markers/multimetro-demo.png. Ao trocar pela foto do multimetro real
 * do laboratorio, recalcule cada ponto: abra a foto num editor de imagem,
 * veja o pixel (x, y) da parte e use u = x / largura, v = y / altura.
 */
export const multimetro: EquipamentoAR = {
  id: 'multimetro-digital',
  nome: 'Multímetro digital',
  descricao: 'Mede tensão, corrente, resistência e continuidade.',
  avisoModelo:
    'A posição dos bornes e do seletor varia entre marcas e modelos. Confira sempre as marcações impressas no seu multímetro.',
  alvo: {
    imagem: require('@/assets/markers/multimetro-demo.png'),
    // Imprima a imagem de demonstracao com 12 cm de largura (ou ajuste este valor ao tamanho exibido).
    larguraFisicaMetros: 0.12,
  },
  // Modelo de DEMONSTRACAO gerado por scripts/gerar-modelos-demo.py, ja alinhado com a imagem acima.
  // Ao trocar pelo modelo real, ajuste posicao/rotacao/escala e alturaSuperficie (ver docs/RA-RECONHECIMENTO.md).
  modelo3D: {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- modelo 3D e um asset do Metro
    fonte: require('@/assets/models/multimetro-demo.glb'),
    tipo: 'GLB',
    posicao: [0, 0, 0],
    rotacao: [0, 0, 0],
    escala: [1, 1, 1],
    alturaSuperficie: 0.032,
  },
  hotspots: [
    {
      id: 'display',
      numero: 1,
      nome: 'Display (tela de leitura)',
      rotuloCurto: 'Display',
      posicao: { u: 0.5, v: 0.2 },
      alturaEtiqueta: 0.03,
      oQueE: 'Mostra o valor medido. Em muitos modelos também mostra a unidade e o aviso de bateria fraca.',
      comoUsar: 'Leia o valor só depois que as pontas estiverem firmes nos pontos de medição e o número parar de oscilar.',
      dica: 'Um sinal "-" antes do número indica apenas que as pontas estão invertidas em relação à polaridade. Não é erro. Já "1" ou "OL" à esquerda significa que o valor passou da escala escolhida.',
      cuidados: [],
    },
    {
      id: 'seletor',
      numero: 2,
      nome: 'Seletor de função (chave rotativa)',
      rotuloCurto: 'Seletor de função',
      posicao: { u: 0.5, v: 0.4875 },
      alturaEtiqueta: 0.045,
      alturaExtraNoModelo: 0.01,
      oQueE:
        'Chave giratória que escolhe a grandeza medida (DCV, ACV, DCA, Ω, continuidade, hFE) e a escala máxima de cada medição.',
      comoUsar:
        'Gire até a função desejada e escolha uma escala MAIOR que o valor esperado. Se não souber o valor, comece pela maior escala e vá descendo.',
      dica: 'DCV = tensão contínua (pilhas, fontes de bancada). ACV = tensão alternada (tomada). Ω = resistência. •))) = continuidade (bipa quando há ligação).',
      cuidados: [
        {
          nivel: 'perigo',
          mensagem:
            'Nunca gire o seletor com as pontas encostadas num circuito energizado, e nunca meça resistência ou continuidade com o circuito ligado.',
        },
        { nivel: 'info', mensagem: 'Ao terminar, deixe o seletor em OFF para não descarregar a bateria.' },
      ],
    },
    {
      id: 'borne-10a',
      numero: 3,
      nome: 'Borne 10A (corrente alta)',
      rotuloCurto: '10A',
      posicao: { u: 0.25, v: 0.844 },
      alturaEtiqueta: 0.03,
      alturaExtraNoModelo: 0.0055,
      oQueE: 'Entrada da ponta VERMELHA para medir correntes altas, até 10 A (o limite exato vem impresso no aparelho).',
      comoUsar: 'Use só com o seletor na posição 10A e com o multímetro ligado EM SÉRIE no circuito.',
      dica: 'Na dúvida sobre o valor da corrente, comece por este borne. Se a leitura for pequena, passe para o borne mA.',
      cuidados: [
        {
          nivel: 'perigo',
          mensagem:
            'Com a ponta vermelha neste borne o multímetro é praticamente um fio. Encostar as pontas em paralelo numa fonte causa curto-circuito.',
        },
        { nivel: 'atencao', mensagem: 'Em muitos modelos este borne não tem fusível. Respeite o tempo máximo de medição impresso no aparelho.' },
      ],
    },
    {
      id: 'borne-com',
      numero: 4,
      nome: 'Borne COM (comum)',
      rotuloCurto: 'COM',
      posicao: { u: 0.5, v: 0.844 },
      alturaEtiqueta: 0.045,
      alturaExtraNoModelo: 0.0055,
      oQueE: 'Entrada de referência (comum/negativo). É usada em TODAS as medições.',
      comoUsar: 'Conecte sempre a ponta PRETA aqui. Ela nunca muda de lugar.',
      cuidados: [],
    },
    {
      id: 'borne-vomA',
      numero: 5,
      nome: 'Borne VΩmA',
      rotuloCurto: 'VΩmA',
      posicao: { u: 0.75, v: 0.844 },
      alturaEtiqueta: 0.03,
      alturaExtraNoModelo: 0.0055,
      oQueE:
        'Entrada da ponta VERMELHA para medir tensão (V), resistência (Ω), continuidade e correntes pequenas (mA, normalmente até 200 mA).',
      comoUsar: 'É a posição padrão da ponta vermelha. Só mude para o borne 10A quando for medir corrente alta.',
      cuidados: [
        {
          nivel: 'atencao',
          mensagem:
            'A faixa de mA é protegida por um fusível interno. Medir corrente acima do limite com a ponta aqui queima o fusível.',
        },
      ],
    },
  ],
  procedimentos: [
    {
      id: 'tensao-dc',
      titulo: 'Medir tensão contínua (DC)',
      objetivo: 'Ex.: tensão de uma pilha, bateria ou fonte de bancada.',
      passos: [
        { hotspotId: 'borne-com', instrucao: 'Encaixe a ponta PRETA no borne COM.' },
        { hotspotId: 'borne-vomA', instrucao: 'Encaixe a ponta VERMELHA no borne VΩmA.' },
        {
          hotspotId: 'seletor',
          instrucao: 'Gire o seletor para DCV, numa escala maior que a tensão esperada (ex.: 20 V para uma bateria de 9 V).',
          alerta: { nivel: 'info', mensagem: 'Se não souber a tensão, comece pela maior escala de DCV.' },
        },
        {
          hotspotId: null,
          instrucao:
            'Com o circuito ligado, encoste a ponta preta no negativo (GND) e a vermelha no ponto a medir. Para medir tensão, o multímetro fica EM PARALELO.',
        },
        {
          hotspotId: 'display',
          instrucao: 'Leia o valor no display. Se aparecer "1" ou "OL", aumente a escala. Um "-" indica pontas invertidas.',
        },
      ],
    },
    {
      id: 'resistencia',
      titulo: 'Medir resistência',
      objetivo: 'Ex.: conferir o valor de um resistor.',
      passos: [
        {
          hotspotId: null,
          instrucao: 'DESLIGUE a alimentação do circuito. Se possível, retire o componente da placa para medir isolado.',
          alerta: {
            nivel: 'perigo',
            mensagem: 'Medir resistência com o circuito energizado pode danificar o multímetro e dá leituras erradas.',
          },
        },
        { hotspotId: 'borne-com', instrucao: 'Ponta PRETA no borne COM.' },
        { hotspotId: 'borne-vomA', instrucao: 'Ponta VERMELHA no borne VΩmA.' },
        { hotspotId: 'seletor', instrucao: 'Gire o seletor para Ω, numa escala acima do valor esperado do resistor.' },
        {
          hotspotId: null,
          instrucao: 'Encoste uma ponta em cada terminal do resistor. Resistor não tem polaridade, o lado tanto faz.',
          alerta: { nivel: 'info', mensagem: 'Não segure os dois terminais com os dedos: a resistência do seu corpo altera a leitura.' },
        },
        { hotspotId: 'display', instrucao: 'Leia o valor. "1" ou "OL" significa que a resistência está acima da escala escolhida.' },
      ],
    },
    {
      id: 'corrente-dc',
      titulo: 'Medir corrente contínua (DC)',
      objetivo: 'Ex.: corrente que passa por um LED.',
      passos: [
        { hotspotId: null, instrucao: 'DESLIGUE o circuito antes de conectar o multímetro.' },
        { hotspotId: 'borne-com', instrucao: 'Ponta PRETA no borne COM.' },
        {
          hotspotId: 'borne-10a',
          instrucao:
            'Ponta VERMELHA no borne 10A (se a corrente for desconhecida ou alta) ou no VΩmA (se for menor que ~200 mA).',
        },
        { hotspotId: 'seletor', instrucao: 'Gire o seletor para a escala de corrente correspondente (10A ou DCA).' },
        {
          hotspotId: null,
          instrucao:
            'ABRA o circuito no ponto da medição e ligue o multímetro EM SÉRIE: a corrente precisa passar por dentro dele.',
          alerta: {
            nivel: 'perigo',
            mensagem: 'Nunca encoste as pontas em paralelo com a fonte nesta configuração: isso é um curto-circuito.',
          },
        },
        { hotspotId: 'display', instrucao: 'Ligue o circuito e leia a corrente.' },
        {
          hotspotId: 'borne-vomA',
          instrucao: 'Ao terminar, volte a ponta VERMELHA para o borne VΩmA.',
          alerta: {
            nivel: 'atencao',
            mensagem: 'Esquecer a ponta no borne de corrente é a causa mais comum de curto na próxima medição de tensão.',
          },
        },
      ],
    },
    {
      id: 'continuidade',
      titulo: 'Testar continuidade',
      objetivo: 'Ex.: ver se um fio, trilha ou jumper está inteiro.',
      passos: [
        { hotspotId: null, instrucao: 'DESLIGUE o circuito.' },
        { hotspotId: 'borne-com', instrucao: 'Ponta PRETA no COM.' },
        { hotspotId: 'borne-vomA', instrucao: 'Ponta VERMELHA no VΩmA.' },
        { hotspotId: 'seletor', instrucao: 'Gire o seletor para o símbolo de continuidade (•))).' },
        {
          hotspotId: 'display',
          instrucao: 'Encoste as pontas nas duas extremidades. Bipe (e valor próximo de zero) = há ligação elétrica.',
        },
      ],
    },
  ],
  cuidadosGerais: [
    {
      nivel: 'perigo',
      mensagem:
        'App educacional. Medições na rede elétrica (127 V/220 V) só com orientação direta do professor e com equipamento de categoria adequada.',
    },
    { nivel: 'atencao', mensagem: 'Confira se as pontas de prova não estão com o isolamento danificado antes de usar.' },
  ],
};
