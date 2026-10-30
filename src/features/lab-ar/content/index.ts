import { EquipamentoAR } from '../types';

import { circuitoEsp32Led } from './circuito-esp32-led';
import { multimetroFt266Frente, multimetroFt266Traseira } from './multimetro-ft266';
import { protoboard } from './protoboard';

/**
 * Catalogos de tudo que o app reconhece, um por tela de RA. Para adicionar um
 * equipamento ou circuito novo, crie um arquivo seguindo o modelo de
 * multimetro-ft266.ts (ou circuito-esp32-led.ts) e inclua-o no catalogo certo.
 * A cena de RA registra os alvos sozinha.
 */
export const EQUIPAMENTOS_AR: EquipamentoAR[] = [multimetroFt266Frente, multimetroFt266Traseira, protoboard];

export const CIRCUITOS_AR: EquipamentoAR[] = [circuitoEsp32Led];

export const CATALOGOS_AR = {
  equipamentos: EQUIPAMENTOS_AR,
  circuitos: CIRCUITOS_AR,
};

export type CatalogoAR = keyof typeof CATALOGOS_AR;

export function buscarEquipamento(id: string | null): EquipamentoAR | null {
  return [...EQUIPAMENTOS_AR, ...CIRCUITOS_AR].find((equipamento) => equipamento.id === id) ?? null;
}
