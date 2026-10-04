import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, ThemeColor } from '@/constants/theme';

import { AlertaSeguranca } from '../types';

const CORES_POR_NIVEL: Record<AlertaSeguranca['nivel'], { texto: ThemeColor; fundo: ThemeColor; rotulo: string }> = {
  info: { texto: 'info', fundo: 'infoBackground', rotulo: 'Dica' },
  atencao: { texto: 'warning', fundo: 'warningBackground', rotulo: 'Atenção' },
  perigo: { texto: 'danger', fundo: 'dangerBackground', rotulo: 'Perigo' },
};

export function AlertaCard({ alerta }: { alerta: AlertaSeguranca }) {
  const cores = CORES_POR_NIVEL[alerta.nivel];
  return (
    <ThemedView type={cores.fundo} style={styles.card}>
      <ThemedText type="smallBold" themeColor={cores.texto}>
        {cores.rotulo}
      </ThemedText>
      <ThemedText type="small" themeColor={cores.texto}>
        {alerta.mensagem}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.two,
    padding: Spacing.two,
    gap: 2,
  },
});
