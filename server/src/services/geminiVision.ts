import { GoogleGenAI, Type } from '@google/genai';
import { z } from 'zod';

import { env } from '../config/env';
import { AnalyzeMode } from '../types';

// Modelo rapido e barato da familia Gemini, adequado para deteccao visual simples.
// Testado e validado nesta integracao. Caso a Google aposente este modelo no
// futuro, troque apenas esta constante.
const MODEL_NAME = 'gemini-2.0-flash';

const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });

/** Formato bruto que pedimos para a Gemini responder (antes de convertermos para o formato do app). */
const geminiRawItemSchema = z.object({
  label: z.string(),
  confidence: z.number().min(0).max(1),
  box_2d: z.tuple([z.number(), z.number(), z.number(), z.number()]),
});

const geminiRawResponseSchema = z.object({
  items: z.array(geminiRawItemSchema),
});

export type GeminiRawItem = z.infer<typeof geminiRawItemSchema>;

/** Schema no formato exigido pela API da Gemini (usa o enum Type, nao strings livres). */
const schemaResposta = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      description: 'Lista de itens identificados na imagem, no maximo um item por rotulo.',
      items: {
        type: Type.OBJECT,
        properties: {
          label: {
            type: Type.STRING,
            description: 'Deve ser EXATAMENTE um dos rotulos permitidos informados no prompt.',
          },
          confidence: {
            type: Type.NUMBER,
            description: 'Confianca de 0 a 1 de que a identificacao esta correta.',
          },
          box_2d: {
            type: Type.ARRAY,
            description: 'Caixa delimitadora [ymin, xmin, ymax, xmax] normalizada de 0 a 1000.',
            items: { type: Type.NUMBER },
          },
        },
        required: ['label', 'confidence', 'box_2d'],
      },
    },
  },
  required: ['items'],
};

function montarPrompt(mode: AnalyzeMode, rotulosPermitidos: string[]): string {
  const contexto =
    mode === 'circuito'
      ? 'Voce esta analisando uma foto de uma placa ou circuito eletronico de um laboratorio didatico.'
      : 'Voce esta analisando uma foto de um equipamento de laboratorio de eletrica/eletronica (ex.: multimetro).';

  return `${contexto}
Voce e um sistema de visao computacional especializado em eletronica e eletrotecnica. Sua UNICA tarefa e localizar, na imagem, quais dos itens abaixo estao visiveis, e retornar a posicao de cada um.

Rotulos permitidos (use exatamente um destes valores no campo "label", nunca invente outro nome):
${rotulosPermitidos.map((rotulo) => `- ${rotulo}`).join('\n')}

Regras obrigatorias:
1. So inclua um item na resposta se estiver razoavelmente visivel na imagem. Se nao tiver certeza, ou nao encontrar nenhum item da lista, retorne "items": [].
2. Nunca use um rotulo que nao esteja na lista permitida.
3. Nao inclua explicacoes, descricoes tecnicas ou texto fora do JSON solicitado — apenas identifique e localize.
4. Se a imagem estiver com pouca luz, desfocada, ou o item nao puder ser confirmado com seguranca, atribua um valor de "confidence" baixo (abaixo de 0.5) em vez de omitir a incerteza.
5. Responda somente com o JSON no formato definido pelo schema.`;
}

export interface AnaliseGeminiResultado {
  itens: GeminiRawItem[];
}

export async function analisarImagemComGemini(
  mode: AnalyzeMode,
  imageBase64: string,
  mimeType: string,
  rotulosPermitidos: string[],
): Promise<AnaliseGeminiResultado> {
  const prompt = montarPrompt(mode, rotulosPermitidos);

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }, { inlineData: { data: imageBase64, mimeType } }],
      },
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: schemaResposta,
    },
  });

  const textoResposta = response.text;
  if (!textoResposta) {
    throw new Error('A IA nao retornou nenhum conteudo de texto.');
  }

  let jsonBruto: unknown;
  try {
    jsonBruto = JSON.parse(textoResposta);
  } catch {
    throw new Error('A resposta da IA nao veio em formato JSON valido.');
  }

  const resultado = geminiRawResponseSchema.safeParse(jsonBruto);
  if (!resultado.success) {
    throw new Error('A resposta da IA nao seguiu o formato esperado.');
  }

  // Descarta rotulos que a IA tenha inventado fora da lista permitida (defesa extra alem do prompt).
  const permitidosNormalizados = new Set(rotulosPermitidos.map((r) => r.toLowerCase()));
  const itensValidos = resultado.data.items.filter((item) => permitidosNormalizados.has(item.label.toLowerCase()));

  return { itens: itensValidos };
}
