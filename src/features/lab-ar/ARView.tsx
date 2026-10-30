import { ViroARSceneNavigator } from '@reactvision/react-viro';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { acoesAR } from './arStore';
import { CATALOGOS_AR, CatalogoAR, CIRCUITOS_AR, EQUIPAMENTOS_AR } from './content';
import { alvosDoEquipamento } from './geometry';
import { LabRecognitionScene } from './scene/LabRecognitionScene';
import { ARHud } from './ui/ARHud';

// O navigator recebe o componente da cena (nao um elemento): um por catalogo, definidos fora do render.
function CenaEquipamentos() {
  return <LabRecognitionScene itens={EQUIPAMENTOS_AR} />;
}

function CenaCircuitos() {
  return <LabRecognitionScene itens={CIRCUITOS_AR} />;
}

const TELAS: Record<CatalogoAR, { cena: () => React.JSX.Element; dica: string }> = {
  equipamentos: { cena: CenaEquipamentos, dica: 'Aponte a câmera para um equipamento, de perto.' },
  circuitos: { cena: CenaCircuitos, dica: 'Aproxime o celular do ESP32, de cima, até a placa ocupar metade da tela.' },
};

/**
 * Camera de RA (ViroReact) + interface 2D por cima. A mesma tela serve para
 * Equipamentos e Circuitos; muda so o catalogo do que e reconhecido.
 * So funciona em development build, nao no Expo Go.
 */
export function ARView({ catalogo }: { catalogo: CatalogoAR }) {
  useEffect(() => {
    acoesAR.reiniciar();
    return () => acoesAR.reiniciar();
  }, []);

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus
        // Um por imagem cadastrada: com 1, o ARCore nao reconhece a parte de tras enquanto ainda guarda a frente.
        numberOfTrackedImages={CATALOGOS_AR[catalogo].flatMap(alvosDoEquipamento).length}
        initialScene={{ scene: TELAS[catalogo].cena }}
        style={styles.container}
      />
      <ARHud dica={TELAS[catalogo].dica} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
