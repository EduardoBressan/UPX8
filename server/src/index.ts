import cors from 'cors';
import express from 'express';

import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { analyzeRouter } from './routes/analyze';

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: '8mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', analyzeRouter);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Backend do assistente de laboratorio rodando em http://localhost:${env.port}`);
});
