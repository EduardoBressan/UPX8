import { Image } from 'react-native';

import { EquipamentoAR, PontoNaImagem, Vec3 } from './types';

/**
 * Converte um ponto da imagem de referencia (u, v em fracao) para a posicao
 * 3D local do ViroARImageMarker, em metros.
 *
 * Sistema de coordenadas do marcador: origem no centro da imagem,
 * X para a direita, Y saindo da imagem (para cima da peca) e Z para a parte
 * de baixo da imagem.
 */
export function posicaoNoAlvo(equipamento: EquipamentoAR, ponto: PontoNaImagem, alturaY = 0): Vec3 {
  const { largura, altura } = dimensoesDoAlvo(equipamento);
  return [(ponto.u - 0.5) * largura, alturaY, (ponto.v - 0.5) * altura];
}

/** Tamanho fisico da imagem de referencia, em metros, mantendo a proporcao do arquivo. */
export function dimensoesDoAlvo(equipamento: EquipamentoAR): { largura: number; altura: number } {
  const largura = equipamento.alvo.larguraFisicaMetros;
  const fonte = Image.resolveAssetSource(equipamento.alvo.imagem);
  const proporcao = fonte?.width && fonte?.height ? fonte.height / fonte.width : 1;
  return { largura, altura: largura * proporcao };
}

/** Nome do alvo registrado no ViroARTrackingTargets para um equipamento. */
export function nomeDoAlvo(equipamento: EquipamentoAR): string {
  return `alvo_${equipamento.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
}
