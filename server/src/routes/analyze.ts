import { Router } from 'express';

import { listarRotulosValidos } from '../knowledge';
import { analyzeRateLimiter } from '../middleware/rateLimiter';
import { validateAnalyzeRequest } from '../middleware/validateAnalyzeRequest';
import { analisarImagemComGemini } from '../services/geminiVision';
import { gerarAvisoIncerteza, montarItensDetectados } from '../services/knowledgeLookup';
import { AnalyzeRequestBody, AnalyzeResponseBody } from '../types';

export const analyzeRouter = Router();

analyzeRouter.post('/analyze', analyzeRateLimiter, validateAnalyzeRequest, async (req, res, next) => {
  try {
    const { mode, imageBase64, mimeType } = req.body as AnalyzeRequestBody;

    const rotulosPermitidos = listarRotulosValidos(mode);
    const { itens } = await analisarImagemComGemini(mode, imageBase64, mimeType, rotulosPermitidos);

    const itensDetectados = montarItensDetectados(mode, itens);
    const avisoIncerteza = gerarAvisoIncerteza(itensDetectados);

    const resposta: AnalyzeResponseBody = {
      mode,
      items: itensDetectados,
      avisoIncerteza,
    };

    res.json(resposta);
  } catch (erro) {
    next(erro);
  }
});
