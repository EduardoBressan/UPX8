import { EquipamentoAR } from '../types';

/**
 * Circuito ESP32 + LED montado no laboratorio: o pino D2 do ESP32 acende um
 * LED vermelho atraves de um resistor de 1 kΩ, com o retorno pelo barramento
 * GND da protoboard.
 *
 * Caminho da corrente: D2 -> fio preto -> resistor 1 kΩ -> LED -> fio roxo
 * -> barramento − -> fio laranja -> GND do ESP32.
 *
 * O alvo (assets/markers/circuito-esp32-led-qrcode.png) e o QR Code de
 * identificacao do circuito, com o nome dele em cima. Gerado por
 * scripts/gerar-qrcode-circuito.py, que tambem calcula as posicoes (u, v) das
 * partes. O modelo 3D (escala real) fica
 * centrado no QR Code; as partes fora do adesivo tem u ou v fora de 0..1.
 */

export const circuitoEsp32Led: EquipamentoAR = {
  id: 'circuito-esp32-led',
  nome: 'Circuito ESP32 + LED',
  descricao: 'O pino D2 do ESP32 acende um LED vermelho através de um resistor de 1 kΩ.',
  avisoModelo: 'O 3D mostra a montagem cadastrada para este circuito. Confira os furos na placa real antes de ligar.',
  alvo: {
    imagem: require('@/assets/markers/circuito-esp32-led-qrcode.png'),
    // Largura real do adesivo com o QR Code (impresso ou exibido numa tela).
    larguraFisicaMetros: 0.06,
  },
  // A protoboard do modelo fica centrada no QR Code, deitada na horizontal (ESP32 a esquerda) e em meia escala.
  modelo3D: {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- modelo 3D e um asset do Metro
    fonte: require('@/assets/models/circuito-esp32-led.glb'),
    tipo: 'GLB',
    posicao: [0, 0, 0],
    rotacao: [0, 90, 0],
    escala: [0.5, 0.5, 0.5],
    alturaSuperficie: 0,
  },
  // O modelo esta em meia escala: pinos e etiquetas menores para nao cobrir as pecas.
  tamanhoPinos: 0.5,
  hotspots: [
    {
      id: 'esp32',
      numero: 1,
      nome: 'ESP32 DevKit',
      rotuloCurto: 'ESP32',
      posicao: { u: 0.118, v: 0.5 },
      alturaEtiqueta: 0.02,
      alturaExtra: 0.0079,
      oQueE:
        'Placa com o microcontrolador ESP32 (módulo prateado ESP-WROOM-32), que tem Wi-Fi e Bluetooth. É o "cérebro" do circuito: o programa gravado nele decide quando o LED acende.',
      comoUsar:
        'Ligue a placa ao computador pelo cabo micro-USB para alimentar e gravar o programa. Os pinos das duas laterais estão encaixados na protoboard; cada pino ocupa uma fileira própria.',
      dica: 'Os pinos do ESP32 trabalham com 3,3 V, não 5 V. Na placa, o botão BOOT é usado para gravar e o EN reinicia o programa.',
      cuidados: [
        { nivel: 'atencao', mensagem: 'Não ligue 5 V direto num pino de sinal (GPIO): o ESP32 só suporta 3,3 V nos pinos.' },
        { nivel: 'info', mensagem: 'Monte e altere o circuito com o cabo USB desconectado.' },
      ],
    },
    {
      id: 'pino-d2',
      numero: 2,
      nome: 'Pino D2 (GPIO 2) e fio preto',
      rotuloCurto: 'D2',
      posicao: { u: -0.05, v: 0.617 },
      alturaEtiqueta: 0.03,
      alturaExtra: 0.0115,
      oQueE:
        'Pino de saída digital que liga e desliga o LED. O fio preto leva o sinal do D2 até a fileira do resistor.',
      comoUsar:
        'No programa, configure o pino como saída: pinMode(2, OUTPUT). Depois, digitalWrite(2, HIGH) coloca 3,3 V no pino (LED aceso) e digitalWrite(2, LOW) coloca 0 V (LED apagado).',
      dica: 'Na maioria das placas ESP32 DevKit, o D2 também liga o LED azul da própria placa: ele pisca junto com o LED vermelho.',
      cuidados: [
        { nivel: 'info', mensagem: 'Por convenção, fio preto costuma ser GND. Aqui ele leva o sinal do D2: siga sempre o caminho do fio, não só a cor.' },
      ],
    },
    {
      id: 'fio-laranja',
      numero: 3,
      nome: 'Fio laranja (GND do ESP32)',
      rotuloCurto: 'GND',
      posicao: { u: -0.093, v: 0.684 },
      alturaEtiqueta: 0.018,
      alturaExtra: 0.0115,
      oQueE: 'Liga o pino GND (terra) do ESP32 ao barramento − (azul) da protoboard.',
      comoUsar:
        'É por este fio que a corrente volta ao ESP32 depois de passar pelo LED. Sem ele o circuito fica aberto e o LED não acende.',
      cuidados: [],
    },
    {
      id: 'resistor',
      numero: 4,
      nome: 'Resistor de 1 kΩ',
      rotuloCurto: 'Resistor 1 kΩ',
      posicao: { u: 0.553, v: 0.5 },
      alturaEtiqueta: 0.02,
      alturaExtra: 0.0077,
      oQueE:
        'Limita a corrente que passa pelo LED. Cores: marrom (1), preto (0), vermelho (×100) e dourado (±5%) = 1.000 Ω = 1 kΩ.',
      comoUsar:
        'Fica EM SÉRIE com o LED: uma perna na fileira do fio do D2 e a outra, atravessando o canal central, na fileira do LED.',
      dica: 'Corrente ≈ (3,3 V − 2 V do LED) ÷ 1.000 Ω ≈ 1,3 mA. O LED acende fraco; com 220 Ω ou 330 Ω ele brilha mais e continua seguro para o ESP32.',
      cuidados: [
        { nivel: 'perigo', mensagem: 'Nunca ligue o LED direto no pino sem resistor: a corrente fica alta demais e pode queimar o LED e o pino.' },
      ],
    },
    {
      id: 'led',
      numero: 5,
      nome: 'LED vermelho',
      rotuloCurto: 'LED',
      posicao: { u: 0.608, v: 0.33 },
      alturaEtiqueta: 0.014,
      alturaExtra: 0.0129,
      oQueE: 'Diodo emissor de luz: acende quando a corrente passa do anodo (perna longa) para o catodo (perna curta).',
      comoUsar:
        'O anodo (+) fica na fileira do resistor e o catodo (−) na fileira do fio roxo, que vai para o GND.',
      dica: 'Se o LED não acender, a primeira suspeita é ele estar invertido: troque as pernas de lugar. O catodo também é o lado chanfrado do corpo.',
      cuidados: [],
    },
    {
      id: 'fio-roxo',
      numero: 6,
      nome: 'Fio roxo (catodo → GND)',
      rotuloCurto: 'Fio roxo',
      posicao: { u: 0.712, v: 0.684 },
      alturaEtiqueta: 0.02,
      alturaExtra: 0.0115,
      oQueE: 'Liga a fileira do catodo do LED ao barramento − (GND) da protoboard, fechando o circuito.',
      comoUsar: 'Uma ponta na mesma fileira da perna curta do LED, a outra no barramento −, o mesmo do fio laranja.',
      cuidados: [
        {
          nivel: 'atencao',
          mensagem:
            'Em algumas protoboards longas o barramento é interrompido no meio (a linha azul tem um corte). Se o fio laranja e o roxo estiverem em metades diferentes, ligue as duas metades com um fio.',
        },
      ],
    },
  ],
  procedimentos: [
    {
      id: 'caminho-corrente',
      titulo: 'Seguir o caminho da corrente',
      objetivo: 'Entender por onde a corrente passa quando o LED acende.',
      passos: [
        { hotspotId: 'pino-d2', instrucao: 'Com o D2 em HIGH, o pino fornece 3,3 V. A corrente sai dele pelo fio preto.' },
        { hotspotId: 'resistor', instrucao: 'Ela passa pelo resistor de 1 kΩ, que limita a corrente.' },
        { hotspotId: 'led', instrucao: 'Entra no LED pelo anodo (perna longa) e sai pelo catodo: o LED acende.' },
        { hotspotId: 'fio-roxo', instrucao: 'O fio roxo leva a corrente do catodo até o barramento − (GND).' },
        { hotspotId: 'fio-laranja', instrucao: 'Pelo fio laranja ela volta ao GND do ESP32, fechando o circuito.' },
        {
          hotspotId: null,
          instrucao: 'Resistor e LED estão EM SÉRIE: a mesma corrente passa pelos dois. Se qualquer ligação abrir, o LED apaga.',
        },
      ],
    },
    {
      id: 'conferir-montagem',
      titulo: 'Conferir a montagem com o multímetro',
      objetivo: 'Achar mau contato ou fio no lugar errado quando o LED não acende.',
      passos: [
        {
          hotspotId: 'esp32',
          instrucao: 'Desconecte o cabo USB do ESP32.',
          alerta: { nivel: 'atencao', mensagem: 'O teste de continuidade é feito com o circuito desligado.' },
        },
        { hotspotId: null, instrucao: 'Coloque o multímetro em continuidade (Ω 200, posição com o símbolo de som).' },
        { hotspotId: 'pino-d2', instrucao: 'Encoste as pontas no pino D2 e na perna do resistor do mesmo lado: deve bipar.' },
        { hotspotId: 'fio-roxo', instrucao: 'Encoste no catodo do LED e no barramento −: deve bipar.' },
        { hotspotId: 'fio-laranja', instrucao: 'Encoste no barramento − e no pino GND do ESP32: deve bipar.' },
        {
          hotspotId: 'led',
          instrucao: 'Se tudo bipou e o LED não acende, confira se ele não está invertido e se o programa usa o pino 2.',
        },
      ],
    },
  ],
  cuidadosGerais: [
    { nivel: 'info', mensagem: 'Monte e altere o circuito sempre com o ESP32 desconectado do USB.' },
    { nivel: 'atencao', mensagem: 'Os pinos do ESP32 são de 3,3 V. Não ligue 5 V nem fontes externas sem orientação do professor.' },
  ],
};
