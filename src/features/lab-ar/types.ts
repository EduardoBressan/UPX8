import { ImageSourcePropType } from 'react-native';

/**
 * Tipos do conteudo de RA por reconhecimento de imagem (padrao WL01).
 *
 * Cada equipamento do laboratorio tem uma imagem de referencia (o "alvo").
 * Quando a camera reconhece essa imagem, a cena ancora sobre ela os hotspots
 * (pinos numerados com etiquetas 3D) e, opcionalmente, um modelo 3D (.glb).
 */

export type Vec3 = [number, number, number];

export interface AlertaSeguranca {
  nivel: 'info' | 'atencao' | 'perigo';
  mensagem: string;
}

/**
 * Posicao de um ponto na imagem de referencia, em fracao da imagem:
 * u = 0 na borda esquerda e 1 na direita; v = 0 no topo e 1 embaixo.
 * Valores fora de 0..1 sao permitidos (ponto fora da imagem, ex.: quando o
 * alvo e um marcador impresso colado AO LADO do equipamento).
 */
export interface PontoNaImagem {
  u: number;
  v: number;
}

/** Uma parte do equipamento que o app aponta na peca real. */
export interface Hotspot {
  id: string;
  /** Numero exibido no pino 3D e na lista de partes. */
  numero: number;
  nome: string;
  /** Texto curto da etiqueta 3D (cabe numa linha). */
  rotuloCurto: string;
  posicao: PontoNaImagem;
  /** Altura da etiqueta acima da peca, em metros. Use para evitar sobreposicao entre etiquetas vizinhas. */
  alturaEtiqueta?: number;
  /** Quanto esta parte fica acima da superficie do modelo 3D (ex.: botao saltado), em metros. */
  alturaExtraNoModelo?: number;
  oQueE: string;
  comoUsar: string;
  dica?: string;
  cuidados: AlertaSeguranca[];
}

export interface PassoProcedimento {
  /** Hotspot destacado em 3D neste passo (null = passo sem parte especifica). */
  hotspotId: string | null;
  instrucao: string;
  alerta?: AlertaSeguranca;
}

/** Guia passo a passo de uso correto ("como medir tensao", "como montar um LED"...). */
export interface Procedimento {
  id: string;
  titulo: string;
  objetivo: string;
  passos: PassoProcedimento[];
}

/**
 * Modelo 3D opcional exibido sobre o alvo reconhecido.
 * posicao/rotacao/escala sao relativas ao centro da imagem de referencia
 * (X para a direita, Y para fora da imagem, Z para baixo da imagem), em metros.
 */
export interface Modelo3D {
  fonte: ImageSourcePropType;
  tipo: 'GLB' | 'GLTF' | 'OBJ';
  /** Arquivos extras (.mtl, texturas, .bin) quando o formato exigir. */
  recursos?: ImageSourcePropType[];
  posicao: Vec3;
  rotacao: Vec3;
  escala: Vec3;
  /** Altura da face de cima do modelo (em metros). Com o modelo visivel, os pinos sobem ate ela para nao ficarem escondidos dentro dele. */
  alturaSuperficie?: number;
}

export interface EquipamentoAR {
  id: string;
  nome: string;
  descricao: string;
  /** Aviso exibido quando o layout real pode variar entre modelos. */
  avisoModelo?: string;
  alvo: {
    imagem: ImageSourcePropType;
    /** Largura REAL da imagem reconhecida, em metros (ex.: largura do painel fotografado ou do marcador impresso). */
    larguraFisicaMetros: number;
  };
  modelo3D?: Modelo3D;
  hotspots: Hotspot[];
  procedimentos: Procedimento[];
  cuidadosGerais: AlertaSeguranca[];
}
