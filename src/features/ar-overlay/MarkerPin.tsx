import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { BoundingBox } from '@/types/analysis';

interface MarkerPinProps {
  box: BoundingBox;
  containerWidth: number;
  containerHeight: number;
  confiancaBaixa: boolean;
  selecionado: boolean;
  onPress: () => void;
}

const TAMANHO_TOQUE = 40;
const TAMANHO_PONTO = 16;

/**
 * Marcador discreto posicionado sobre a foto (nao sobre um preview ao vivo
 * rastreado em 3D — ver limitacao documentada no relatorio do projeto).
 * Um ponto simples pulsando, sem textos, para evitar poluir a imagem.
 */
export function MarkerPin({ box, containerWidth, containerHeight, confiancaBaixa, selecionado, onPress }: MarkerPinProps) {
  const pulso = useSharedValue(1);
  pulso.value = withRepeat(withTiming(1.6, { duration: 900, easing: Easing.out(Easing.ease) }), -1, true);

  const estiloAnimado = useAnimatedStyle(() => ({
    transform: [{ scale: pulso.value }],
    opacity: 2 - pulso.value,
  }));

  const centroX = (box.x + box.width / 2) * containerWidth;
  const centroY = (box.y + box.height / 2) * containerHeight;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={[
        styles.toque,
        {
          left: centroX - TAMANHO_TOQUE / 2,
          top: centroY - TAMANHO_TOQUE / 2,
        },
      ]}>
      <Animated.View style={[styles.anel, confiancaBaixa && styles.anelIncerto, estiloAnimado]} pointerEvents="none" />
      <View style={[styles.ponto, confiancaBaixa && styles.pontoIncerto, selecionado && styles.pontoSelecionado]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toque: {
    position: 'absolute',
    width: TAMANHO_TOQUE,
    height: TAMANHO_TOQUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anel: {
    position: 'absolute',
    width: TAMANHO_PONTO,
    height: TAMANHO_PONTO,
    borderRadius: TAMANHO_PONTO / 2,
    borderWidth: 2,
    borderColor: '#3C9FFE',
  },
  anelIncerto: {
    borderColor: '#F2C464',
  },
  ponto: {
    width: TAMANHO_PONTO * 0.6,
    height: TAMANHO_PONTO * 0.6,
    borderRadius: (TAMANHO_PONTO * 0.6) / 2,
    backgroundColor: '#3C9FFE',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  pontoIncerto: {
    backgroundColor: '#F2C464',
  },
  pontoSelecionado: {
    backgroundColor: '#ffffff',
    borderColor: '#3C9FFE',
  },
});
