import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { acoesAR, EstadoAR, useEstadoAR } from '../arStore';
import { buscarEquipamento } from '../content';
import { EquipamentoAR, Hotspot, Procedimento } from '../types';

import { AlertaCard } from './AlertaCard';

function mensagemDeStatus(estado: EstadoAR, equipamento: EquipamentoAR | null, dica: string): string {
  if (estado.rastreamento === 'limitado') return 'Mova o celular mais devagar e melhore a iluminação.';
  if (estado.rastreamento === 'indisponivel' || estado.rastreamento === 'iniciando') return 'Iniciando a câmera de RA…';
  if (!equipamento) return dica;
  if (!estado.equipamentoVisivel) return `${equipamento.nome}: posição mantida. Aproxime o celular para reajustar.`;
  return `${equipamento.nome} reconhecido`;
}

/** Interface 2D por cima da camera de RA: status, controles e paineis de explicacao. */
export function ARHud({ dica }: { dica: string }) {
  const router = useRouter();
  const theme = useTheme();
  const estado = useEstadoAR();
  const equipamento = buscarEquipamento(estado.equipamentoId);
  const hotspot = equipamento?.hotspots.find((h) => h.id === estado.hotspotId) ?? null;
  const procedimento = equipamento?.procedimentos.find((p) => p.id === estado.procedimento?.id) ?? null;
  const reconhecido = equipamento !== null && estado.equipamentoVisivel;

  return (
    <SafeAreaView style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <View style={styles.topo} pointerEvents="box-none">
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <ThemedView type="backgroundElement" style={styles.botaoRedondo}>
            <ThemedText type="smallBold">←</ThemedText>
          </ThemedView>
        </Pressable>
        <ThemedView type="backgroundElement" style={styles.status}>
          <View style={[styles.indicador, { backgroundColor: reconhecido ? '#2E7D32' : theme.warning }]} />
          <ThemedText type="small" style={styles.statusTexto}>
            {mensagemDeStatus(estado, equipamento, dica)}
          </ThemedText>
        </ThemedView>
      </View>

      {equipamento && (
        <View style={styles.alternadores} pointerEvents="box-none">
          <Alternador rotulo="Etiquetas" ativo={estado.mostrarEtiquetas} onPress={acoesAR.alternarEtiquetas} />
          {equipamento.modelo3D && (
            <Alternador rotulo="Modelo 3D" ativo={estado.mostrarModelo} onPress={acoesAR.alternarModelo} />
          )}
        </View>
      )}

      <View style={styles.rodape} pointerEvents="box-none">
        {equipamento && procedimento && estado.procedimento && (
          <PainelProcedimento equipamento={equipamento} procedimento={procedimento} passo={estado.procedimento.passo} />
        )}
        {equipamento && !procedimento && hotspot && <PainelHotspot hotspot={hotspot} />}
        {equipamento && !procedimento && !hotspot && <PainelEquipamento equipamento={equipamento} />}
      </View>
    </SafeAreaView>
  );
}

function Alternador({ rotulo, ativo, onPress }: { rotulo: string; ativo: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} hitSlop={6}>
      <ThemedView
        type={ativo ? 'primary' : 'backgroundElement'}
        style={[styles.alternador, { borderColor: theme.border }]}>
        <ThemedText type="smallBold" themeColor={ativo ? 'primaryText' : 'text'}>
          {rotulo}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

function Painel({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <ThemedView style={[styles.painel, { borderColor: theme.border }]}>
      <ScrollView contentContainerStyle={styles.painelConteudo} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </ThemedView>
  );
}

function PainelEquipamento({ equipamento }: { equipamento: EquipamentoAR }) {
  return (
    <Painel>
      <ThemedText type="smallBold" style={styles.tituloPainel}>
        {equipamento.nome}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Toque num número na peça (ou abaixo) para ver o que é cada parte.
      </ThemedText>

      <View style={styles.chips}>
        {equipamento.hotspots.map((h) => (
          <Pressable key={h.id} onPress={() => acoesAR.selecionarHotspot(h.id)}>
            <ThemedView type="backgroundElement" style={styles.chip}>
              <ThemedText type="small">
                {h.numero}. {h.rotuloCurto}
              </ThemedText>
            </ThemedView>
          </Pressable>
        ))}
      </View>

      {equipamento.procedimentos.length > 0 && (
        <>
          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.secao}>
            GUIAS DE USO
          </ThemedText>
          {equipamento.procedimentos.map((p) => (
            <Pressable key={p.id} onPress={() => acoesAR.iniciarProcedimento(p.id)}>
              <ThemedView type="backgroundElement" style={styles.itemGuia}>
                <View style={styles.itemGuiaTextos}>
                  <ThemedText type="smallBold">{p.titulo}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {p.objetivo}
                  </ThemedText>
                </View>
                <ThemedText type="smallBold" themeColor="primary">
                  ›
                </ThemedText>
              </ThemedView>
            </Pressable>
          ))}
        </>
      )}

      {equipamento.avisoModelo && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.secao}>
          {equipamento.avisoModelo}
        </ThemedText>
      )}
      {equipamento.cuidadosGerais.map((alerta, indice) => (
        <AlertaCard key={indice} alerta={alerta} />
      ))}
    </Painel>
  );
}

function PainelHotspot({ hotspot }: { hotspot: Hotspot }) {
  return (
    <Painel>
      <View style={styles.cabecalho}>
        <ThemedText type="smallBold" style={[styles.tituloPainel, styles.flex]}>
          {hotspot.numero}. {hotspot.nome}
        </ThemedText>
        <Pressable onPress={() => acoesAR.selecionarHotspot(null)} hitSlop={10}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            ✕
          </ThemedText>
        </Pressable>
      </View>

      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.secao}>
        O QUE É
      </ThemedText>
      <ThemedText type="small">{hotspot.oQueE}</ThemedText>

      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.secao}>
        COMO USAR
      </ThemedText>
      <ThemedText type="small">{hotspot.comoUsar}</ThemedText>

      {hotspot.dica && <AlertaCard alerta={{ nivel: 'info', mensagem: hotspot.dica }} />}
      {hotspot.cuidados.map((alerta, indice) => (
        <AlertaCard key={indice} alerta={alerta} />
      ))}
    </Painel>
  );
}

function PainelProcedimento({
  equipamento,
  procedimento,
  passo,
}: {
  equipamento: EquipamentoAR;
  procedimento: Procedimento;
  passo: number;
}) {
  const theme = useTheme();
  const atual = procedimento.passos[passo];
  const parte = equipamento.hotspots.find((h) => h.id === atual.hotspotId);
  const primeiro = passo === 0;
  const ultimo = passo === procedimento.passos.length - 1;

  return (
    <Painel>
      <View style={styles.cabecalho}>
        <View style={styles.flex}>
          <ThemedText type="small" themeColor="textSecondary">
            {procedimento.titulo} · passo {passo + 1} de {procedimento.passos.length}
          </ThemedText>
          {parte && (
            <ThemedText type="smallBold" themeColor="warning">
              Veja na peça: {parte.numero}. {parte.rotuloCurto}
            </ThemedText>
          )}
        </View>
        <Pressable onPress={acoesAR.encerrarProcedimento} hitSlop={10}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            ✕
          </ThemedText>
        </Pressable>
      </View>

      <ThemedText type="default">{atual.instrucao}</ThemedText>
      {atual.alerta && <AlertaCard alerta={atual.alerta} />}

      <View style={styles.navegacao}>
        <Pressable
          disabled={primeiro}
          onPress={() => acoesAR.irParaPasso(passo - 1)}
          style={[styles.botaoNav, { borderColor: theme.border, opacity: primeiro ? 0.4 : 1 }]}>
          <ThemedText type="smallBold">Anterior</ThemedText>
        </Pressable>
        <Pressable
          onPress={() => (ultimo ? acoesAR.encerrarProcedimento() : acoesAR.irParaPasso(passo + 1))}
          style={[styles.botaoNav, { backgroundColor: theme.primary, borderColor: theme.primary }]}>
          <ThemedText type="smallBold" themeColor="primaryText">
            {ultimo ? 'Concluir' : 'Próximo'}
          </ThemedText>
        </Pressable>
      </View>
    </Painel>
  );
}

const styles = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  botaoRedondo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  indicador: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusTexto: {
    flex: 1,
  },
  alternadores: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  alternador: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  rodape: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: Spacing.three,
  },
  painel: {
    width: '100%',
    maxWidth: MaxContentWidth,
    maxHeight: '55%',
    borderRadius: Spacing.four,
    borderWidth: 1,
  },
  painelConteudo: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  tituloPainel: {
    fontSize: 18,
    lineHeight: 24,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  secao: {
    marginTop: Spacing.one,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  itemGuia: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  itemGuiaTextos: {
    flex: 1,
    gap: 2,
  },
  navegacao: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  botaoNav: {
    flex: 1,
    alignItems: 'center',
    borderRadius: Spacing.two,
    borderWidth: 1,
    paddingVertical: Spacing.two,
  },
});
