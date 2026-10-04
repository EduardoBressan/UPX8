import { CameraView, useCameraPermissions } from 'expo-camera';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { capturarECompactarFoto, escolherDaGaleriaECompactar, FotoCapturada } from '@/features/camera/capturePhoto';
import { OverlayCanvas } from '@/features/ar-overlay/OverlayCanvas';
import { analyzeImage, ApiRequestError } from '@/services/api';
import { AnalyzeMode, DetectedItemDTO } from '@/types/analysis';

type EstadoTela =
  | { fase: 'pronto' }
  | { fase: 'capturando' }
  | { fase: 'analisando'; foto: FotoCapturada }
  | { fase: 'resultado'; foto: FotoCapturada; itens: DetectedItemDTO[]; aviso: string | null }
  | { fase: 'erro'; mensagem: string };

const TITULOS: Record<AnalyzeMode, string> = {
  circuito: 'Circuitos eletrônicos',
  equipamento: 'Equipamentos de laboratório',
};

const INSTRUCOES: Record<AnalyzeMode, string> = {
  circuito: 'Aponte para a placa e capture uma foto nítida e bem iluminada.',
  equipamento: 'Aponte para o equipamento, deixando os controles visíveis.',
};

export default function ScannerScreen() {
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const router = useRouter();
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [estado, setEstado] = useState<EstadoTela>({ fase: 'pronto' });

  if (mode !== 'circuito' && mode !== 'equipamento') {
    return <Redirect href="/" />;
  }

  async function processarFoto(foto: FotoCapturada) {
    setEstado({ fase: 'analisando', foto });
    try {
      const resposta = await analyzeImage({ mode: mode as AnalyzeMode, imageBase64: foto.base64, mimeType: foto.mimeType });
      setEstado({ fase: 'resultado', foto, itens: resposta.items, aviso: resposta.avisoIncerteza });
    } catch (erro) {
      const mensagem = erro instanceof ApiRequestError ? erro.mensagemUsuario : 'Não foi possível analisar a imagem. Tente novamente.';
      setEstado({ fase: 'erro', mensagem });
    }
  }

  async function capturarEAnalisar() {
    setEstado({ fase: 'capturando' });
    try {
      const foto = await capturarECompactarFoto(cameraRef);
      await processarFoto(foto);
    } catch {
      setEstado({ fase: 'erro', mensagem: 'Não foi possível capturar a foto. Tente novamente.' });
    }
  }

  async function escolherDaGaleria() {
    try {
      const foto = await escolherDaGaleriaECompactar();
      if (!foto) return; // usuário cancelou a escolha
      await processarFoto(foto);
    } catch {
      setEstado({ fase: 'erro', mensagem: 'Não foi possível abrir ou processar a imagem escolhida. Tente novamente.' });
    }
  }

  function novaCaptura() {
    setEstado({ fase: 'pronto' });
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topo}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.botaoVoltar}>
            <ThemedText type="subtitle">←</ThemedText>
          </Pressable>
          <ThemedText type="smallBold">{TITULOS[mode as AnalyzeMode]}</ThemedText>
          <View style={styles.espacoDireita} />
        </View>

        {!permission && <ThemedText type="default">Verificando permissão da câmera…</ThemedText>}

        {permission && !permission.granted && estado.fase === 'pronto' && (
          <View style={styles.centralizado}>
            <ThemedText type="default" style={styles.textoCentralizado}>
              Precisamos da sua permissão para usar a câmera e identificar {mode === 'circuito' ? 'os componentes do circuito' : 'o equipamento'}.
            </ThemedText>
            <Pressable onPress={requestPermission} style={[styles.botaoPrimario, { backgroundColor: theme.primary }]}>
              <ThemedText type="smallBold" themeColor="primaryText">
                Permitir câmera
              </ThemedText>
            </Pressable>
            <Pressable onPress={escolherDaGaleria} hitSlop={8}>
              <ThemedText type="smallBold" themeColor="primary">
                ou escolher uma foto já salva
              </ThemedText>
            </Pressable>
          </View>
        )}

        {permission?.granted && estado.fase === 'pronto' && (
          <View style={styles.areaCamera}>
            <CameraView ref={cameraRef} style={styles.camera} facing="back" />
            <View style={styles.rodape}>
              <ThemedView type="backgroundElement" style={styles.instrucao}>
                <ThemedText type="small">{INSTRUCOES[mode as AnalyzeMode]}</ThemedText>
              </ThemedView>
              <View style={styles.linhaAcoes}>
                <View style={styles.acaoLateral} />
                <Pressable onPress={capturarEAnalisar} style={[styles.botaoCaptura, { borderColor: theme.primary }]}>
                  <View style={[styles.botaoCapturaMiolo, { backgroundColor: theme.primary }]} />
                </Pressable>
                <Pressable onPress={escolherDaGaleria} hitSlop={8} style={styles.acaoLateral}>
                  <ThemedView type="backgroundElement" style={styles.botaoGaleria}>
                    <ThemedText type="smallBold">🖼️</ThemedText>
                  </ThemedView>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {(estado.fase === 'capturando' || estado.fase === 'analisando') && (
          <View style={styles.centralizado}>
            <ActivityIndicator size="large" color={theme.primary} />
            <ThemedText type="default" style={styles.textoCentralizado}>
              {estado.fase === 'capturando' ? 'Capturando foto…' : 'Analisando com a IA especializada…'}
            </ThemedText>
          </View>
        )}

        {estado.fase === 'erro' && (
          <View style={styles.centralizado}>
            <ThemedView type="dangerBackground" style={styles.avisoErro}>
              <ThemedText type="default" themeColor="danger">
                {estado.mensagem}
              </ThemedText>
            </ThemedView>
            <Pressable onPress={novaCaptura} style={[styles.botaoPrimario, { backgroundColor: theme.primary }]}>
              <ThemedText type="smallBold" themeColor="primaryText">
                Tentar novamente
              </ThemedText>
            </Pressable>
          </View>
        )}

        {estado.fase === 'resultado' && (
          <View style={styles.areaResultado}>
            {estado.aviso && (
              <ThemedView type="warningBackground" style={styles.avisoIncerteza}>
                <ThemedText type="small" themeColor="warning">
                  {estado.aviso}
                </ThemedText>
              </ThemedView>
            )}
            <OverlayCanvas fotoUri={estado.foto.uri} itens={estado.itens} />
            <Pressable onPress={novaCaptura} style={[styles.botaoPrimario, styles.botaoNovaCaptura, { backgroundColor: theme.primary }]}>
              <ThemedText type="smallBold" themeColor="primaryText">
                Nova captura
              </ThemedText>
            </Pressable>
          </View>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  botaoVoltar: {
    padding: Spacing.one,
  },
  espacoDireita: {
    width: 24,
  },
  centralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  textoCentralizado: {
    textAlign: 'center',
  },
  botaoPrimario: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
  },
  areaCamera: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  rodape: {
    position: 'absolute',
    bottom: Spacing.four,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
  },
  instrucao: {
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  linhaAcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  acaoLateral: {
    flex: 1,
    alignItems: 'center',
  },
  botaoCaptura: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoCapturaMiolo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  botaoGaleria: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avisoErro: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  areaResultado: {
    flex: 1,
  },
  avisoIncerteza: {
    padding: Spacing.two,
    marginHorizontal: Spacing.three,
    borderRadius: Spacing.two,
    marginBottom: Spacing.two,
  },
  botaoNovaCaptura: {
    position: 'absolute',
    bottom: Spacing.four,
    alignSelf: 'center',
  },
});
