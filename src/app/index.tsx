import { Href, Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

interface Opcao {
  href: Href;
  icone: string;
  titulo: string;
  descricao: string;
}

const OPCOES: Opcao[] = [
  {
    href: '/ar',
    icone: '🔧',
    titulo: 'Equipamentos',
    descricao: 'Aponte para o multímetro e veja o que cada parte faz, com guias de medição.',
  },
  {
    href: '/circuito',
    icone: '🔌',
    titulo: 'Circuitos',
    descricao: 'Aponte para o circuito montado e veja cada componente em 3D.',
  },
];

function CartaoOpcao({ opcao }: { opcao: Opcao }) {
  const theme = useTheme();
  return (
    <Link href={opcao.href} asChild>
      <Pressable accessibilityRole="button" accessibilityLabel={opcao.titulo}>
        {({ pressed }) => (
          <ThemedView
            type="backgroundElement"
            style={[styles.cartao, { borderColor: theme.border }, pressed && styles.pressionado]}>
            <ThemedView type="background" style={styles.icone}>
              <ThemedText style={styles.emoji}>{opcao.icone}</ThemedText>
            </ThemedView>
            <View style={styles.cartaoTextos}>
              <ThemedText type="smallBold" style={styles.cartaoTitulo}>
                {opcao.titulo}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {opcao.descricao}
              </ThemedText>
            </View>
            <ThemedText type="subtitle" themeColor="textSecondary" style={styles.seta}>
              ›
            </ThemedText>
          </ThemedView>
        )}
      </Pressable>
    </Link>
  );
}

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
              Escolha o que você quer estudar com a câmera em realidade aumentada.
            </ThemedText>
          </View>

          <View style={styles.opcoes}>
            {OPCOES.map((opcao) => (
              <CartaoOpcao key={opcao.titulo} opcao={opcao} />
            ))}
          </View>
        </View>

        <ThemedText type="small" themeColor="textSecondary" style={styles.aviso}>
          Em medições de risco, siga sempre o professor.
        </ThemedText>
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
  opcoes: {
    gap: Spacing.three,
  },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: 20,
    borderWidth: 1,
    padding: Spacing.three,
  },
  pressionado: {
    opacity: 0.7,
  },
  icone: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 26,
    lineHeight: 32,
  },
  cartaoTextos: {
    flex: 1,
    gap: 2,
  },
  cartaoTitulo: {
    fontSize: 17,
    lineHeight: 22,
  },
  seta: {
    fontSize: 28,
    lineHeight: 32,
  },
  aviso: {
    textAlign: 'center',
  },
});
