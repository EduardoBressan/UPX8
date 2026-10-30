import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';

import type { CatalogoAR } from './content';

/** O ViroReact nao roda no navegador: no web mostramos so um aviso. */
export function ARView(_props: { catalogo: CatalogoAR }) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="smallBold">Realidade aumentada indisponível no navegador</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.texto}>
        Instale o development build no celular Android (com ARCore) para usar a câmera de RA.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    padding: Spacing.four,
  },
  texto: {
    textAlign: 'center',
  },
});
