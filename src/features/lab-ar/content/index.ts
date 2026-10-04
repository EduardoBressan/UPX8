import { EquipamentoAR } from '../types';

import { multimetro } from './multimetro';
import { protoboard } from './protoboard';

/**
 * Catalogo de tudo que o app reconhece. Para adicionar um equipamento novo
 * (ex.: osciloscopio, fonte de bancada), crie um arquivo seguindo o modelo de
 * multimetro.ts e inclua-o aqui. A cena de RA registra os alvos sozinha.
 */
export const EQUIPAMENTOS_AR: EquipamentoAR[] = [multimetro, protoboard];

export function buscarEquipamento(id: string | null): EquipamentoAR | null {
  return EQUIPAMENTOS_AR.find((equipamento) => equipamento.id === id) ?? null;
}
