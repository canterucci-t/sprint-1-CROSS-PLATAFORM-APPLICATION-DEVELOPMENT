import React, { useState } from 'react';
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
import { LABEL_VEGETACAO } from '../data/mockData';
import ScreenHeader from '../components/ScreenHeader';
import StatusChip from '../components/StatusChip';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Agendamento'>;

const EQUIPES = ['Equipe A', 'Equipe B', 'Equipe C'];

const DIAS_SEMANA = [
  { dia: 'Segunda', data: '2026-06-16' },
  { dia: 'Terca', data: '2026-06-17' },
  { dia: 'Quarta', data: '2026-06-18' },
  { dia: 'Quinta', data: '2026-06-19' },
  { dia: 'Sexta', data: '2026-06-20' },
];

const CARGA_EQUIPES: Record<string, number> = {
  'Equipe A': 2,
  'Equipe B': 1,
  'Equipe C': 1,
};

export default function AgendamentoScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { getTrechoById, adicionarAoCronograma, marcarTrechoProgramado, cronograma } = useApp();
  const trecho = getTrechoById(route.params.trechoId);

  const [equipe, setEquipe] = useState('Equipe A');
  const [diaSelecionado, setDiaSelecionado] = useState(DIAS_SEMANA[0]);

  if (!trecho) {
    return (
      <View style={styles.container}>
        <ScreenHeader titulo="Agendar Corte" onBack={() => navigation.goBack()} />
        <Text style={{ padding: 24, color: COLORS.text }}>Trecho não encontrado.</Text>
      </View>
    );
  }

  const statusColors = STATUS_COLORS[trecho.status];
  const jaAgendado = cronograma.some((c) => c.trechoId === trecho.id);

  const handleConfirmar = () => {
    adicionarAoCronograma(trecho.id, equipe, diaSelecionado.data, diaSelecionado.dia);
    marcarTrechoProgramado(trecho.id);
    navigation.navigate('Confirmacao', {
      trechoId: trecho.id,
      equipe,
      dataPlaneada: diaSelecionado.data,
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        titulo="Agendar no Cronograma"
        subtitulo={`${trecho.rodovia} km ${trecho.kmInicial}–${trecho.kmFinal}`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Resumo do trecho */}
        <View style={[styles.trechoCard, { borderLeftColor: statusColors.border }]}>
          <View style={styles.trechoHeader}>
            <View>
              <View style={styles.rodoviaBadge}>
                <Text style={styles.rodoviaBadgeText}>{trecho.rodovia}</Text>
              </View>
              <Text style={styles.trechoKm}>km {trecho.kmInicial}–{trecho.kmFinal} · {trecho.sentido}</Text>
            </View>
            <StatusChip status={trecho.status} />
          </View>
          <View style={styles.trechoMetrics}>
            <View style={styles.metric}>
              <Text style={[styles.metricVal, { color: statusColors.text }]}>{trecho.alturaAtual} cm</Text>
              <Text style={styles.metricLabel}>Altura atual</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <Text style={[styles.metricVal, { color: COLORS.danger }]}>30 cm</Text>
              <Text style={styles.metricLabel}>Limite</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <Text style={styles.metricVal}>{LABEL_VEGETACAO[trecho.tipoVegetacao]}</Text>
              <Text style={styles.metricLabel}>Vegetação</Text>
            </View>
          </View>
        </View>

        {/* Seleção de equipe */}
        <Text style={styles.sectionTitle}>Equipe de rocada/corte</Text>
        {EQUIPES.map((e) => {
          const carga = CARGA_EQUIPES[e] ?? 0;
          const lotada = carga >= 3;
          return (
            <TouchableOpacity
              key={e}
              style={[styles.equipeCard, equipe === e && styles.equipeCardSelected, lotada && styles.equipeCardLotada]}
              onPress={() => !lotada && setEquipe(e)}
              activeOpacity={0.8}
            >
              <Ionicons
                name="people-outline"
                size={22}
                color={equipe === e ? COLORS.white : lotada ? COLORS.gray : COLORS.primary}
              />
              <View style={styles.equipeInfo}>
                <Text style={[styles.equipeNome, equipe === e && styles.equipeNomeSelected, lotada && { color: COLORS.gray }]}>
                  {e}
                </Text>
                <Text style={[styles.equipeCarga, equipe === e && { color: 'rgba(255,255,255,0.8)' }]}>
                  {carga} corte{carga !== 1 ? 's' : ''} na semana{lotada ? ' · Lotada' : ''}
                </Text>
              </View>
              {equipe === e && !lotada && (
                <Ionicons name="checkmark-circle" size={22} color={COLORS.white} />
              )}
              {/* Carga bar */}
              <View style={styles.cargaBar}>
                {[1, 2, 3].map((i) => (
                  <View key={i} style={[styles.cargaSegment, { backgroundColor: i <= carga ? (lotada ? COLORS.danger : COLORS.warning) : COLORS.grayLight }]} />
                ))}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Seleção de dia */}
        <Text style={styles.sectionTitle}>Data de execução</Text>
        <View style={styles.diasGrid}>
          {DIAS_SEMANA.map((d) => {
            const isSelected = diaSelecionado.dia === d.dia;
            return (
              <TouchableOpacity
                key={d.dia}
                style={[styles.diaCard, isSelected && styles.diaCardSelected]}
                onPress={() => setDiaSelecionado(d)}
                activeOpacity={0.8}
              >
                <Text style={[styles.diaNome, isSelected && styles.diaNomeSelected]}>{d.dia}</Text>
                <Text style={[styles.diaData, isSelected && styles.diaDataSelected]}>
                  {d.data.slice(8)}/{d.data.slice(5, 7)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Resumo do agendamento */}
        <View style={styles.resumoCard}>
          <View style={styles.resumoHeader}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
            <Text style={styles.resumoTitulo}>Resumo do agendamento</Text>
          </View>
          {[
            { label: 'Trecho', val: `${trecho.rodovia} km ${trecho.kmInicial}–${trecho.kmFinal} ${trecho.sentido}` },
            { label: 'Altura atual', val: `${trecho.alturaAtual} cm (limite: 30 cm)` },
            { label: 'Equipe', val: equipe },
            { label: 'Data', val: `${diaSelecionado.dia}, ${diaSelecionado.data.slice(8)}/${diaSelecionado.data.slice(5, 7)}/2026` },
            { label: 'Prioridade', val: trecho.status === 'corte_necessario' ? 'Alta — Corte imediato' : 'Preventivo' },
          ].map((item, i) => (
            <View key={i} style={styles.resumoRow}>
              <Text style={styles.resumoLabel}>{item.label}</Text>
              <Text style={styles.resumoVal}>{item.val}</Text>
            </View>
          ))}
        </View>

        {/* Botão confirmar */}
        <TouchableOpacity
          style={[styles.btnConfirmar, jaAgendado && { backgroundColor: COLORS.gray }]}
          onPress={handleConfirmar}
          activeOpacity={0.85}
          disabled={jaAgendado}
        >
          <Ionicons name={jaAgendado ? 'checkmark-circle' : 'calendar'} size={20} color={COLORS.white} />
          <Text style={styles.btnText}>
            {jaAgendado ? 'Já agendado' : 'Confirmar agendamento'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 8,
  },
  trechoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  trechoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  rodoviaBadge: {
    backgroundColor: COLORS.info,
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  rodoviaBadgeText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
  trechoKm: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  trechoMetrics: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  metric: { flex: 1, alignItems: 'center' },
  metricVal: { fontSize: 16, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  metricLabel: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center', marginTop: 2 },
  metricDivider: { width: 1, height: 32, backgroundColor: COLORS.border },
  equipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 10,
  },
  equipeCardSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  equipeCardLotada: { opacity: 0.5 },
  equipeInfo: { flex: 1 },
  equipeNome: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  equipeNomeSelected: { color: COLORS.white },
  equipeCarga: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  cargaBar: { flexDirection: 'row', gap: 3 },
  cargaSegment: { width: 8, height: 8, borderRadius: 4 },
  diasGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  diaCard: {
    flex: 1,
    minWidth: 60,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  diaCardSelected: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primaryLight },
  diaNome: { fontSize: 12, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  diaNomeSelected: { color: COLORS.white },
  diaData: { fontSize: 11, color: COLORS.textSecondary, marginTop: 3, textAlign: 'center' },
  diaDataSelected: { color: 'rgba(255,255,255,0.85)' },
  resumoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.primaryLight + '50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  resumoHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  resumoTitulo: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  resumoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  resumoLabel: { fontSize: 12, color: COLORS.textSecondary },
  resumoVal: { fontSize: 13, color: COLORS.text, fontWeight: '600', flex: 1, textAlign: 'right' },
  btnConfirmar: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
});
