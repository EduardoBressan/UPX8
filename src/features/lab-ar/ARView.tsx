import { ViroARSceneNavigator } from '@reactvision/react-viro';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { acoesAR } from './arStore';
import { EQUIPAMENTOS_AR } from './content';
import { LabRecognitionScene } from './scene/LabRecognitionScene';
import { ARHud } from './ui/ARHud';

/** Camera de RA (ViroReact) + interface 2D por cima. So funciona em development build, nao no Expo Go. */
export function ARView() {
  useEffect(() => {
    acoesAR.reiniciar();
    return () => acoesAR.reiniciar();
  }, []);

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        autofocus
        // Um alvo por face/equipamento: com 1, o ARCore nao reconhece a parte de tras enquanto ainda guarda a frente.
        numberOfTrackedImages={EQUIPAMENTOS_AR.length}
        initialScene={{ scene: LabRecognitionScene }}
        style={styles.container}
      />
      <ARHud />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
