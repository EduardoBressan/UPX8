import { ComponenteEletronico } from './types';

/**
 * Base de conhecimento curada dos componentes do MVP.
 * Conteudo tecnico basico e amplamente consolidado em livros didaticos de
 * eletronica (nao e especifico de fabricante). Ainda assim, valores exatos
 * (resistencia, tensao maxima etc.) sempre dependem do componente real usado
 * na placa e devem ser confirmados pelo aluno/professor quando relevante.
 */
export const componentes: ComponenteEletronico[] = [
  {
    id: 'resistor',
    categoria: 'componente',
    nome: 'Resistor',
    aliases: ['resistor', 'resistencia', 'resistor de carbono', 'resistor de filme'],
    simboloDescricao:
      'Retangulo alongado (padrao americano) ou linha em ziguezague (padrao europeu), com dois terminais retos saindo das extremidades.',
    oQueE:
      'Componente passivo que se opoe a passagem da corrente eletrica, dissipando energia na forma de calor.',
    paraQueServe:
      'Limitar a corrente em um trecho do circuito, dividir tensao entre pontos e ajustar niveis de sinal.',
    comoFunciona:
      'Segue a Lei de Ohm (V = R x I): quanto maior a resistencia, menor a corrente para uma mesma tensao aplicada. O valor nominal geralmente e indicado por faixas coloridas no corpo do componente.',
    identificacaoVisual:
      'Corpo cilindrico pequeno, geralmente bege ou azul, com 4 a 6 faixas coloridas pintadas ao redor e dois terminais metalicos retos.',
    terminais: ['Terminal 1 (sem polaridade definida)', 'Terminal 2 (sem polaridade definida)'],
    cuidados: [
      {
        nivel: 'info',
        mensagem: 'Resistor nao tem polaridade: pode ser instalado em qualquer sentido no circuito.',
      },
      {
        nivel: 'atencao',
        mensagem:
          'Resistores de baixa potencia podem esquentar bastante se a corrente exceder o valor nominal. Evite tocar apos o circuito ficar energizado por muito tempo.',
      },
    ],
  },
  {
    id: 'capacitor',
    categoria: 'componente',
    nome: 'Capacitor',
    aliases: ['capacitor', 'capacitor eletrolitico', 'capacitor ceramico', 'condensador'],
    simboloDescricao:
      'Duas linhas paralelas representando as placas do capacitor; no capacitor eletrolitico (polarizado), uma das linhas aparece curva e ha um sinal de "+" perto do terminal positivo.',
    oQueE:
      'Componente passivo que armazena energia eletrica em um campo eletrico formado entre duas placas condutoras separadas por um material isolante (dieletrico).',
    paraQueServe:
      'Filtrar ruidos e ondulacoes de tensao, armazenar energia temporariamente e acoplar ou desacoplar sinais entre partes do circuito.',
    comoFunciona:
      'Acumula carga eletrica enquanto a tensao aumenta e a libera quando a tensao diminui, suavizando variacoes. A capacidade de armazenamento e medida em Farads (normalmente microfarads, µF, em circuitos didaticos).',
    identificacaoVisual:
      'Capacitores eletroliticos sao cilindricos, geralmente pretos ou azuis, maiores que resistores, com uma faixa clara indicando o terminal negativo. Capacitores ceramicos sao pequenos discos achatados, geralmente azuis ou marrons.',
    terminais: ['Terminal positivo (+) — apenas em capacitores eletroliticos', 'Terminal negativo (-) — apenas em capacitores eletroliticos'],
    cuidados: [
      {
        nivel: 'perigo',
        mensagem:
          'Capacitores eletroliticos tem polaridade: inverter os terminais pode danificar o componente ou, em casos raros, fazer com que ele estufe ou se rompa. Nunca conecte um capacitor eletrolitico invertido.',
      },
      {
        nivel: 'atencao',
        mensagem:
          'Mesmo com o circuito desligado, um capacitor pode manter carga armazenada por um tempo. Em circuitos didaticos de baixa tensao o risco e minimo, mas em fontes de maior tensao isso exige cuidado e orientacao do professor.',
      },
    ],
  },
  {
    id: 'led',
    categoria: 'componente',
    nome: 'LED (Diodo Emissor de Luz)',
    aliases: ['led', 'diodo emissor de luz', 'diodo led'],
    simboloDescricao:
      'Simbolo de diodo (triangulo apontando para uma barra) com duas setas saindo da barra, representando a emissao de luz.',
    oQueE:
      'Diodo semicondutor que emite luz visivel (ou infravermelha) quando percorrido por corrente eletrica no sentido correto.',
    paraQueServe:
      'Indicacao visual de estados do circuito (ligado/desligado, alarme, sinalizacao) e iluminacao de baixo consumo.',
    comoFunciona:
      'Conduz corrente em apenas um sentido (do anodo para o catodo). Ao conduzir, eletrons e lacunas se recombinam na juncao semicondutora e liberam energia em forma de luz. Precisa de um resistor em serie para limitar a corrente e evitar queima.',
    identificacaoVisual:
      'Encapsulamento plastico colorido (transparente, vermelho, verde, azul etc.) com formato de cupula, dois terminais de comprimentos diferentes.',
    terminais: [
      'Anodo (terminal mais longo, polo positivo)',
      'Catodo (terminal mais curto, polo negativo — normalmente ao lado de um corte reto na base do LED)',
    ],
    cuidados: [
      {
        nivel: 'perigo',
        mensagem:
          'LED tem polaridade: se for ligado invertido, simplesmente nao acende (normalmente sem dano). Ligar sem resistor limitador de corrente pode queimar o LED quase instantaneamente.',
      },
    ],
  },
  {
    id: 'transistor-bjt',
    categoria: 'componente',
    nome: 'Transistor Bipolar (BJT)',
    aliases: ['transistor', 'transistor bipolar', 'bjt', 'transistor npn', 'transistor pnp'],
    simboloDescricao:
      'Circulo (ou sem circulo) com tres terminais: base (entrada), coletor e emissor; uma seta no emissor indica o sentido da corrente e se o transistor e NPN ou PNP.',
    oQueE:
      'Componente semicondutor de tres terminais usado para amplificar sinais eletricos ou funcionar como uma chave eletronica controlada por corrente.',
    paraQueServe:
      'Amplificar sinais fracos, chavear cargas (ligar/desligar outros componentes) e formar a base de circuitos digitais e amplificadores.',
    comoFunciona:
      'Uma pequena corrente aplicada na base controla uma corrente muito maior entre coletor e emissor. Em circuitos didaticos costuma ser usado como chave: corrente de base baixa liga ou desliga uma carga maior.',
    identificacaoVisual:
      'Encapsulamento plastico preto (formato "TO-92") com tres terminais na mesma face, ou encapsulamento metalico/plastico maior (TO-220) com aba metalica para dissipar calor em transistores de potencia.',
    terminais: ['Base (B) — controla o transistor', 'Coletor (C)', 'Emissor (E)'],
    cuidados: [
      {
        nivel: 'atencao',
        mensagem:
          'A ordem dos terminais (B, C, E) muda conforme o modelo do transistor. Nao existe um padrao universal — sempre confira o datasheet do modelo especifico antes de conectar.',
      },
      {
        nivel: 'atencao',
        mensagem:
          'Transistores de potencia podem esquentar bastante durante o uso. Evite tocar a carcaca metalica durante a operacao do circuito.',
      },
    ],
  },
  {
    id: 'circuito-integrado',
    categoria: 'componente',
    nome: 'Circuito Integrado (CI)',
    aliases: ['circuito integrado', 'ci', 'chip', 'integrated circuit'],
    simboloDescricao:
      'Retangulo com varios pinos numerados saindo das laterais; o simbolo interno varia conforme a funcao do CI (porta logica, amplificador operacional etc.).',
    oQueE:
      'Encapsulamento que reune dezenas, centenas ou milhoes de componentes eletronicos (transistores, resistores etc.) miniaturizados em uma unica pastilha de silicio.',
    paraQueServe:
      'Executar uma funcao especifica e complexa (amplificacao, logica digital, temporizacao, controle) sem precisar montar cada componente interno separadamente.',
    comoFunciona:
      'Internamente e um circuito completo fabricado em escala microscopica. Do lado de fora, o usuario so enxerga os pinos de entrada, saida, alimentacao e terra, conforme descrito no datasheet do modelo.',
    identificacaoVisual:
      'Encapsulamento plastico preto retangular, com pinos metalicos igualmente espacados nas laterais e um marcador (entalhe ou ponto) indicando o pino 1.',
    terminais: [
      'Pinos numerados a partir de uma marcacao de referencia (entalhe/ponto) — a funcao de cada pino depende do modelo especifico do CI.',
    ],
    cuidados: [
      {
        nivel: 'atencao',
        mensagem:
          'A pinagem varia totalmente de um modelo de CI para outro. Nunca alimente um CI sem antes confirmar a pinagem correta no datasheet do modelo exato usado na placa.',
      },
      {
        nivel: 'perigo',
        mensagem:
          'Inverter a alimentacao (Vcc e GND) de um CI pode danifica-lo permanentemente e, em alguns casos, aquece-lo de forma perigosa. Sempre confira com o professor antes de energizar um CI desconhecido.',
      },
    ],
  },
];
