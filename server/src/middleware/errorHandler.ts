import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Nunca logar o corpo da requisicao (pode conter a imagem capturada) — apenas a mensagem do erro.
  const mensagemErro = err instanceof Error ? err.message : 'Erro desconhecido';
  console.error('[erro]', mensagemErro);

  res.status(500).json({
    error: 'erro_interno',
    mensagem: 'Nao foi possivel concluir a analise agora. Tente novamente em instantes.',
  });
}
