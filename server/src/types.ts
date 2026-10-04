import { ConhecimentoDetectado } from './knowledge/types';

export type AnalyzeMode = 'circuito' | 'equipamento';

export interface AnalyzeRequestBody {
  mode: AnalyzeMode;
  imageBase64: string;
  mimeType: 'image/jpeg' | 'image/png';
}

/** Caixa delimitadora normalizada (0 a 1) em relacao ao tamanho da imagem enviada. */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type OrigemInformacao = 'identificacao_visual' | 'base_de_conhecimento';

/**
 * Item detectado e devolvido ao app: junta o que a IA "enxergou" na imagem
 * (rotulo, posicao, confianca) com o conteudo curado da base de
 * conhecimento (nunca gerado pela IA).
 */
export interface DetectedItemDTO {
  rotuloDetectado: string;
  confianca: number;
  origemIdentificacao: OrigemInformacao;
  box: BoundingBox;
  conhecimento: ConhecimentoDetectado | null;
}

export interface AnalyzeResponseBody {
  mode: AnalyzeMode;
  items: DetectedItemDTO[];
  avisoIncerteza: string | null;
}

export interface ApiErrorBody {
  error: string;
  mensagem: string;
}
