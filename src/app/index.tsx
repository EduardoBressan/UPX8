import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const PASSOS = [
  'Abra a câmera e aponte para o equipamento ou a placa.',
  'Toque nos números para saber o que é cada parte.',
  'Siga os guias passo a passo para usar com segurança.',
];

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.marca, { borderColor: theme.border }]}>
          <ThemedText type="smallBold">⚡ RA Lab · Laboratório de Eletrônica</ThemedText>
        </View>

        <View style={styles.conteudo}>
          <View style={styles.textos}>
            <ThemedText style={styles.titulo}>Entenda equipamentos e circuitos na prática</ThemedText>
            <ThemedText type="default" themeColor="textSecondary">
              Aponte a câmera para um equipamento ou circuito do laboratório e veja, em 3D, o que cada parte faz e
              como usar.
            </ThemedText>
          </View>

          <View style={styles.passos}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              COMO FUNCIONA
            </ThemedText>
            {PASSOS.map((passo, indice) => (
              <View key={passo} style={styles.passo}>
                <ThemedView type="infoBackground" style={styles.numero}>
                  <ThemedText type="smallBold" themeColor="info">
                    {indice + 1}
                  </ThemedText>
                </ThemedView>
                <ThemedText type="default" style={styles.textoPasso}>
                  {passo}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.rodape}>
          <Link href="/ar" asChild>
            <Pressable accessibilityRole="button" accessibilityLabel="Abrir câmera de realidade aumentada">
              {({ pressed }) => (
                <View style={[styles.botao, { backgroundColor: theme.primary }, pressed && styles.pressionado]}>
                  <ThemedText type="smallBold" themeColor="primaryText" style={styles.textoBotao}>
                    Abrir câmera
                  </ThemedText>
                </View>
              )}
            </Pressable>
          </Link>
          <ThemedText type="small" themeColor="textSecondary" style={styles.aviso}>
            Em medições de risco, siga sempre o professor.
          </ThemedText>
        </View>
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
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  marca: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  conteudo: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.five,
  },
  textos: {
    gap: Spacing.two,
  },
  titulo: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 700,
  },
  passos: {
    gap: Spacing.three,
  },
  passo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  numero: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoPasso: {
    flex: 1,
  },
  rodape: {
    gap: Spacing.two,
  },
  botao: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressionado: {
    opacity: 0.85,
  },
  textoBotao: {
    fontSize: 17,
  },
  aviso: {
    textAlign: 'center',
  },
});
