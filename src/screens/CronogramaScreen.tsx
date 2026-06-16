import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, STATUS_COLORS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { RootStackParamList, CronogramaItem, Trecho } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DIAS = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta'];
const DIAS_LABELS: Record<string, string> = {
  Segunda: 'Seg',
  Terca: 'Ter',
  Quarta: 'Qua',
  Quinta: 'Qui',
  Sexta: 'Sex',
};
const DATAS: Record<string, string> = {
  Segunda: '16/06',
  Terca: '17/06',
  Quarta: '18/06',
  Quinta: '19/06',
  Sexta: '20/06',
};

export default function CronogramaScreen() {
  const { cronograma, getTrechoById } = useApp();
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [diaAtivo, setDiaAtivo] = useState('Segunda');

  const totalCortes = cronograma.length;
  const cortesConcluidos = cronograma.filter((c) => c.status === 'concluido').length;

  const getItemsForDia = (dia: string): CronogramaItem[] =>
    cronograma.filter((c) => c.diaSemana === dia);

  const equipes = ['Equipe A', 'Equipe B', 'Equipe C'];
  const getEquipeItems = (dia: string, equipe: string): CronogramaItem[] =>
    getItemsForDia(dia).filter((c) => c.equipe === equipe);

  const cargaEquipe = (equipe: string): number =>
    cronograma.filter((c) => c.equipe === equipe).length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="calendar" size={20} color={COLORS.white} />
          <View>
            <Text style={styles.headerTitle}>Cronograma Semanal</Text>
            <Text style={styles.headerSub}>Semana 16–20/06/2026</Text>
          </View>
        </View>
      </View>

      {/* Indicadores */}
      <View style={styles.indicadores}>
        <View style={styles.indicador}>
          <Text style={[styles.indicadorVal, { color: COLORS.primary }]}>{totalCortes}</Text>
          <Text style={styles.indicadorLabel}>Cortes planejados</Text>
        </View>
        <View style={styles.indicadorDivider} />
        <View style={styles.indicador}>
          <Text style={[styles.indicadorVal, { color: COLORS.primaryLight }]}>{cortesConcluidos}</Text>
          <Text style={styles.indicadorLabel}>Concluídos</Text>
        </View>
        <View style={styles.indicadorDivider} />
        <View style={styles.indicador}>
          <Text style={[styles.indicadorVal, { color: COLORS.info }]}>3</Text>
          <Text style={styles.indicadorLabel}>Equipes ativas</Text>
        </View>
      </View>

      {/* Dias da semana */}
      <View style={styles.diasContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dias}>
          {DIAS.map((dia) => {
            const items = getItemsForDia(dia);
            const isActive = diaAtivo === dia;
            const temUrgente = items.some((c) => {
              const t = getTrechoById(c.trechoId);
              return t?.status === 'corte_necessario';
            });
            return (
              <TouchableOpacity
                key={dia}
                style={[styles.diaTab, isActive && styles.diaTabActive]}
                onPress={() => setDiaAtivo(dia)}
                activeOpacity={0.8}
              >
                <Text style={[styles.diaSigla, isActive && styles.diaSiglaActive]}>{DIAS_LABELS[dia]}</Text>
                <Text style={[styles.diaDataLabel, isActive && styles.diaDataLabelActive]}>{DATAS[dia]}</Text>
                {items.length > 0 && (
                  <View style={[styles.diaBadge, { backgroundColor: temUrgente ? COLORS.danger : COLORS.primaryLight }]}>
                    <Text style={styles.diaBadgeText}>{items.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {equipes.map((equipe) => {
          const items = getEquipeItems(diaAtivo, equipe);
          const carga = cargaEquipe(equipe);
          const lotada = carga >= 3;

          return (
            <View key={equipe} style={styles.equipeBloco}>
              {/* Header da equipe */}
              <View style={[styles.equipeBlocoHeader, { borderLeftColor: lotada ? COLORS.danger : COLORS.primaryLight }]}>
                <View style={styles.equipeBlocoLeft}>
                  <Ionicons name="people" size={16} color={COLORS.primary} />
                  <Text style={styles.equipeNome}>{equipe}</Text>
                </View>
                <View style={styles.cargaInfo}>
                  <View style={styles.cargaBar}>
                    {[1, 2, 3].map((i) => (
                      <View key={i} style={[styles.cargaSeg, {
                        backgroundColor: i <= carga ? (lotada ? COLORS.danger : COLORS.primaryLight) : COLORS.grayLight
                      }]} />
                    ))}
                  </View>
                  <Text style={[styles.cargaText, lotada && { color: COLORS.danger }]}>
                    {carga}/3{lotada ? ' Lotada' : ''}
                  </Text>
                </View>
              </View>

              {/* Items do dia */}
              {items.length === 0 ? (
                <View style={styles.vazio}>
                  <Text style={styles.vazioText}>Sem cortes neste dia</Text>
                </View>
              ) : (
                items.map((item) => {
                  const trecho: Trecho | undefined = getTrechoById(item.trechoId);
                  if (!trecho) return null;
                  const statusColors = STATUS_COLORS[trecho.status];
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[styles.itemCard, trecho.status === 'corte_necessario' && styles.itemCardUrgente]}
                      onPress={() => navigation.navigate('Detalhe', { trechoId: trecho.id })}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.itemPrior, { backgroundColor: statusColors.border }]}>
                        <Text style={styles.itemPriorText}>{item.prioridade}</Text>
                      </View>
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemRodovia}>
                          {trecho.rodovia} · km {trecho.kmInicial}–{trecho.kmFinal} {trecho.sentido}
                        </Text>
                        <View style={styles.itemMetrics}>
                          <Text style={[styles.itemAltura, { color: statusColors.text }]}>
                            {trecho.alturaAtual} cm
                          </Text>
                          <Text style={styles.itemDot}>·</Text>
                          <Text style={styles.itemPrevisao}>
                            {trecho.previsaoCorte === 'Imediato' ? 'Corte imediato' : `Corte: ${trecho.previsaoCorte.slice(5).replace('-', '/')}`}
                          </Text>
                        </View>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          );
        })}

        {getItemsForDia(diaAtivo).length === 0 && (
          <View style={styles.diaVazio}>
            <Ionicons name="calendar-outline" size={40} color={COLORS.gray} />
            <Text style={styles.diaVazioText}>Nenhum corte planejado para {DIAS_LABELS[diaAtivo]}</Text>
          </View>
        )}
      </ScrollView>
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
  indicadores: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  indicador: { flex: 1, alignItems: 'center' },
  indicadorVal: { fontSize: 22, fontWeight: '700' },
  indicadorLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2, textAlign: 'center' },
  indicadorDivider: { width: 1, backgroundColor: COLORS.border, marginVertical: 4 },
  diasContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dias: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  diaTab: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    position: 'relative',
    minWidth: 60,
    backgroundColor: COLORS.background,
  },
  diaTabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  diaSigla: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  diaSiglaActive: { color: COLORS.white },
  diaDataLabel: { fontSize: 11, color: COLORS.gray, marginTop: 2 },
  diaDataLabelActive: { color: 'rgba(255,255,255,0.8)' },
  diaBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diaBadgeText: { color: COLORS.white, fontSize: 9, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { padding: 12, paddingBottom: 24, gap: 10 },
  equipeBloco: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  equipeBlocoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderLeftWidth: 3,
    backgroundColor: COLORS.grayLight,
  },
  equipeBlocoLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  equipeNome: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  cargaInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cargaBar: { flexDirection: 'row', gap: 3 },
  cargaSeg: { width: 10, height: 10, borderRadius: 5 },
  cargaText: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },
  vazio: { padding: 14, alignItems: 'center' },
  vazioText: { fontSize: 12, color: COLORS.gray },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  itemCardUrgente: { backgroundColor: COLORS.dangerBg },
  itemPrior: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  itemPriorText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
  itemInfo: { flex: 1 },
  itemRodovia: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  itemMetrics: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemAltura: { fontSize: 13, fontWeight: '700' },
  itemDot: { color: COLORS.gray },
  itemPrevisao: { fontSize: 12, color: COLORS.textSecondary },
  diaVazio: { alignItems: 'center', padding: 40, gap: 10 },
  diaVazioText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
});
