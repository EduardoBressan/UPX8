/**
 * Tipos da base de conhecimento curada manualmente.
 * A IA NUNCA gera este conteudo — ela apenas identifica visualmente qual item
 * corresponde a qual entrada aqui. Isso evita que a IA "invente" explicacoes
 * tecnicas incorretas (alucinacao).
 */

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

/**
 * No modo "circuito" identificamos o componente inteiro. No modo
 * "equipamento" identificamos um CONTROLE especifico (botao, entrada,
 * display), por isso carregamos junto o nome/avisos do equipamento "pai"
 * para dar contexto ao aluno.
 */
export interface ControleDetectado {
  categoria: 'controle';
  equipamentoId: string;
  equipamentoNome: string;
  avisoModelo: string;
  controle: ControleEquipamento;
}

export type KnowledgeEntry = ComponenteEletronico | Equipamento;
export type ConhecimentoDetectado = ComponenteEletronico | ControleDetectado;
