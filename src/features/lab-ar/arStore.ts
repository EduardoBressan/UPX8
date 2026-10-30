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
  /** Qual dos alvos do equipamento ancora o conteudo (um equipamento pode ter mais de uma imagem). */
  alvo: string | null;
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
  alvo: null,
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
  equipamentoReconhecido(equipamentoId: string, alvo: string) {
    if (equipamentoId === estado.equipamentoId) {
      if (alvo !== estado.alvo) {
        // Outra imagem do mesmo equipamento: so assume quando a atual saiu de vista, para o conteudo nao
        // ficar pulando entre as duas. A parte selecionada e o guia em andamento continuam.
        if (estado.equipamentoVisivel) return;
        cancelarForaDeVista();
        atualizar({ alvo, equipamentoVisivel: true });
        return;
      }
      cancelarForaDeVista();
      if (!estado.equipamentoVisivel) atualizar({ equipamentoVisivel: true });
      return;
    }
    cancelarForaDeVista();
    atualizar({ equipamentoId, alvo, equipamentoVisivel: true, hotspotId: null, procedimento: null });
  },
  equipamentoForaDeVista(alvo: string) {
    if (alvo !== estado.alvo || !estado.equipamentoVisivel || temporizadorForaDeVista) return;
    temporizadorForaDeVista = setTimeout(() => {
      temporizadorForaDeVista = null;
      if (alvo === estado.alvo) atualizar({ equipamentoVisivel: false });
    }, TOLERANCIA_FORA_DE_VISTA_MS);
  },
  equipamentoPerdido(alvo: string) {
    if (alvo !== estado.alvo) return;
    cancelarForaDeVista();
    atualizar({ equipamentoId: null, alvo: null, equipamentoVisivel: false, hotspotId: null, procedimento: null });
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
