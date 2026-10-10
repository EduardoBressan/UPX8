import {
  Viro3DObject,
  ViroAmbientLight,
  ViroARImageMarker,
  ViroARScene,
  ViroARTrackingTargets,
  ViroDirectionalLight,
  ViroMaterials,
  ViroTrackingStateConstants,
} from '@reactvision/react-viro';

import { acoesAR, EstadoAR, Rastreamento, useEstadoAR } from '../arStore';
import { EQUIPAMENTOS_AR } from '../content';
import { nomeDoAlvo, posicaoNoAlvo } from '../geometry';
import { EquipamentoAR, Hotspot } from '../types';

import { AparenciaHotspot, HotspotMarker3D } from './HotspotMarker3D';

const ALTURA_ETIQUETA_PADRAO = 0.03;

// Registro dos alvos (feito uma vez, no carregamento do modulo — mesmo padrao do WL01).
ViroARTrackingTargets.createTargets(
  Object.fromEntries(
    EQUIPAMENTOS_AR.map((equipamento) => [
      nomeDoAlvo(equipamento),
      {
        source: equipamento.alvo.imagem,
        orientation: 'Up',
        physicalWidth: equipamento.alvo.larguraFisicaMetros,
      },
    ]),
  ),
);

// "Constant" ignora a iluminacao: os pinos ficam com a mesma cor em qualquer ambiente.
ViroMaterials.createMaterials({
  raPino: { diffuseColor: '#3C9FFE', lightingModel: 'Constant' },
  raPinoDestaque: { diffuseColor: '#FF9800', lightingModel: 'Constant' },
  raPinoEsmaecido: { diffuseColor: '#9E9E9E', lightingModel: 'Constant' },
  raLinha: { diffuseColor: '#FFFFFF', lightingModel: 'Constant' },
  raLinhaDestaque: { diffuseColor: '#FF9800', lightingModel: 'Constant' },
});

function converterRastreamento(estado: number): Rastreamento {
  if (estado === ViroTrackingStateConstants.TRACKING_NORMAL) return 'normal';
  if (estado === ViroTrackingStateConstants.TRACKING_LIMITED) return 'limitado';
  return 'indisponivel';
}

function hotspotEmDestaque(equipamento: EquipamentoAR, estado: EstadoAR): string | null {
  if (estado.procedimento) {
    const procedimento = equipamento.procedimentos.find((p) => p.id === estado.procedimento?.id);
    return procedimento?.passos[estado.procedimento.passo]?.hotspotId ?? null;
  }
  return estado.hotspotId;
}

/** Altura do pino: a da propria parte, mais a espessura do modelo quando ele esta apoiado sobre a imagem. */
function alturaDoPino(equipamento: EquipamentoAR, hotspot: Hotspot, mostrarModelo: boolean): number {
  const superficie = equipamento.modelo3D && mostrarModelo ? (equipamento.modelo3D.alturaSuperficie ?? 0) : 0;
  return superficie + (hotspot.alturaExtra ?? 0);
}

function aparenciaDo(hotspot: Hotspot, destaque: string | null, emProcedimento: boolean): AparenciaHotspot {
  if (hotspot.id === destaque) return 'destaque';
  // Durante um guia, so o passo atual chama atencao; o resto fica discreto.
  return emProcedimento ? 'esmaecido' : 'normal';
}

/**
 * Cena de RA por reconhecimento de imagem (padrao WL01):
 * camera -> reconhece a imagem do equipamento -> ancora -> pinos 3D + modelo -> toque.
 */
export function LabRecognitionScene() {
  const estado = useEstadoAR();

  return (
    <ViroARScene onTrackingUpdated={(estadoRastreamento) => acoesAR.definirRastreamento(converterRastreamento(estadoRastreamento))}>
      <ViroAmbientLight color="#FFFFFF" intensity={300} />
      <ViroDirectionalLight color="#FFFFFF" direction={[0, -1, -0.3]} intensity={500} />

      {EQUIPAMENTOS_AR.map((equipamento) => {
        const ativo = estado.equipamentoId === equipamento.id;
        // Depois de reconhecido, o conteudo continua preso ao equipamento mesmo quando a imagem sai de vista
        // ou fica pequena demais (o ARCore mantem a ultima posicao no mundo, certa para o aparelho parado na
        // mesa). So o equipamento ativo aparece: ao virar o aparelho, a frente da lugar a parte de tras assim
        // que ela for reconhecida.
        const destaque = ativo ? hotspotEmDestaque(equipamento, estado) : null;
        const emProcedimento = ativo && estado.procedimento !== null;
        // A parte em destaque (tocada ou do passo atual do guia) anima no modelo, ex.: Data Hold sendo pressionado.
        const animacao = equipamento.hotspots.find((h) => h.id === destaque)?.animacaoModelo;

        return (
          <ViroARImageMarker
            key={equipamento.id}
            target={nomeDoAlvo(equipamento)}
            onAnchorFound={() => acoesAR.equipamentoReconhecido(equipamento.id)}
            onAnchorUpdated={(ancora) => {
              // ARCore: "tracking" = imagem na camera agora; "lastKnownPose" = saiu de vista, posicao congelada.
              if (ancora.trackingMethod === 'tracking') acoesAR.equipamentoReconhecido(equipamento.id);
              else acoesAR.equipamentoForaDeVista(equipamento.id);
            }}
            onAnchorRemoved={() => acoesAR.equipamentoPerdido(equipamento.id)}>
            {ativo && equipamento.modelo3D && estado.mostrarModelo && (
              <Viro3DObject
                source={equipamento.modelo3D.fonte}
                resources={equipamento.modelo3D.recursos}
                type={equipamento.modelo3D.tipo}
                position={equipamento.modelo3D.posicao}
                rotation={equipamento.modelo3D.rotacao}
                scale={equipamento.modelo3D.escala}
                animation={{ name: animacao, run: animacao !== undefined, loop: true }}
                ignoreEventHandling
              />
            )}

            {ativo &&
              equipamento.hotspots.map((hotspot) => (
                <HotspotMarker3D
                  key={hotspot.id}
                  posicao={posicaoNoAlvo(equipamento, hotspot.posicao, alturaDoPino(equipamento, hotspot, estado.mostrarModelo))}
                  numero={hotspot.numero}
                  rotulo={hotspot.rotuloCurto}
                  alturaEtiqueta={hotspot.alturaEtiqueta ?? ALTURA_ETIQUETA_PADRAO}
                  aparencia={aparenciaDo(hotspot, destaque, emProcedimento)}
                  mostrarEtiqueta={estado.mostrarEtiquetas}
                  onPress={() => {
                    acoesAR.equipamentoReconhecido(equipamento.id);
                    acoesAR.selecionarHotspot(hotspot.id);
                  }}
                />
              ))}
          </ViroARImageMarker>
        );
      })}
    </ViroARScene>
  );
}
