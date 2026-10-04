import { Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { DetectedItemDTO } from '@/types/analysis';

import { obterNomeExibicao, obterSubtitulo, obterTeaser } from './itemDisplay';

interface MiniInfoCardProps {
  item: DetectedItemDTO;
  onVerDetalhes: () => void;
  onFechar: () => void;
}

/**
 * Card compacto que aparece ao tocar em um marcador — informacao progressiva:
 * so o essencial, com um botao para abrir o painel completo se o aluno quiser.
 */
export function MiniInfoCard({ item, onVerDetalhes, onFechar }: MiniInfoCardProps) {
  const theme = useTheme();
  const subtitulo = obterSubtitulo(item);

  return (
    <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(120)} style={styles.wrapper}>
      <ThemedView type="backgroundElement" style={styles.card}>
        <Pressable onPress={onFechar} hitSlop={10} style={styles.fechar}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            ✕
          </ThemedText>
        </Pressable>

        {subtitulo && (
          <ThemedText type="small" themeColor="textSecondary">
            {subtitulo}
          </ThemedText>
        )}
        <ThemedText type="subtitle" style={styles.titulo}>
          {obterNomeExibicao(item)}
        </ThemedText>
        <ThemedText type="default">{obterTeaser(item)}</ThemedText>

        <Pressable onPress={onVerDetalhes} style={[styles.botao, { backgroundColor: theme.primary }]}>
          <ThemedText type="smallBold" themeColor="primaryText">
            Ver detalhes
          </ThemedText>
        </Pressable>
      </ThemedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
    bottom: Spacing.four,
  },
  card: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  fechar: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    padding: Spacing.one,
  },
  titulo: {
    fontSize: 22,
    lineHeight: 28,
  },
  botao: {
    marginTop: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
});
