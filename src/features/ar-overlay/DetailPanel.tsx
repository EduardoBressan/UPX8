import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { AlertaSeguranca, DetectedItemDTO } from '@/types/analysis';

import { obterNomeExibicao, obterSubtitulo, obterTodosOsCuidados } from './itemDisplay';

interface DetailPanelProps {
  item: DetectedItemDTO;
  onClose: () => void;
}

const CORES_POR_NIVEL: Record<AlertaSeguranca['nivel'], { texto: ThemeColor; fundo: ThemeColor; rotulo: string }> = {
  info: { texto: 'info', fundo: 'infoBackground', rotulo: 'Informação' },
  atencao: { texto: 'warning', fundo: 'warningBackground', rotulo: 'Atenção' },
  perigo: { texto: 'danger', fundo: 'dangerBackground', rotulo: 'Perigo' },
};

function AlertaCard({ alerta }: { alerta: AlertaSeguranca }) {
  const cores = CORES_POR_NIVEL[alerta.nivel];
  return (
    <ThemedView type={cores.fundo} style={styles.alertaCard}>
      <ThemedText type="smallBold" themeColor={cores.texto}>
        {cores.rotulo}
      </ThemedText>
      <ThemedText type="small" themeColor={cores.texto}>
        {alerta.mensagem}
      </ThemedText>
    </ThemedView>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <View style={styles.secao}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {titulo.toUpperCase()}
      </ThemedText>
      {children}
    </View>
  );
}

export function DetailPanel({ item, onClose }: DetailPanelProps) {
  const theme = useTheme();
  const subtitulo = obterSubtitulo(item);
  const conhecimento = item.conhecimento;
  const confiancaPercentual = Math.round(item.confianca * 100);

  return (
    <Modal animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <SafeAreaView style={styles.sheetWrapper} pointerEvents="box-none">
        <ThemedView style={[styles.sheet, { borderColor: theme.border }]}>
          <View style={styles.puxador} />

          <View style={styles.cabecalho}>
            <View style={styles.cabecalhoTextos}>
              {subtitulo && (
                <ThemedText type="small" themeColor="textSecondary">
                  {subtitulo}
                </ThemedText>
              )}
              <ThemedText type="title" style={styles.titulo}>
                {obterNomeExibicao(item)}
              </ThemedText>
            </View>
            <Pressable onPress={onClose} hitSlop={10} style={styles.fechar}>
              <ThemedText type="subtitle">✕</ThemedText>
            </Pressable>
          </View>

          <ThemedView type="backgroundElement" style={styles.origemBadge}>
            <ThemedText type="small">
              {item.origemIdentificacao === 'identificacao_visual' ? 'Identificação visual por IA' : 'Base de conhecimento'}
              {' · '}confiança {confiancaPercentual}%
            </ThemedText>
          </ThemedView>

          <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
            {!conhecimento && (
              <ThemedText type="default">
                Este item foi identificado pela câmera, mas ainda não há conteúdo educacional cadastrado para ele.
              </ThemedText>
            )}

            {conhecimento?.categoria === 'componente' && (
              <>
                <Secao titulo="Símbolo elétrico">
                  <ThemedText type="default">{conhecimento.simboloDescricao}</ThemedText>
                </Secao>
                <Secao titulo="O que é">
                  <ThemedText type="default">{conhecimento.oQueE}</ThemedText>
                </Secao>
                <Secao titulo="Para que serve">
                  <ThemedText type="default">{conhecimento.paraQueServe}</ThemedText>
                </Secao>
                <Secao titulo="Como funciona">
                  <ThemedText type="default">{conhecimento.comoFunciona}</ThemedText>
                </Secao>
                <Secao titulo="Como identificar na placa">
                  <ThemedText type="default">{conhecimento.identificacaoVisual}</ThemedText>
                </Secao>
                {conhecimento.terminais && conhecimento.terminais.length > 0 && (
                  <Secao titulo="Terminais">
                    {conhecimento.terminais.map((terminal) => (
                      <ThemedText key={terminal} type="default">
                        • {terminal}
                      </ThemedText>
                    ))}
                  </Secao>
                )}
              </>
            )}

            {conhecimento?.categoria === 'controle' && (
              <>
                <ThemedView type="infoBackground" style={styles.avisoModelo}>
                  <ThemedText type="small" themeColor="info">
                    {conhecimento.avisoModelo}
                  </ThemedText>
                </ThemedView>
                <Secao titulo="O que faz">
                  <ThemedText type="default">{conhecimento.controle.oQueFaz}</ThemedText>
                </Secao>
                <Secao titulo="Como usar">
                  <ThemedText type="default">{conhecimento.controle.comoUsar}</ThemedText>
                </Secao>
                <Secao titulo="Quando usar">
                  <ThemedText type="default">{conhecimento.controle.quandoUsar}</ThemedText>
                </Secao>
                <Secao titulo="Exemplo de aplicação">
                  <ThemedText type="default">{conhecimento.controle.exemploAplicacao}</ThemedText>
                </Secao>
              </>
            )}

            {conhecimento && obterTodosOsCuidados(conhecimento).length > 0 && (
              <Secao titulo="Cuidados">
                {obterTodosOsCuidados(conhecimento).map((alerta, indice) => (
                  <AlertaCard key={indice} alerta={alerta} />
                ))}
              </Secao>
            )}
          </ScrollView>
        </ThemedView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheetWrapper: {
    marginTop: 'auto',
    width: '100%',
    alignSelf: 'center',
    maxWidth: MaxContentWidth,
  },
  sheet: {
    borderTopLeftRadius: Spacing.four,
    borderTopRightRadius: Spacing.four,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: '80%',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
  },
  puxador: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8888',
    marginBottom: Spacing.two,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cabecalhoTextos: {
    flex: 1,
    gap: 2,
  },
  titulo: {
    fontSize: 28,
    lineHeight: 32,
  },
  fechar: {
    padding: Spacing.one,
  },
  origemBadge: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    alignSelf: 'flex-start',
    marginTop: Spacing.two,
  },
  avisoModelo: {
    borderRadius: Spacing.two,
    padding: Spacing.two,
  },
  conteudo: {
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    paddingBottom: Spacing.six,
  },
  secao: {
    gap: Spacing.half,
  },
  alertaCard: {
    borderRadius: Spacing.two,
    padding: Spacing.two,
    gap: 2,
  },
});
