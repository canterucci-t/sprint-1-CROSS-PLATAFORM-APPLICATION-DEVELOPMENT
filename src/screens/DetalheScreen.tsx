import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, STATUS_COLORS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../types';
import { LABEL_VEGETACAO, LABEL_CLIMA } from '../data/mockData';
import ScreenHeader from '../components/ScreenHeader';
import StatusChip from '../components/StatusChip';
import GraficoCrescimento from '../components/GraficoCrescimento';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Detalhe'>;

export default function DetalheScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { getTrechoById } = useApp();
  const trecho = getTrechoById(route.params.trechoId);

  if (!trecho) {
    return (
      <View style={styles.container}>
        <ScreenHeader titulo="Detalhe do Trecho" onBack={() => navigation.goBack()} />
        <Text style={{ padding: 24, color: COLORS.text }}>Trecho não encontrado.</Text>
      </View>
    );
  }

  const statusColors = STATUS_COLORS[trecho.status];
  const alturaPercent = Math.min((trecho.alturaAtual / 35) * 100, 100);

  return (
    <View style={styles.container}>
      <ScreenHeader
        titulo="Detalhe do Trecho"
        subtitulo={`${trecho.rodovia} km ${trecho.kmInicial}–${trecho.kmFinal}`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Foto simulada */}
        <View style={styles.fotoCard}>
          <View style={styles.fotoBg}>
            <Ionicons name="image" size={48} color="rgba(255,255,255,0.3)" />
            <Text style={styles.fotoLabel}>
              {trecho.rodovia} · km {trecho.kmInicial} · {trecho.sentido}
            </Text>
            <View style={styles.fotoOverlay}>
              <View style={styles.fotoBadge}>
                <Ionicons name="camera" size={12} color={COLORS.white} />
                <Text style={styles.fotoBadgeText}>Câmera de vistoria · {trecho.ultimaColeta}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Info principal */}
        <View style={[styles.infoCard, { borderLeftColor: statusColors.border }]}>
          <View style={styles.infoHeader}>
            <View>
              <View style={styles.rodoviaBadge}>
                <Text style={styles.rodoviaBadgeText}>{trecho.rodovia}</Text>
              </View>
              <Text style={styles.nomeRodovia}>{trecho.nomeRodovia}</Text>
              <Text style={styles.infoKm}>km {trecho.kmInicial}–{trecho.kmFinal} · Sentido {trecho.sentido}</Text>
            </View>
            <StatusChip status={trecho.status} />
          </View>

          {/* Altura com barra */}
          <View style={styles.alturaSection}>
            <View style={styles.alturaRow}>
              <View>
                <Text style={styles.alturaLabel}>Altura atual</Text>
                <Text style={[styles.alturaValor, { color: statusColors.text }]}>
                  {trecho.alturaAtual} <Text style={styles.alturaCm}>cm</Text>
                </Text>
              </View>
              <View style={styles.limiteSep} />
              <View>
                <Text style={styles.alturaLabel}>Limite operacional</Text>
                <Text style={[styles.alturaValor, { color: COLORS.danger }]}>
                  30 <Text style={styles.alturaCm}>cm</Text>
                </Text>
              </View>
              <View style={styles.limiteSep} />
              <View>
                <Text style={styles.alturaLabel}>Diferença</Text>
                <Text style={[styles.alturaValor, {
                  color: trecho.alturaAtual >= 30 ? COLORS.danger : COLORS.warning,
                  fontSize: 20,
                }]}>
                  {trecho.alturaAtual >= 30 ? '+' : ''}{trecho.alturaAtual - 30} cm
                </Text>
              </View>
            </View>

            {/* Barra visual */}
            <View style={styles.barraContainer}>
              <View style={styles.barraBg}>
                <View style={[styles.barraFill, { width: `${alturaPercent}%`, backgroundColor: statusColors.border }]} />
                <View style={styles.barraLimit} />
              </View>
              <View style={styles.barraLabels}>
                <Text style={styles.barraLabel}>0 cm</Text>
                <Text style={[styles.barraLabel, { color: COLORS.danger }]}>30 cm ← limite</Text>
                <Text style={styles.barraLabel}>35 cm</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Histórico das últimas coletas */}
        <Text style={styles.sectionTitle}>Histórico das últimas coletas</Text>
        <View style={styles.graficoCard}>
          <GraficoCrescimento historico={trecho.historico} limite={30} />
        </View>

        {/* Tabela do histórico */}
        <View style={styles.tabelaCard}>
          <View style={styles.tabelaHeader}>
            <Text style={styles.tabelaHeaderText}>Data</Text>
            <Text style={styles.tabelaHeaderText}>Altura</Text>
            <Text style={styles.tabelaHeaderText}>Status</Text>
          </View>
          {trecho.historico.map((h, i) => {
            const hColors = STATUS_COLORS[h.status];
            return (
              <View key={i} style={[styles.tabelaRow, i % 2 === 0 && styles.tabelaRowAlt]}>
                <Text style={styles.tabelaCelula}>{h.data.slice(5).replace('-', '/')}</Text>
                <Text style={[styles.tabelaCelula, { color: hColors.text, fontWeight: '700' }]}>{h.altura} cm</Text>
                <View style={[styles.tabelaChip, { backgroundColor: hColors.bg, borderColor: hColors.border }]}>
                  <Text style={[styles.tabelaChipText, { color: hColors.text }]}>
                    {h.status === 'normal' ? 'Normal' : h.status === 'atencao' ? 'Atenção' : 'Corte Nec.'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Detalhes do trecho */}
        <Text style={styles.sectionTitle}>Informações do trecho</Text>
        <View style={styles.detalhesGrid}>
          {[
            { icon: 'leaf-outline', label: 'Tipo de vegetação', val: LABEL_VEGETACAO[trecho.tipoVegetacao] },
            { icon: 'partly-sunny-outline', label: 'Condição climática', val: LABEL_CLIMA[trecho.clima.condicao] },
            { icon: 'thermometer-outline', label: 'Temperatura', val: `${trecho.clima.temperatura}°C` },
            { icon: 'speedometer-outline', label: 'Fator crescimento', val: `${trecho.clima.fatorCrescimento}×` },
            { icon: 'calendar-outline', label: 'Última coleta', val: trecho.ultimaColeta.slice(5).replace('-', '/') },
            { icon: 'location-outline', label: 'GPS', val: `${trecho.coordenadas.lat.toFixed(3)}, ${trecho.coordenadas.lng.toFixed(3)}` },
          ].map((item, i) => (
            <View key={i} style={styles.detalheItem}>
              <Ionicons name={item.icon as any} size={16} color={COLORS.primary} />
              <Text style={styles.detalheLabel}>{item.label}</Text>
              <Text style={styles.detalheVal}>{item.val}</Text>
            </View>
          ))}
        </View>

        {/* Clima */}
        <View style={styles.climaCard}>
          <Ionicons name="cloud-outline" size={16} color={COLORS.info} />
          <Text style={styles.climaDesc}>{trecho.clima.descricao}</Text>
        </View>

        {/* Observações */}
        {trecho.observacoes ? (
          <View style={styles.obsCard}>
            <View style={styles.obsHeader}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.info} />
              <Text style={styles.obsTitle}>Observações</Text>
            </View>
            <Text style={styles.obsText}>{trecho.observacoes}</Text>
          </View>
        ) : null}

        {/* Previsão */}
        <View style={[styles.previsaoCard, { backgroundColor: statusColors.bg, borderColor: statusColors.border }]}>
          <Ionicons name="calendar" size={18} color={statusColors.text} />
          <View>
            <Text style={[styles.previsaoLabel, { color: statusColors.text }]}>Data prevista para corte</Text>
            <Text style={[styles.previsaoVal, { color: statusColors.text }]}>{trecho.previsaoCorte}</Text>
          </View>
        </View>

        {/* Botões de ação */}
        <TouchableOpacity
          style={styles.btnPriorizar}
          onPress={() => navigation.navigate('Agendamento', { trechoId: trecho.id })}
          activeOpacity={0.85}
          disabled={trecho.programadoParaCorte}
        >
          <Ionicons
            name={trecho.programadoParaCorte ? 'checkmark-circle' : 'calendar-outline'}
            size={20}
            color={COLORS.white}
          />
          <Text style={styles.btnText}>
            {trecho.programadoParaCorte ? 'Já no cronograma' : 'Priorizar no cronograma'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnAcompanhar}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="eye-outline" size={18} color={COLORS.primary} />
          <Text style={styles.btnAcompanharText}>Acompanhar (voltar ao ranking)</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 6,
    paddingHorizontal: 16,
  },
  fotoCard: { marginBottom: 12 },
  fotoBg: {
    height: 200,
    backgroundColor: '#1A3A2A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    gap: 8,
  },
  fotoLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  fotoOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
  },
  fotoBadge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  fotoBadgeText: { color: COLORS.white, fontSize: 11 },
  infoCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  rodoviaBadge: {
    backgroundColor: COLORS.info,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  rodoviaBadgeText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
  nomeRodovia: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  infoKm: { fontSize: 13, color: COLORS.textSecondary },
  alturaSection: { gap: 10 },
  alturaRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  alturaLabel: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 2 },
  alturaValor: { fontSize: 28, fontWeight: '700', lineHeight: 32 },
  alturaCm: { fontSize: 16, fontWeight: '500' },
  limiteSep: { width: 1, height: 40, backgroundColor: COLORS.border },
  barraContainer: { gap: 6 },
  barraBg: {
    height: 10,
    backgroundColor: COLORS.grayLight,
    borderRadius: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  barraFill: { height: '100%', borderRadius: 5 },
  barraLimit: {
    position: 'absolute',
    right: `${(5 / 35) * 100}%`,
    top: -2,
    width: 2,
    height: 14,
    backgroundColor: COLORS.danger,
    borderRadius: 1,
  },
  barraLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  barraLabel: { fontSize: 10, color: COLORS.textSecondary },
  graficoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabelaCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tabelaHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  tabelaHeaderText: { flex: 1, color: COLORS.white, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  tabelaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  tabelaRowAlt: { backgroundColor: COLORS.background },
  tabelaCelula: { flex: 1, fontSize: 13, color: COLORS.text, textAlign: 'center' },
  tabelaChip: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 3,
    alignItems: 'center',
  },
  tabelaChipText: { fontSize: 10, fontWeight: '700' },
  detalhesGrid: {
    marginHorizontal: 16,
    marginBottom: 10,
    gap: 8,
  },
  detalheItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  detalheLabel: { fontSize: 12, color: COLORS.textSecondary, flex: 1 },
  detalheVal: { fontSize: 13, color: COLORS.text, fontWeight: '600' },
  climaCard: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: COLORS.infoBg,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.info + '30',
    alignItems: 'flex-start',
  },
  climaDesc: { flex: 1, fontSize: 13, color: COLORS.info, lineHeight: 18 },
  obsCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  obsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  obsTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary },
  obsText: { fontSize: 13, color: COLORS.text, lineHeight: 18 },
  previsaoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1.5,
  },
  previsaoLabel: { fontSize: 12, fontWeight: '600', marginBottom: 2 },
  previsaoVal: { fontSize: 16, fontWeight: '700' },
  btnPriorizar: {
    marginHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  btnAcompanhar: {
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
  },
  btnAcompanharText: { fontSize: 14, fontWeight: '600', color: COLORS.primary },
});
