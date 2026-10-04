import { CameraView } from 'expo-camera';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

const LARGURA_MAXIMA = 1024;
const QUALIDADE_COMPRESSAO = 0.6;

export interface FotoCapturada {
  base64: string;
  mimeType: 'image/jpeg';
  uri: string;
}

/**
 * Redimensiona/comprime uma foto (de qualquer origem) e gera o base64.
 * Fotos de celulares modernos podem ter 10+ megapixels — sem esse passo, o
 * payload enviado ao backend (e repassado a Gemini) ficaria grande demais e
 * mais lento/caro sem ganho real de precisao na identificacao.
 */
async function comprimirFoto(uri: string): Promise<FotoCapturada> {
  const contexto = ImageManipulator.manipulate(uri);
  contexto.resize({ width: LARGURA_MAXIMA });
  const imagemRenderizada = await contexto.renderAsync();
  const resultado = await imagemRenderizada.saveAsync({
    base64: true,
    compress: QUALIDADE_COMPRESSAO,
    format: SaveFormat.JPEG,
  });

  if (!resultado.base64) {
    throw new Error('Nao foi possivel processar a imagem.');
  }

  return { base64: resultado.base64, mimeType: 'image/jpeg', uri: resultado.uri };
}

export async function capturarECompactarFoto(cameraRef: React.RefObject<CameraView | null>): Promise<FotoCapturada> {
  const foto = await cameraRef.current?.takePictureAsync();
  if (!foto?.uri) {
    throw new Error('Nao foi possivel capturar a foto da camera.');
  }

  return comprimirFoto(foto.uri);
}

/**
 * Permite testar o app com uma foto ja existente (ex.: uma foto de um
 * multimetro tirada antes) em vez de depender da camera ao vivo — util para
 * testar no navegador/computador sem precisar de um device fisico.
 * Retorna null se o usuario cancelar a escolha (nao e um erro).
 */
export async function escolherDaGaleriaECompactar(): Promise<FotoCapturada | null> {
  const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissao.granted) {
    throw new Error('Permissão para acessar as fotos foi negada.');
  }

  const resultado = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    quality: 1,
  });

  if (resultado.canceled || !resultado.assets?.[0]) {
    return null;
  }

  return comprimirFoto(resultado.assets[0].uri);
}
