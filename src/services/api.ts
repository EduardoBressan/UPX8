import { AnalyzeMode, AnalyzeResponseBody, ApiErrorBody } from '@/types/analysis';

/**
 * URL do backend. Em desenvolvimento com Expo Go/dev build em um celular
 * fisico, "localhost" aponta para o proprio celular, nao para o seu
 * computador — por isso e obrigatorio configurar EXPO_PUBLIC_API_URL com o
 * IP da maquina que roda o backend na mesma rede Wi-Fi (ex.: 192.168.0.10).
 * Veja o arquivo ".env.example" na raiz do projeto.
 */
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export class ApiRequestError extends Error {
  constructor(public mensagemUsuario: string) {
    super(mensagemUsuario);
  }
}

interface AnalyzeImageInput {
  mode: AnalyzeMode;
  imageBase64: string;
  mimeType: 'image/jpeg' | 'image/png';
}

export async function analyzeImage(input: AnalyzeImageInput): Promise<AnalyzeResponseBody> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  } catch {
    throw new ApiRequestError(
      'Nao foi possivel conectar ao servidor. Verifique sua conexao com a internet/Wi-Fi e se o backend esta rodando.',
    );
  }

  if (!response.ok) {
    const corpoErro = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiRequestError(corpoErro?.mensagem ?? 'Ocorreu um erro ao analisar a imagem. Tente novamente.');
  }

  return (await response.json()) as AnalyzeResponseBody;
}
