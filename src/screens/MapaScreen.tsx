import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, STATUS_COLORS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { RootStackParamList, Trecho } from '../types';
import { RODOVIAS_DISPONIVEIS } from '../data/mockData';
import StatusChip from '../components/StatusChip';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const STATUS_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  normal: 'checkmark-circle',
  atencao: 'alert-circle',
  corte_necessario: 'warning',
};

export default function MapaScreen() {
  const { trechos } = useApp();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [filtro, setFiltro] = useState('Todas');
  const [trechoSelecionado, setTrechoSelecionado] = useState<Trecho | null>(null);

  const rodovias = RODOVIAS_DISPONIVEIS;
  const trechosFiltrados = filtro === 'Todas' ? trechos : trechos.filter((t) => t.rodovia === filtro);

  const trechosPorRodovia = rodovias
    .filter((r) => r !== 'Todas')
    .map((rodovia) => ({
      rodovia,
      trechos: trechosFiltrados.filter((t) => t.rodovia === rodovia),
    }))
    .filter((r) => r.trechos.length > 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="map" size={20} color={COLORS.white} />
          <View>
            <Text style={styles.headerTitle}>Mapa de Trechos</Text>
            <Text style={styles.headerSub}>{trechosFiltrados.length} trechos monitorados</Text>
          </View>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtros}>
          {rodovias.map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.filtroChip, filtro === r && styles.filtroChipActive]}
              onPress={() => {
                setFiltro(r);
                setTrechoSelecionado(null);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.filtroText, filtro === r && styles.filtroTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Legenda */}
      <View style={styles.legenda}>
        {[
          { label: 'Normal', status: 'normal' },
          { label: 'Atenção', status: 'atencao' },
          { label: 'Corte Necessário', status: 'corte_necessario' },
        ].map((l) => (
          <View key={l.status} style={styles.legendaItem}>
            <View style={[styles.legendaDot, { backgroundColor: STATUS_COLORS[l.status].border }]} />
            <Text style={styles.legendaText}>{l.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mapa visual por rodovia */}
        {trechosPorRodovia.map(({ rodovia, trechos: ts }) => (
          <View key={rodovia} style={styles.rodoviaBlocoContainer}>
            <View style={styles.rodoviaBlocoHeader}>
              <View style={styles.rodoviaBlocoInfo}>
                <View style={styles.rodoviaBadge}>
                  <Text style={styles.rodoviaBadgeText}>{rodovia}</Text>
                </View>
                <Text style={styles.rodoviaNome}>{ts[0]?.nomeRodovia}</Text>
              </View>
              <Text style={styles.trechoCount}>{ts.length} trechos</Text>
            </View>

            {/* Visual highway representation */}
            <View style={styles.highwayContainer}>
              <View style={styles.highwayLine} />
              <View style={styles.highwayDots}>
                {ts.map((t, idx) => {
                  const colors = STATUS_COLORS[t.status];
                  const isSelected = trechoSelecionado?.id === t.id;
                  return (
                    <TouchableOpacity
                      key={t.id}
                      style={[
                        styles.trechoDot,
                        {
                          backgroundColor: colors.border,
                          borderColor: isSelected ? COLORS.text : 'transparent',
                          borderWidth: isSelected ? 3 : 0,
                        },
                      ]}
                      onPress={() => setTrechoSelecionado(isSelected ? null : t)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name={STATUS_ICONS[t.status]} size={16} color={COLORS.white} />
                    </TouchableOpacity>
                  );
                })}
              </View>
              {/* KM labels */}
              <View style={styles.kmLabels}>
                {ts.map((t) => (
                  <Text key={t.id} style={styles.kmLabel}>
                    {t.kmInicial}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        ))}

        {trechosFiltrados.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="map-outline" size={48} color={COLORS.gray} />
            <Text style={styles.emptyText}>Nenhum trecho encontrado para este filtro.</Text>
          </View>
        )}
      </ScrollView>

      {/* Card do trecho selecionado */}
      {trechoSelecionado && (
        <View style={styles.trechoCardOverlay}>
          <View style={styles.trechoCardHeader}>
            <View>
              <View style={styles.trechoCardRodoviaBadge}>
                <Text style={styles.trechoCardRodoviaText}>{trechoSelecionado.rodovia}</Text>
              </View>
              <Text style={styles.trechoCardKm}>
                km {trechoSelecionado.kmInicial}–{trechoSelecionado.kmFinal} · {trechoSelecionado.sentido}
              </Text>
            </View>
            <View style={styles.trechoCardRight}>
              <StatusChip status={trechoSelecionado.status} small />
              <TouchableOpacity onPress={() => setTrechoSelecionado(null)}>
                <Ionicons name="close-circle" size={22} color={COLORS.gray} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.trechoCardMetrics}>
            <View style={styles.trechoCardMetric}>
              <Text style={styles.trechoCardMetricVal}>{trechoSelecionado.alturaAtual} cm</Text>
              <Text style={styles.trechoCardMetricLabel}>Altura atual</Text>
            </View>
            <View style={styles.trechoCardMetric}>
              <Text style={[styles.trechoCardMetricVal, { color: STATUS_COLORS[trechoSelecionado.status].text }]}>
                {trechoSelecionado.diasAte30cm === 0 ? 'Imediato' : `${trechoSelecionado.diasAte30cm} dias`}
              </Text>
              <Text style={styles.trechoCardMetricLabel}>Para corte</Text>
            </View>
            <View style={styles.trechoCardMetric}>
              <Text style={styles.trechoCardMetricVal}>{trechoSelecionado.ultimaColeta.slice(5).replace('-', '/')}</Text>
              <Text style={styles.trechoCardMetricLabel}>Última coleta</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.btnVerDetalhe}
            onPress={() => {
              setTrechoSelecionado(null);
              navigation.navigate('Detalhe', { trechoId: trechoSelecionado.id });
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.btnVerDetalheText}>Ver detalhe completo</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 1 },
  filtrosContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filtros: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  filtroChip: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: COLORS.background,
  },
  filtroChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filtroText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  filtroTextActive: { color: COLORS.white },
  legenda: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  legendaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendaDot: { width: 10, height: 10, borderRadius: 5 },
  legendaText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' },
  scroll: { flex: 1 },
  scrollContent: { padding: 14, paddingBottom: 24 },
  rodoviaBlocoContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  rodoviaBlocoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  rodoviaBlocoInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rodoviaBadge: {
    backgroundColor: COLORS.info,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rodoviaBadgeText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  rodoviaNome: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  trechoCount: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
  highwayContainer: {
    position: 'relative',
    paddingVertical: 8,
  },
  highwayLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: '50%',
    height: 4,
    backgroundColor: COLORS.grayLight,
    borderRadius: 2,
    marginTop: -6,
  },
  highwayDots: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 4,
    zIndex: 1,
  },
  trechoDot: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  kmLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 4,
  },
  kmLabel: { fontSize: 10, color: COLORS.textSecondary, width: 38, textAlign: 'center' },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 48, gap: 12 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  trechoCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
  },
  trechoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  trechoCardRodoviaBadge: {
    backgroundColor: COLORS.info,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  trechoCardRodoviaText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
  trechoCardKm: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  trechoCardRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  trechoCardMetrics: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  trechoCardMetric: { flex: 1, alignItems: 'center' },
  trechoCardMetricVal: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  trechoCardMetricLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  btnVerDetalhe: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnVerDetalheText: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
});
