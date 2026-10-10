import { useSyncExternalStore } from 'react';

/**
 * Estado compartilhado entre a cena 3D (ViroReact) e a interface 2D por cima
 * da camera. Usamos um store externo em vez de `viroAppProps` porque a cena
 * e renderizada pelo ViroARSceneNavigator fora da arvore normal de props: um
 * store com useSyncExternalStore garante que os dois lados vejam sempre o
 * mesmo estado, sem depender de como o navigator repassa as props.
 */

export type Rastreamento = 'iniciando' | 'normal' | 'limitado' | 'indisponivel';

export interface EstadoAR {
  rastreamento: Rastreamento;
  /** Equipamento cujo alvo esta reconhecido agora (ou o ultimo reconhecido). */
  equipamentoId: string | null;
  /** false quando o ARCore perdeu a imagem de vista e so mantem a ultima posicao conhecida. */
  equipamentoVisivel: boolean;
  hotspotId: string | null;
  procedimento: { id: string; passo: number } | null;
  mostrarEtiquetas: boolean;
  mostrarModelo: boolean;
}

const ESTADO_INICIAL: EstadoAR = {
  rastreamento: 'iniciando',
  equipamentoId: null,
  equipamentoVisivel: false,
  hotspotId: null,
  procedimento: null,
  mostrarEtiquetas: true,
  mostrarModelo: true,
};

let estado: EstadoAR = ESTADO_INICIAL;
const ouvintes = new Set<() => void>();

// Tolerancia antes de considerar o equipamento fora de vista: o ARCore perde a imagem por instantes
// quando a camera treme ou inclina, e esconder o conteudo na hora faria o modelo piscar.
const TOLERANCIA_FORA_DE_VISTA_MS = 800;
let temporizadorForaDeVista: ReturnType<typeof setTimeout> | null = null;

function cancelarForaDeVista() {
  if (temporizadorForaDeVista) clearTimeout(temporizadorForaDeVista);
  temporizadorForaDeVista = null;
}

function atualizar(parcial: Partial<EstadoAR>) {
  estado = { ...estado, ...parcial };
  ouvintes.forEach((ouvinte) => ouvinte());
}

function assinar(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
  };
}

export function useEstadoAR(): EstadoAR {
  return useSyncExternalStore(assinar, () => estado, () => estado);
}

export const acoesAR = {
  reiniciar() {
    cancelarForaDeVista();
    atualizar(ESTADO_INICIAL);
  },
  definirRastreamento(rastreamento: Rastreamento) {
    if (rastreamento !== estado.rastreamento) atualizar({ rastreamento });
  },
  equipamentoReconhecido(equipamentoId: string) {
    cancelarForaDeVista();
    if (equipamentoId === estado.equipamentoId) {
      if (!estado.equipamentoVisivel) atualizar({ equipamentoVisivel: true });
      return;
    }
    atualizar({ equipamentoId, equipamentoVisivel: true, hotspotId: null, procedimento: null });
  },
  equipamentoForaDeVista(equipamentoId: string) {
    if (equipamentoId !== estado.equipamentoId || !estado.equipamentoVisivel || temporizadorForaDeVista) return;
    temporizadorForaDeVista = setTimeout(() => {
      temporizadorForaDeVista = null;
      if (equipamentoId === estado.equipamentoId) atualizar({ equipamentoVisivel: false });
    }, TOLERANCIA_FORA_DE_VISTA_MS);
  },
  equipamentoPerdido(equipamentoId: string) {
    if (equipamentoId !== estado.equipamentoId) return;
    cancelarForaDeVista();
    atualizar({ equipamentoId: null, equipamentoVisivel: false, hotspotId: null, procedimento: null });
  },
  selecionarHotspot(hotspotId: string | null) {
    // Durante um guia, tocar numa parte nao interrompe o passo a passo.
    if (estado.procedimento) return;
    atualizar({ hotspotId: hotspotId === estado.hotspotId ? null : hotspotId });
  },
  iniciarProcedimento(id: string) {
    atualizar({ procedimento: { id, passo: 0 }, hotspotId: null });
  },
  irParaPasso(passo: number) {
    if (!estado.procedimento) return;
    atualizar({ procedimento: { ...estado.procedimento, passo } });
  },
  encerrarProcedimento() {
    atualizar({ procedimento: null });
  },
  alternarEtiquetas() {
    atualizar({ mostrarEtiquetas: !estado.mostrarEtiquetas });
  },
  alternarModelo() {
    atualizar({ mostrarModelo: !estado.mostrarModelo });
  },
};
