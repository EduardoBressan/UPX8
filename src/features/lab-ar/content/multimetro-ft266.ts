import { EquipamentoAR, Modelo3D } from '../types';

/**
 * Multimetro FT-266 (equipamento real usado no projeto), tratado como um
 * multimetro comum: a garra do aparelho nao faz parte do conteudo.
 *
 * O aparelho tem DOIS alvos, um para cada face, para que o app continue
 * reconhecendo quando o aluno vira o multimetro:
 *   assets/markers/ft266-frente.jpg e assets/markers/ft266-traseira.jpg
 * Ambos gerados das fotos em docs/fotos/ por scripts/gerar-alvo-ft266.py, que
 * tambem calcula as posicoes (u, v) das partes e a transformacao do modelo 3D
 * (o .glb esta em escala real). Pontos fora de 0..1 ficam fora do recorte.
 *
 * Faixas do seletor conforme o painel: V~ 750, V⎓ 1000, Ω 200 (com bipe de
 * continuidade) e 20k.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports -- modelo 3D e um asset do Metro
const MODELO_FT266 = require('@/assets/models/alicate-ft266.glb');

function modelo(posicao: Modelo3D['posicao'], rotacao: Modelo3D['rotacao']): Modelo3D {
  return { fonte: MODELO_FT266, tipo: 'GLB', posicao, rotacao, escala: [1, 1, 1], alturaSuperficie: 0 };
}

const AVISO_MODELO = 'Conteúdo feito para o FT-266. Outros multímetros podem ter faixas e bornes diferentes.';

export const multimetroFt266Frente: EquipamentoAR = {
  id: 'multimetro-ft266-frente',
  nome: 'Multímetro FT-266',
  descricao: 'Mede tensão, resistência e continuidade.',
  avisoModelo: AVISO_MODELO,
  alvo: {
    imagem: require('@/assets/markers/ft266-frente.jpg'),
    // Largura real do recorte da foto (corpo preto do aparelho).
    larguraFisicaMetros: 0.065,
  },
  // A face de cima do corpo coincide com o centro do alvo (valores impressos pelo script).
  modelo3D: modelo([-0.0108, -0.035, -0.0454], [0, 0, 0]),
  hotspots: [
    {
      id: 'seletor',
      numero: 1,
      nome: 'Seletor de função',
      rotuloCurto: 'Seletor',
      posicao: { u: 0.5, v: 0.364 },
      alturaEtiqueta: 0.035,
      alturaExtra: 0.003,
      oQueE:
        'Chave giratória que escolhe o que medir: tensão alternada (V~), tensão contínua (V⎓), resistência (Ω) e continuidade (símbolo de som).',
      comoUsar:
        'Gire até a função desejada. As duas pontas da chave apontam para a mesma função, porque o painel é espelhado. Escolha sempre uma faixa maior que o valor esperado.',
      dica: 'V~ 750 = tensão alternada (tomada). V⎓ 1000 = tensão contínua (pilhas, baterias, fontes). Ω 20K e Ω 200 = resistência. Ω 200 com o símbolo de som = continuidade.',
      cuidados: [
        { nivel: 'perigo', mensagem: 'Nunca gire o seletor com as pontas encostadas num circuito energizado.' },
        {
          nivel: 'info',
          mensagem: 'As posições A~ e EXTERNAL UNIT não são usadas nos guias deste app.',
        },
        { nivel: 'info', mensagem: 'Ao terminar, deixe o seletor em OFF para não gastar a bateria.' },
      ],
    },
    {
      id: 'display',
      numero: 2,
      nome: 'Display',
      rotuloCurto: 'Display',
      posicao: { u: 0.5, v: 0.709 },
      alturaEtiqueta: 0.03,
      oQueE: 'Tela que mostra o valor medido na unidade da faixa escolhida no seletor.',
      comoUsar: 'Leia o valor quando o número parar de variar.',
      dica: '"1" sozinho à esquerda indica que o valor passou da faixa: escolha uma faixa maior. Um "-" na tensão contínua só indica pontas invertidas. Se aparecer o símbolo de bateria, vire o multímetro para ver como trocar a bateria.',
      cuidados: [],
    },
    {
      id: 'borne-v-ohm',
      numero: 3,
      nome: 'Borne V Ω (vermelho)',
      rotuloCurto: 'V Ω',
      posicao: { u: 0.202, v: 0.932 },
      alturaEtiqueta: 0.03,
      alturaExtra: 0.0006,
      oQueE: 'Entrada da ponta de prova VERMELHA para medir tensão, resistência e continuidade.',
      comoUsar: 'Encaixe aqui a ponta vermelha em todas as medições dos guias.',
      cuidados: [
        { nivel: 'atencao', mensagem: 'Limite máximo impresso ao lado do borne: 1000 V contínuo / 750 V alternado.' },
      ],
    },
    {
      id: 'borne-com',
      numero: 4,
      nome: 'Borne COM (preto)',
      rotuloCurto: 'COM',
      posicao: { u: 0.5, v: 0.932 },
      alturaEtiqueta: 0.045,
      alturaExtra: 0.0006,
      oQueE: 'Entrada comum (referência/negativo) da ponta de prova PRETA.',
      comoUsar: 'Encaixe aqui a ponta preta. Ela não muda de lugar em nenhuma medição.',
      cuidados: [],
    },
    {
      id: 'borne-ext',
      numero: 5,
      nome: 'Borne EXT (amarelo)',
      rotuloCurto: 'EXT',
      posicao: { u: 0.798, v: 0.932 },
      alturaEtiqueta: 0.03,
      alturaExtra: 0.0006,
      oQueE: 'Entrada para um acessório externo de teste de isolação.',
      comoUsar: 'Não use este borne nas medições do dia a dia.',
      cuidados: [
        { nivel: 'atencao', mensagem: 'Não coloque a ponta vermelha no EXT para medir tensão ou resistência.' },
      ],
    },
    {
      id: 'data-hold',
      numero: 6,
      nome: 'Botão DATA HOLD',
      rotuloCurto: 'Data Hold',
      posicao: { u: 1.037, v: 0.02 },
      alturaEtiqueta: 0.03,
      alturaExtra: -0.012,
      animacaoModelo: 'Pressionar_DataHold',
      oQueE: 'Botão lateral que congela o valor mostrado no display.',
      comoUsar: 'Pressione para congelar a leitura e pressione de novo para liberar. É útil quando o display fica difícil de ver durante a medição.',
      dica: 'Se o display parar de mudar, confira se o Data Hold não ficou ligado.',
      cuidados: [],
    },
  ],
  procedimentos: [
    {
      id: 'tensao-dc',
      titulo: 'Medir tensão contínua (DC)',
      objetivo: 'Ex.: bateria de 9 V ou 12 V, fonte de bancada.',
      passos: [
        { hotspotId: 'borne-com', instrucao: 'Encaixe a ponta PRETA no borne COM.' },
        { hotspotId: 'borne-v-ohm', instrucao: 'Encaixe a ponta VERMELHA no borne V Ω.' },
        {
          hotspotId: 'seletor',
          instrucao: 'Gire o seletor para V⎓ 1000.',
          alerta: {
            nivel: 'info',
            mensagem: 'É a única faixa de tensão contínua deste multímetro. Ela mostra o valor em volts inteiros (sem casas decimais).',
          },
        },
        {
          hotspotId: null,
          instrucao: 'Encoste a ponta preta no negativo e a vermelha no positivo. A tensão é medida EM PARALELO.',
        },
        { hotspotId: 'display', instrucao: 'Leia o valor. Um "-" na frente indica apenas que as pontas estão invertidas.' },
        { hotspotId: 'data-hold', instrucao: 'Se precisar anotar o valor com calma, pressione DATA HOLD para congelar a leitura.' },
      ],
    },
    {
      id: 'tensao-ac',
      titulo: 'Medir tensão alternada (tomada)',
      objetivo: 'Ex.: tensão da rede elétrica (127 V ou 220 V).',
      passos: [
        {
          hotspotId: null,
          instrucao: 'Faça esta medição SOMENTE com o professor acompanhando.',
          alerta: { nivel: 'perigo', mensagem: 'Tensão da rede elétrica pode causar choque grave. Confira se as pontas estão sem danos.' },
        },
        { hotspotId: 'borne-com', instrucao: 'Ponta PRETA no borne COM.' },
        { hotspotId: 'borne-v-ohm', instrucao: 'Ponta VERMELHA no borne V Ω.' },
        { hotspotId: 'seletor', instrucao: 'Gire o seletor para V~ 750.' },
        {
          hotspotId: null,
          instrucao: 'Segurando as pontas só pela parte isolada, encoste cada ponta em um dos furos da tomada.',
          alerta: { nivel: 'perigo', mensagem: 'Nunca toque nas partes metálicas das pontas durante a medição.' },
        },
        { hotspotId: 'display', instrucao: 'Leia a tensão (algo perto de 127 V ou 220 V, dependendo da rede).' },
      ],
    },
    {
      id: 'resistencia',
      titulo: 'Medir resistência',
      objetivo: 'Ex.: conferir o valor de um resistor.',
      passos: [
        {
          hotspotId: null,
          instrucao: 'DESLIGUE o circuito. Se possível, retire o componente para medir isolado.',
          alerta: { nivel: 'perigo', mensagem: 'Medir resistência em circuito energizado pode danificar o multímetro.' },
        },
        { hotspotId: 'borne-com', instrucao: 'Ponta PRETA no borne COM.' },
        { hotspotId: 'borne-v-ohm', instrucao: 'Ponta VERMELHA no borne V Ω.' },
        { hotspotId: 'seletor', instrucao: 'Gire o seletor para Ω 200 (até 200 Ω) ou Ω 20K (até 20 kΩ).' },
        {
          hotspotId: null,
          instrucao: 'Encoste uma ponta em cada terminal. Não segure os terminais com os dedos: o seu corpo altera a leitura.',
        },
        { hotspotId: 'display', instrucao: 'Leia o valor. Se aparecer "1", a resistência passou da faixa: use a faixa maior.' },
      ],
    },
    {
      id: 'continuidade',
      titulo: 'Testar continuidade',
      objetivo: 'Ex.: ver se um fio ou trilha está inteiro.',
      passos: [
        { hotspotId: null, instrucao: 'DESLIGUE o circuito.' },
        { hotspotId: 'borne-com', instrucao: 'Ponta PRETA no COM.' },
        { hotspotId: 'borne-v-ohm', instrucao: 'Ponta VERMELHA no V Ω.' },
        { hotspotId: 'seletor', instrucao: 'Gire o seletor para Ω 200, a posição com o símbolo de som.' },
        { hotspotId: 'display', instrucao: 'Encoste as pontas nas duas extremidades. Bipe = há ligação elétrica.' },
      ],
    },
  ],
  cuidadosGerais: [
    { nivel: 'perigo', mensagem: 'App educacional. Medições na rede elétrica só com orientação direta do professor.' },
    { nivel: 'atencao', mensagem: 'Confira se as pontas de prova não estão danificadas antes de usar.' },
  ],
};

export const multimetroFt266Traseira: EquipamentoAR = {
  id: 'multimetro-ft266-traseira',
  nome: 'Multímetro FT-266 (parte de trás)',
  descricao: 'Tampa e troca da bateria.',
  avisoModelo: AVISO_MODELO,
  alvo: {
    imagem: require('@/assets/markers/ft266-traseira.jpg'),
    larguraFisicaMetros: 0.065,
  },
  // Aparelho virado: o modelo gira 180° para a face de tras ficar para cima (valores impressos pelo script).
  modelo3D: modelo([0.0108, 0, -0.0434], [0, 0, 180]),
  hotspots: [
    {
      id: 'etiqueta-aviso',
      numero: 1,
      nome: 'Etiqueta de aviso',
      rotuloCurto: 'Aviso',
      posicao: { u: 0.497, v: 0.259 },
      alturaEtiqueta: 0.035,
      oQueE: 'Etiqueta com o aviso de segurança e o tipo de bateria do aparelho: 9 V (tipo 6F22 / NEDA 1604).',
      comoUsar:
        'O aviso diz: para evitar choque, só abra a tampa depois de desconectar o multímetro do circuito ou do equipamento que está sendo medido.',
      cuidados: [
        { nivel: 'perigo', mensagem: 'Nunca abra o multímetro com as pontas ligadas a um circuito.' },
      ],
    },
    {
      id: 'parafuso-tampa',
      numero: 2,
      nome: 'Parafuso da tampa',
      rotuloCurto: 'Parafuso',
      posicao: { u: 0.5, v: 0.561 },
      alturaEtiqueta: 0.025,
      oQueE: 'Parafuso que prende a tampa da bateria.',
      comoUsar: 'Use uma chave Phillips pequena. Solte só este parafuso para trocar a bateria: os outros dois fecham o aparelho.',
      cuidados: [
        { nivel: 'info', mensagem: 'Guarde o parafuso num lugar seguro enquanto a tampa estiver aberta.' },
      ],
    },
    {
      id: 'tampa-bateria',
      numero: 3,
      nome: 'Tampa da bateria',
      rotuloCurto: 'Tampa da bateria',
      posicao: { u: 0.5, v: 0.797 },
      alturaEtiqueta: 0.03,
      oQueE: 'Compartimento onde fica a bateria de 9 V que alimenta o multímetro.',
      comoUsar: 'Depois de soltar o parafuso, retire a tampa para acessar a bateria.',
      dica: 'Troque a bateria quando aparecer o símbolo de bateria no display: com bateria fraca, as leituras podem ficar erradas.',
      cuidados: [],
    },
  ],
  procedimentos: [
    {
      id: 'trocar-bateria',
      titulo: 'Trocar a bateria',
      objetivo: 'Quando o display mostrar o símbolo de bateria fraca.',
      passos: [
        {
          hotspotId: 'etiqueta-aviso',
          instrucao: 'Desconecte as pontas de prova do circuito e dos bornes, e gire o seletor para OFF.',
          alerta: { nivel: 'perigo', mensagem: 'Nunca abra a tampa com o multímetro ligado a um circuito.' },
        },
        { hotspotId: 'parafuso-tampa', instrucao: 'Solte o parafuso da tampa com uma chave Phillips pequena.' },
        { hotspotId: 'tampa-bateria', instrucao: 'Retire a tampa e desconecte a bateria antiga do conector.' },
        {
          hotspotId: 'tampa-bateria',
          instrucao: 'Encaixe uma bateria nova de 9 V (6F22) no conector. O encaixe só entra na posição certa: não force.',
        },
        {
          hotspotId: 'parafuso-tampa',
          instrucao: 'Recoloque a tampa e aperte o parafuso antes de voltar a usar o multímetro.',
          alerta: { nivel: 'atencao', mensagem: 'Nunca use o multímetro com a tampa aberta.' },
        },
      ],
    },
  ],
  cuidadosGerais: [
    { nivel: 'info', mensagem: 'Descarte a bateria usada em um ponto de coleta, não no lixo comum.' },
  ],
};
