import { Equipamento } from './types';

/**
 * Base de conhecimento curada dos equipamentos do MVP.
 * O multimetro foi escolhido como equipamento inicial por ter menos
 * controles que um osciloscopio, permitindo validar o fluxo completo
 * (identificacao -> RA -> explicacao) mais rapido. O osciloscopio pode
 * ser adicionado depois seguindo exatamente esta mesma estrutura.
 *
 * Aviso importante: multimetros variam de layout entre fabricantes e
 * modelos. As posicoes aproximadas (posicaoReferencia) sao um ponto de
 * partida generico e devem ser ajustadas/validadas com o multimetro real
 * usado no laboratorio.
 */
export const equipamentos: Equipamento[] = [
  {
    id: 'multimetro-digital',
    categoria: 'equipamento',
    nome: 'Multimetro Digital',
    aliases: ['multimetro', 'multimetro digital', 'multitester', 'tester'],
    oQueE:
      'Instrumento de medicao que combina varias funcoes (voltimetro, amperimetro, ohmimetro e, em alguns modelos, teste de continuidade e de diodos) em um unico aparelho.',
    paraQueServe:
      'Medir grandezas eletricas basicas em um circuito: tensao (V), corrente (A) e resistencia (Ohm), alem de verificar continuidade entre dois pontos.',
    avisoModelo:
      'O layout exato de botoes e o seletor variam entre marcas e modelos. As descricoes abaixo cobrem os controles presentes na maioria dos multimetros digitais basicos de laboratorio didatico.',
    controles: [
      {
        id: 'seletor-de-funcao',
        nome: 'Seletor de funcao (dial central)',
        aliases: ['seletor de funcao', 'dial central', 'chave seletora', 'seletor rotativo'],
        oQueFaz:
          'Roda giratoria central que escolhe o tipo de medicao (tensao DC, tensao AC, corrente, resistencia, continuidade) e a escala aproximada da leitura.',
        comoUsar:
          'Gire o seletor ate a posicao correspondente a grandeza que voce quer medir, escolhendo uma escala igual ou maior que o valor esperado.',
        quandoUsar: 'Sempre, antes de qualquer medicao — e o primeiro ajuste a fazer.',
        exemploAplicacao:
          'Para medir a tensao de uma pilha de 1,5V, posicione o seletor na escala de tensao continua (DC V) mais proxima acima desse valor.',
        cuidados: [
          {
            nivel: 'perigo',
            mensagem:
              'Nunca meca resistencia ou continuidade em um circuito energizado: pode danificar o multimetro e representar risco de choque. Desligue a alimentacao antes de medir resistencia.',
          },
          {
            nivel: 'atencao',
            mensagem:
              'Se a escala escolhida for menor que o valor real, o display pode mostrar "1" ou "OL" (overload). Aumente a escala e tente novamente.',
          },
        ],
      },
      {
        id: 'display',
        nome: 'Display (tela de leitura)',
        aliases: ['display', 'tela', 'visor', 'tela de leitura'],
        oQueFaz: 'Mostra o valor numerico medido, a unidade (V, A, Ohm) e, em alguns modelos, o simbolo de bateria fraca.',
        comoUsar: 'Apenas leia o valor exibido apos conectar as pontas de prova corretamente.',
        quandoUsar: 'Durante toda a medicao.',
        exemploAplicacao: 'Ler "3.30 V" ao medir uma fonte regulada de 3,3V.',
        cuidados: [
          {
            nivel: 'info',
            mensagem: 'Um sinal de "-" antes do valor indica apenas que a polaridade medida e invertida em relacao ao esperado, nao um erro.',
          },
        ],
      },
      {
        id: 'entrada-com',
        nome: 'Entrada COM (ponta preta)',
        aliases: ['entrada com', 'entrada comum', 'com', 'ponta preta'],
        oQueFaz: 'Entrada de referencia (comum/terra) para a ponta de prova preta, usada em todas as medicoes.',
        comoUsar: 'Conecte sempre a ponta preta nesta entrada antes de iniciar qualquer medicao.',
        quandoUsar: 'Em toda medicao, independentemente da grandeza.',
        exemploAplicacao: 'Conectar a ponta preta ao polo negativo do circuito antes de medir tensao.',
        cuidados: [],
      },
      {
        id: 'entrada-v-ohm',
        nome: 'Entrada V/Ohm (ponta vermelha - tensao e resistencia)',
        aliases: ['entrada v ohm', 'entrada de tensao', 'entrada vermelha tensao', 'v ohm'],
        oQueFaz: 'Entrada para a ponta de prova vermelha quando o multimetro esta medindo tensao ou resistencia.',
        comoUsar: 'Conecte a ponta vermelha aqui para medir tensao (V) ou resistencia (Ohm).',
        quandoUsar: 'Ao medir tensao ou resistencia — nao ao medir corrente.',
        exemploAplicacao: 'Medir a tensao entre os dois terminais de um resistor no circuito.',
        cuidados: [
          {
            nivel: 'atencao',
            mensagem: 'Confirme sempre em qual entrada a ponta vermelha esta antes de medir: usar a entrada errada e uma das causas mais comuns de queima de fusivel do multimetro.',
          },
        ],
      },
      {
        id: 'entrada-corrente',
        nome: 'Entrada A / mA (ponta vermelha - corrente)',
        aliases: ['entrada de corrente', 'entrada a ma', 'entrada amperagem'],
        oQueFaz: 'Entrada especifica para a ponta vermelha quando o multimetro esta medindo corrente eletrica.',
        comoUsar: 'Mova a ponta vermelha para esta entrada apenas quando o seletor estiver em uma escala de corrente, e conecte o multimetro em serie com o circuito (nunca em paralelo).',
        quandoUsar: 'Somente ao medir corrente (A ou mA).',
        exemploAplicacao: 'Medir a corrente que passa por um LED em serie com um resistor limitador.',
        cuidados: [
          {
            nivel: 'perigo',
            mensagem:
              'Medir corrente exige inserir o multimetro EM SERIE no circuito (abrindo o circuito e conectando o multimetro no meio), nunca em paralelo como na medicao de tensao. Conectar em paralelo com a ponta na entrada de corrente pode gerar um curto-circuito e queimar o fusivel interno do aparelho. Essa medicao exige atencao redobrada e orientacao do professor na primeira vez.',
          },
        ],
      },
    ],
    cuidadosGerais: [
      {
        nivel: 'atencao',
        mensagem:
          'Sempre comece pela maior escala disponivel quando nao souber o valor aproximado da grandeza medida, e va diminuindo aos poucos.',
      },
      {
        nivel: 'perigo',
        mensagem:
          'Este aplicativo e educacional. Para medicoes em circuitos com tensao de rede eletrica (110V/220V) ou qualquer circuito energizado fora de uma bancada didatica supervisionada, siga sempre as normas de seguranca e a orientacao direta do professor responsavel.',
      },
    ],
  },
];
