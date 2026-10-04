import { buscarPorRotulo } from '../knowledge';
import { GeminiRawItem } from './geminiVision';
import { AnalyzeMode, DetectedItemDTO } from '../types';

/** Abaixo deste valor de confianca, ainda mostramos o item mas avisamos o aluno que a identificacao e incerta. */
const LIMIAR_CONFIANCA_BAIXA = 0.5;

/** Converte o box_2d da Gemini ([ymin, xmin, ymax, xmax] em escala 0-1000) para {x, y, width, height} normalizado 0-1. */
function converterBoundingBox(box2d: [number, number, number, number]) {
  const [yMin, xMin, yMax, xMax] = box2d;
  return {
    x: xMin / 1000,
    y: yMin / 1000,
    width: (xMax - xMin) / 1000,
    height: (yMax - yMin) / 1000,
  };
}

export function montarItensDetectados(mode: AnalyzeMode, itensGemini: GeminiRawItem[]): DetectedItemDTO[] {
  return itensGemini.map((item) => {
    const conhecimento = buscarPorRotulo(mode, item.label) ?? null;

    return {
      rotuloDetectado: item.label,
      confianca: item.confidence,
      origemIdentificacao: 'identificacao_visual',
      box: converterBoundingBox(item.box_2d),
      conhecimento,
    };
  });
}

export function gerarAvisoIncerteza(itens: DetectedItemDTO[]): string | null {
  if (itens.length === 0) {
    return 'Nao foi possivel identificar nenhum item com seguranca. Tente aproximar a camera, melhorar a iluminacao ou apontar diretamente para o componente/equipamento.';
  }

  const algumComBaixaConfianca = itens.some((item) => item.confianca < LIMIAR_CONFIANCA_BAIXA);
  if (algumComBaixaConfianca) {
    return 'Alguns itens foram identificados com baixa confianca. Considere tirar uma nova foto com melhor iluminacao antes de confiar totalmente na identificacao.';
  }

  return null;
}
