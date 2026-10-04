/**
 * Tipos espelhados do backend (server/src/types.ts e server/src/knowledge/types.ts).
 * Mantidos manualmente em sincronia — projeto pequeno o suficiente para nao
 * justificar um pacote compartilhado/monorepo.
 */

export type AnalyzeMode = 'circuito' | 'equipamento';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type OrigemInformacao = 'identificacao_visual' | 'base_de_conhecimento';

export interface AlertaSeguranca {
  nivel: 'info' | 'atencao' | 'perigo';
  mensagem: string;
}

export interface ComponenteEletronico {
  id: string;
  categoria: 'componente';
  nome: string;
  aliases: string[];
  simboloDescricao: string;
  oQueE: string;
  paraQueServe: string;
  comoFunciona: string;
  identificacaoVisual: string;
  terminais?: string[];
  cuidados: AlertaSeguranca[];
}

export interface ControleEquipamento {
  id: string;
  nome: string;
  aliases: string[];
  oQueFaz: string;
  comoUsar: string;
  quandoUsar: string;
  exemploAplicacao: string;
  cuidados: AlertaSeguranca[];
}

export interface Equipamento {
  id: string;
  categoria: 'equipamento';
  nome: string;
  aliases: string[];
  oQueE: string;
  paraQueServe: string;
  avisoModelo: string;
  controles: ControleEquipamento[];
  cuidadosGerais: AlertaSeguranca[];
}

export interface ControleDetectado {
  categoria: 'controle';
  equipamentoId: string;
  equipamentoNome: string;
  avisoModelo: string;
  controle: ControleEquipamento;
}

export type ConhecimentoDetectado = ComponenteEletronico | ControleDetectado;

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
