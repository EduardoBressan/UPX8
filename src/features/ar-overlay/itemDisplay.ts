import { AlertaSeguranca, ConhecimentoDetectado, DetectedItemDTO } from '@/types/analysis';

export function obterNomeExibicao(item: DetectedItemDTO): string {
  if (!item.conhecimento) return item.rotuloDetectado;
  return item.conhecimento.categoria === 'controle' ? item.conhecimento.controle.nome : item.conhecimento.nome;
}

export function obterSubtitulo(item: DetectedItemDTO): string | null {
  if (!item.conhecimento) return null;
  return item.conhecimento.categoria === 'controle' ? item.conhecimento.equipamentoNome : null;
}

function primeiraFrase(texto: string): string {
  const indice = texto.indexOf('. ');
  return indice === -1 ? texto : `${texto.slice(0, indice)}.`;
}

export function obterTeaser(item: DetectedItemDTO): string {
  if (!item.conhecimento) {
    return 'Item identificado, mas ainda sem conteudo cadastrado na base de conhecimento.';
  }
  const texto = item.conhecimento.categoria === 'controle' ? item.conhecimento.controle.oQueFaz : item.conhecimento.oQueE;
  return primeiraFrase(texto);
}

export function obterTodosOsCuidados(conhecimento: ConhecimentoDetectado): AlertaSeguranca[] {
  if (conhecimento.categoria === 'controle') {
    return conhecimento.controle.cuidados;
  }
  return conhecimento.cuidados;
}
