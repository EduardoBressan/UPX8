import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

// Limite de payload: imagem comprimida em base64 nao deve passar disso (~5MB antes do base64).
const TAMANHO_MAXIMO_BASE64 = 7_000_000;

const analyzeRequestSchema = z.object({
  mode: z.enum(['circuito', 'equipamento']),
  imageBase64: z.string().min(100).max(TAMANHO_MAXIMO_BASE64),
  mimeType: z.enum(['image/jpeg', 'image/png']),
});

export function validateAnalyzeRequest(req: Request, res: Response, next: NextFunction) {
  const resultado = analyzeRequestSchema.safeParse(req.body);

  if (!resultado.success) {
    res.status(400).json({
      error: 'requisicao_invalida',
      mensagem: 'Os dados enviados nao sao validos. Verifique o modo, o formato e o tamanho da imagem.',
    });
    return;
  }

  req.body = resultado.data;
  next();
}
