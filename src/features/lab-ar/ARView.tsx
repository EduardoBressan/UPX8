import { ViroARSceneNavigator } from '@reactvision/react-viro';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { acoesAR } from './arStore';
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
        numberOfTrackedImages={1}
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
