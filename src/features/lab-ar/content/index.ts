import { EquipamentoAR } from '../types';

import { multimetroFt266Frente, multimetroFt266Traseira } from './multimetro-ft266';
import { protoboard } from './protoboard';

/**
 * Catalogo de tudo que o app reconhece. Para adicionar um equipamento novo
 * (ex.: osciloscopio, fonte de bancada), crie um arquivo seguindo o modelo de
 * multimetro-ft266.ts e inclua-o aqui. A cena de RA registra os alvos sozinha.
 */
export const EQUIPAMENTOS_AR: EquipamentoAR[] = [multimetroFt266Frente, multimetroFt266Traseira, protoboard];

export function buscarEquipamento(id: string | null): EquipamentoAR | null {
  return EQUIPAMENTOS_AR.find((equipamento) => equipamento.id === id) ?? null;
}
