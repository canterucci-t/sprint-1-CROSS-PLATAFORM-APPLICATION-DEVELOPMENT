import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, STATUS_COLORS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { RootStackParamList, Trecho } from '../types';
import { LABEL_VEGETACAO, RODOVIAS_DISPONIVEIS, getTrechosOrdenadosPorUrgencia } from '../data/mockData';
import StatusChip from '../components/StatusChip';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function RankingScreen() {
  const { trechos } = useApp();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [filtro, setFiltro] = useState('Todas');

  const trechosFiltrados = getTrechosOrdenadosPorUrgencia(
    filtro === 'Todas' ? trechos : trechos.filter((t) => t.rodovia === filtro)
  );

  const renderItem = ({ item, index }: { item: Trecho; index: number }) => {
    const colors = STATUS_COLORS[item.status];
    const urgente = item.diasAte30cm === 0;

    return (
      <TouchableOpacity
        style={[styles.card, urgente && styles.cardUrgente]}
        onPress={() => navigation.navigate('Detalhe', { trechoId: item.id })}
        activeOpacity={0.8}
      >
        {/* Position badge */}
        <View style={[styles.posicaoBadge, { backgroundColor: colors.border }]}>
          <Text style={styles.posicaoText}>{index + 1}</Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.rodoviaBadge}>
              <Text style={styles.rodoviaBadgeText}>{item.rodovia}</Text>
            </View>
            <Text style={styles.kmText}>
              km {item.kmInicial}–{item.kmFinal} · {item.sentido}
            </Text>
            <StatusChip status={item.status} small />
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={[styles.metricVal, { color: colors.text }]}>{item.alturaAtual} cm</Text>
              <Text style={styles.metricLabel}>Altura</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <Text style={[styles.metricVal, { color: COLORS.danger, fontSize: 14 }]}>
                {urgente ? 'IMEDIATO' : `${item.diasAte30cm}d`}
              </Text>
              <Text style={styles.metricLabel}>Para corte</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <Text style={styles.metricVal}>{LABEL_VEGETACAO[item.tipoVegetacao]}</Text>
              <Text style={styles.metricLabel}>Vegetação</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min((item.alturaAtual / 30) * 100, 100)}%`,
                  backgroundColor: colors.border,
                },
              ]}
            />
          </View>

          {item.observacoes ? (
            <View style={styles.obsRow}>
              <Ionicons name="information-circle-outline" size={13} color={COLORS.info} />
              <Text style={styles.obsText} numberOfLines={1}>{item.observacoes}</Text>
            </View>
          ) : null}
        </View>

        <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="podium" size={20} color={COLORS.white} />
          <View>
            <Text style={styles.headerTitle}>Ranking de Prioridades</Text>
            <Text style={styles.headerSub}>Ordenado por urgência de corte</Text>
          </View>
        </View>
      </View>

      {/* Filtros */}
      <View style={styles.filtrosWrapper}>
        <FlatList
          horizontal
          data={RODOVIAS_DISPONIVEIS}
          keyExtractor={(r) => r}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtros}
          renderItem={({ item: r }) => (
            <TouchableOpacity
              style={[styles.filtroChip, filtro === r && styles.filtroChipActive]}
              onPress={() => setFiltro(r)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filtroText, filtro === r && styles.filtroTextActive]}>{r}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Sumário */}
      <View style={styles.sumario}>
        <View style={styles.sumarioItem}>
          <Text style={[styles.sumarioVal, { color: COLORS.danger }]}>
            {trechosFiltrados.filter((t) => t.status === 'corte_necessario').length}
          </Text>
          <Text style={styles.sumarioLabel}>Corte necessário</Text>
        </View>
        <View style={styles.sumarioItem}>
          <Text style={[styles.sumarioVal, { color: '#7B5800' }]}>
            {trechosFiltrados.filter((t) => t.status === 'atencao').length}
          </Text>
          <Text style={styles.sumarioLabel}>Em atenção</Text>
        </View>
        <View style={styles.sumarioItem}>
          <Text style={[styles.sumarioVal, { color: COLORS.primary }]}>
            {trechosFiltrados.filter((t) => t.status === 'normal').length}
          </Text>
          <Text style={styles.sumarioLabel}>Normal</Text>
        </View>
        <View style={styles.sumarioItem}>
          <Text style={[styles.sumarioVal, { color: COLORS.text }]}>{trechosFiltrados.length}</Text>
          <Text style={styles.sumarioLabel}>Total</Text>
        </View>
      </View>

      <FlatList
        data={trechosFiltrados}
        keyExtractor={(t) => t.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="podium-outline" size={48} color={COLORS.gray} />
            <Text style={styles.emptyText}>Nenhum trecho encontrado.</Text>
          </View>
        }
      />
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
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerTitle: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 1 },
  filtrosWrapper: {
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
  filtroChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filtroText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  filtroTextActive: { color: COLORS.white },
  sumario: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 4,
  },
  sumarioItem: { flex: 1, alignItems: 'center' },
  sumarioVal: { fontSize: 18, fontWeight: '700' },
  sumarioLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2, textAlign: 'center' },
  list: { padding: 12, paddingBottom: 24 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  cardUrgente: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  posicaoBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  posicaoText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
  cardContent: { flex: 1, gap: 6 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  rodoviaBadge: {
    backgroundColor: COLORS.info,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  rodoviaBadgeText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
  kmText: { fontSize: 13, fontWeight: '600', color: COLORS.text, flex: 1 },
  metricsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metric: { flex: 1, alignItems: 'center' },
  metricVal: { fontSize: 15, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  metricLabel: { fontSize: 10, color: COLORS.textSecondary, textAlign: 'center' },
  metricDivider: { width: 1, height: 28, backgroundColor: COLORS.border },
  progressBg: { height: 4, backgroundColor: COLORS.grayLight, borderRadius: 2 },
  progressFill: { height: '100%', borderRadius: 2 },
  obsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  obsText: { fontSize: 11, color: COLORS.info, flex: 1 },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 48, gap: 12 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary },
});
