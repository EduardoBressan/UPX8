import { componentes } from './components';
import { equipamentos } from './equipment';
import { ConhecimentoDetectado } from './types';

export * from './types';
export { componentes } from './components';
export { equipamentos } from './equipment';

/**
 * Lista os rotulos que pedimos para a IA escolher.
 * - Modo "circuito": os componentes inteiros (resistor, capacitor...).
 * - Modo "equipamento": os CONTROLES individuais (seletor, display...),
 *   nao o equipamento como um todo — e isso que aparece como marcador de RA.
 */
export function listarRotulosValidos(modo: 'circuito' | 'equipamento'): string[] {
  if (modo === 'circuito') {
    return componentes.flatMap((componente) => [componente.id, ...componente.aliases]);
  }

  return equipamentos.flatMap((equipamento) =>
    equipamento.controles.flatMap((controle) => [controle.id, ...controle.aliases]),
  );
}

/**
 * Busca uma entrada da base de conhecimento a partir de um rotulo textual
 * retornado pela IA (comparacao case-insensitive contra id e aliases).
 */
export function buscarPorRotulo(modo: 'circuito' | 'equipamento', rotulo: string): ConhecimentoDetectado | null {
  const alvo = rotulo.trim().toLowerCase();

  if (modo === 'circuito') {
    const encontrado = componentes.find(
      (componente) => componente.id.toLowerCase() === alvo || componente.aliases.some((a) => a.toLowerCase() === alvo),
    );
    return encontrado ?? null;
  }

  for (const equipamento of equipamentos) {
    const controle = equipamento.controles.find(
      (c) => c.id.toLowerCase() === alvo || c.aliases.some((a) => a.toLowerCase() === alvo),
    );
    if (controle) {
      return {
        categoria: 'controle',
        equipamentoId: equipamento.id,
        equipamentoNome: equipamento.nome,
        avisoModelo: equipamento.avisoModelo,
        controle,
      };
    }
  }

  return null;
}
