import rateLimit from 'express-rate-limit';

/**
 * Protege a cota gratuita da Gemini contra uso excessivo/abusivo.
 * Limite generoso o suficiente para uso normal em laboratorio (varios
 * alunos, varias capturas), mas que impede loops acidentais ou abuso.
 */
export const analyzeRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'muitas_requisicoes',
    mensagem: 'Muitas analises em pouco tempo. Aguarde um momento antes de tentar novamente.',
  },
});
