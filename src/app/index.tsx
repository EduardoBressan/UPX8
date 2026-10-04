import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { EQUIPAMENTOS_AR } from '@/features/lab-ar/content';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.conteudo}>
          <View style={styles.cabecalho}>
            <View style={[styles.marca, { borderColor: theme.border }]}>
              <ThemedText type="smallBold">⚡ RA Lab</ThemedText>
            </View>
            <ThemedText type="subtitle" style={styles.titulo}>
              Aponte a câmera para o equipamento
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.centro}>
              O app reconhece a peça, aponta em 3D o que cada parte faz e guia você passo a passo no uso correto.
            </ThemedText>
          </View>

          <Link href="/ar" asChild>
            <Pressable style={({ pressed }) => [styles.botaoPrincipal, { backgroundColor: theme.primary }, pressed && styles.pressionado]}>
              <ThemedText type="smallBold" themeColor="primaryText" style={styles.textoBotao}>
                Abrir câmera de RA
              </ThemedText>
            </Pressable>
          </Link>

          <ThemedText type="smallBold" themeColor="textSecondary">
            O QUE O APP RECONHECE
          </ThemedText>
          {EQUIPAMENTOS_AR.map((equipamento) => (
            <ThemedView key={equipamento.id} type="backgroundElement" style={[styles.card, { borderColor: theme.border }]}>
              <Image source={equipamento.alvo.imagem} style={styles.miniatura} contentFit="contain" />
              <View style={styles.cardTextos}>
                <ThemedText type="smallBold" style={styles.cardTitulo}>
                  {equipamento.nome}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {equipamento.descricao}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {equipamento.hotspots.length} partes · {equipamento.procedimentos.length} guias de uso
                </ThemedText>
              </View>
            </ThemedView>
          ))}

          <ThemedText type="small" themeColor="textSecondary" style={styles.centro}>
            App educacional. Em procedimentos de risco, confirme sempre com o professor.
          </ThemedText>
        </ScrollView>
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
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.three,
  },
  cabecalho: {
    alignItems: 'center',
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  marca: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  titulo: {
    textAlign: 'center',
    fontSize: 28,
    lineHeight: 34,
  },
  centro: {
    textAlign: 'center',
  },
  botaoPrincipal: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  pressionado: {
    opacity: 0.7,
  },
  textoBotao: {
    fontSize: 17,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.three,
  },
  miniatura: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  cardTextos: {
    flex: 1,
    gap: 2,
  },
  cardTitulo: {
    fontSize: 17,
  },
});
