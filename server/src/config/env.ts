import 'dotenv/config';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Variavel de ambiente "${name}" nao foi definida. Copie server/.env.example para server/.env e preencha os valores.`,
    );
  }
  return value;
}

export const env = {
  geminiApiKey: requireEnv('GEMINI_API_KEY'),
  port: Number(process.env.PORT ?? 3000),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',
};
