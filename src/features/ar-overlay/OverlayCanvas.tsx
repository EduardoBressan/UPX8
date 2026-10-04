import { Image } from 'expo-image';
import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { DetectedItemDTO } from '@/types/analysis';

import { DetailPanel } from './DetailPanel';
import { MarkerPin } from './MarkerPin';
import { MiniInfoCard } from './MiniInfoCard';

interface OverlayCanvasProps {
  fotoUri: string;
  itens: DetectedItemDTO[];
}

const LIMIAR_CONFIANCA_BAIXA = 0.5;

/**
 * Mostra a foto capturada com os marcadores de RA por cima. Nao ha
 * rastreamento 3D: as posicoes sao relativas a esta foto parada (ver
 * limitacoes documentadas no relatorio do projeto).
 */
export function OverlayCanvas({ fotoUri, itens }: OverlayCanvasProps) {
  const [tamanho, setTamanho] = useState({ width: 0, height: 0 });
  const [itemSelecionadoIndex, setItemSelecionadoIndex] = useState<number | null>(null);
  const [detalheAbertoIndex, setDetalheAbertoIndex] = useState<number | null>(null);

  function aoMedirLayout(evento: LayoutChangeEvent) {
    const { width, height } = evento.nativeEvent.layout;
    setTamanho({ width, height });
  }

  const itemSelecionado = itemSelecionadoIndex !== null ? itens[itemSelecionadoIndex] : null;
  const itemDetalhado = detalheAbertoIndex !== null ? itens[detalheAbertoIndex] : null;

  return (
    <View style={styles.container} onLayout={aoMedirLayout}>
      <Image source={{ uri: fotoUri }} style={styles.foto} contentFit="contain" />

      {tamanho.width > 0 &&
        itens.map((item, indice) => (
          <MarkerPin
            key={`${item.rotuloDetectado}-${indice}`}
            box={item.box}
            containerWidth={tamanho.width}
            containerHeight={tamanho.height}
            confiancaBaixa={item.confianca < LIMIAR_CONFIANCA_BAIXA}
            selecionado={indice === itemSelecionadoIndex}
            onPress={() => setItemSelecionadoIndex(indice)}
          />
        ))}

      {itemSelecionado && (
        <MiniInfoCard
          item={itemSelecionado}
          onFechar={() => setItemSelecionadoIndex(null)}
          onVerDetalhes={() => setDetalheAbertoIndex(itemSelecionadoIndex)}
        />
      )}

      {itemDetalhado && <DetailPanel item={itemDetalhado} onClose={() => setDetalheAbertoIndex(null)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  foto: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
