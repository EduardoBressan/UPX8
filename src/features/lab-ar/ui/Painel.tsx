import { ActivityIndicator, DimensionValue, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Cartao inferior usado por cima da camera de RA (equipamentos e circuitos):
 * conteudo rolavel e, opcionalmente, uma faixa fixa de botoes no rodape.
 */
export function Painel({
  children,
  rodape,
  alturaMaxima = '55%',
}: {
  children: React.ReactNode;
  rodape?: React.ReactNode;
  alturaMaxima?: DimensionValue;
}) {
  const theme = useTheme();
  return (
    <ThemedView style={[styles.painel, { borderColor: theme.border, maxHeight: alturaMaxima }]}>
      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      {rodape && <View style={[styles.rodape, { borderTopColor: theme.border }]}>{rodape}</View>}
    </ThemedView>
  );
}

export function Botao({
  rotulo,
  onPress,
  variante = 'primario',
  carregando = false,
  desabilitado = false,
}: {
  rotulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario';
  carregando?: boolean;
  desabilitado?: boolean;
}) {
  const theme = useTheme();
  const primario = variante === 'primario';
  return (
    <Pressable
      accessibilityRole="button"
      disabled={desabilitado || carregando}
      onPress={onPress}
      style={({ pressed }) => [
        styles.botao,
        primario ? { backgroundColor: theme.primary, borderColor: theme.primary } : { borderColor: theme.border },
        (pressed || desabilitado) && styles.botaoApagado,
      ]}>
      {carregando ? (
        <ActivityIndicator color={primario ? theme.primaryText : theme.text} />
      ) : (
        <ThemedText type="smallBold" themeColor={primario ? 'primaryText' : 'text'}>
          {rotulo}
        </ThemedText>
      )}
    </Pressable>
  );
}

export const estilosPainel = StyleSheet.create({
  titulo: {
    fontSize: 18,
    lineHeight: 24,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  secao: {
    marginTop: Spacing.one,
  },
  linhaBotoes: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
});

const styles = StyleSheet.create({
  painel: {
    width: '100%',
    maxWidth: MaxContentWidth,
    borderRadius: Spacing.four,
    borderWidth: 1,
    overflow: 'hidden',
  },
  conteudo: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  rodape: {
    flexDirection: 'row',
    gap: Spacing.two,
    padding: Spacing.three,
    paddingTop: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  botao: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.three,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
  },
  botaoApagado: {
    opacity: 0.6,
  },
});
