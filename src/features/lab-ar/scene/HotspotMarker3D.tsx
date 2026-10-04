import { ViroNode, ViroPolyline, ViroSphere, ViroText } from '@reactvision/react-viro';

import { Vec3 } from '../types';

export type AparenciaHotspot = 'normal' | 'destaque' | 'esmaecido';

interface HotspotMarker3DProps {
  posicao: Vec3;
  numero: number;
  rotulo: string;
  alturaEtiqueta: number;
  aparencia: AparenciaHotspot;
  mostrarEtiqueta: boolean;
  onPress: () => void;
}

// Tamanhos em metros. Ajuste se as etiquetas ficarem grandes/pequenas demais no equipamento real.
const RAIO_PINO = { normal: 0.004, destaque: 0.0065, esmaecido: 0.0028 } as const;
const ESPESSURA_LINHA = { normal: 0.0008, destaque: 0.0014, esmaecido: 0 } as const;
const ESCALA_ETIQUETA = 0.018;
const ESCALA_ETIQUETA_DESTAQUE = 0.024;

/**
 * Pino 3D "espetado" na peca real: uma esfera na superficie, uma linha
 * vertical e uma etiqueta que sempre vira de frente para a camera
 * (billboard). Fica dentro do ViroARImageMarker, entao acompanha o
 * equipamento quando o aluno move o celular.
 */
export function HotspotMarker3D({
  posicao,
  numero,
  rotulo,
  alturaEtiqueta,
  aparencia,
  mostrarEtiqueta,
  onPress,
}: HotspotMarker3DProps) {
  const exibirEtiqueta = aparencia === 'destaque' || (mostrarEtiqueta && aparencia === 'normal');
  const escala = aparencia === 'destaque' ? ESCALA_ETIQUETA_DESTAQUE : ESCALA_ETIQUETA;
  const materialPino = aparencia === 'destaque' ? 'raPinoDestaque' : aparencia === 'esmaecido' ? 'raPinoEsmaecido' : 'raPino';

  return (
    <ViroNode position={posicao}>
      <ViroSphere
        position={[0, RAIO_PINO[aparencia], 0]}
        radius={RAIO_PINO[aparencia]}
        materials={[materialPino]}
        onClick={onPress}
      />

      {exibirEtiqueta && (
        <>
          <ViroPolyline
            points={[
              [0, RAIO_PINO[aparencia] * 2, 0],
              [0, alturaEtiqueta, 0],
            ]}
            thickness={ESPESSURA_LINHA[aparencia]}
            materials={[aparencia === 'destaque' ? 'raLinhaDestaque' : 'raLinha']}
            ignoreEventHandling
          />
          <ViroNode position={[0, alturaEtiqueta + 0.006, 0]} transformBehaviors={['billboard']}>
            <ViroText
              text={`${numero}  ${rotulo}`}
              scale={[escala, escala, escala]}
              width={8}
              height={1}
              extrusionDepth={0}
              outerStroke={{ type: 'Outline', width: 2, color: '#000000' }}
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: aparencia === 'destaque' ? '#FFB74D' : '#FFFFFF',
                textAlign: 'center',
                textAlignVertical: 'center',
              }}
              onClick={onPress}
            />
          </ViroNode>
        </>
      )}
    </ViroNode>
  );
}
