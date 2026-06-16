import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, STATUS_COLORS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../types';
import ScreenHeader from '../components/ScreenHeader';
import StatusChip from '../components/StatusChip';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function RelatoriosScreen() {
  const navigation = useNavigation<Nav>();
  const { trechos, coletas, alertas } = useApp();

  const trechosCorte = trechos.filter((t) => t.status === 'corte_necessario').length;
  const trechosAtencao = trechos.filter((t) => t.status === 'atencao').length;
  const trechosNormal = trechos.filter((t) => t.status === 'normal').length;
  const totalAlertas = alertas.length;
  const alertasNaoLidos = alertas.filter((a) => !a.lido).length;
  const coletaMedia = Math.round(coletas.reduce((acc, c) => acc + c.coberturaPercent, 0) / coletas.length);

  const trechosReincidentes = trechos.filter((t) => t.observacoes?.includes('Reincid'));

  // Simulated weekly averages
  const semanasAltura = [
    { semana: '02/05', media: 10.8 },
    { semana: '16/05', media: 15.2 },
    { semana: '30/05', media: 19.6 },
    { semana: '13/06', media: 24.8 },
  ];
  const maxMedia = Math.max(...semanasAltura.map((s) => s.media));

  return (
    <View style={styles.container}>
      <ScreenHeader
        titulo="Relatórios Gerenciais"
        subtitulo="Ciclo 12 · Junho 2026"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cobertura de vistoria */}
        <Text style={styles.sectionTitle}>Cobertura de vistoria — Ciclo 12</Text>
        <View style={styles.coletasCard}>
          {coletas.map((c) => (
            <View key={c.id} style={styles.coletaRow}>
              <View style={styles.coletaRodo}>
                <View style={styles.rodoviaBadge}>
                  <Text style={styles.rodoviaBadgeText}>{c.rodovia}</Text>
                </View>
                <View>
                  <Text style={styles.coletaKm}>km {c.kmInicial}–{c.kmFinal}</Text>
                  <Text style={styles.coletaStatus}>
                    {c.status === 'concluida' ? 'Concluída' : 'Em andamento'} · {c.operador}
                  </Text>
                </View>
              </View>
              <View style={styles.coletaCoberturaArea}>
                <Text style={[styles.coletaCobertura, { color: c.coberturaPercent >= 85 ? COLORS.primary : COLORS.warning }]}>
                  {c.coberturaPercent}%
                </Text>
                <View style={styles.coletaProgressBg}>
                  <View style={[styles.coletaProgressFill, {
                    width: `${c.coberturaPercent}%`,
                    backgroundColor: c.coberturaPercent >= 85 ? COLORS.primary : COLORS.warning,
                  }]} />
                </View>
              </View>
            </View>
          ))}
          <View style={styles.coletaMedia}>
            <Text style={styles.coletaMediaLabel}>Cobertura média do ciclo</Text>
            <Text style={[styles.coletaMediaVal, { color: COLORS.primary }]}>{coletaMedia}%</Text>
          </View>
        </View>

        {/* Alertas gerados */}
        <Text style={styles.sectionTitle}>Alertas gerados</Text>
        <View style={styles.alertasGrid}>
          {[
            { label: 'Total gerados', val: totalAlertas, color: COLORS.text, icon: 'notifications-outline' },
            { label: 'Não lidos', val: alertasNaoLidos, color: COLORS.danger, icon: 'alert-circle-outline' },
            {
              label: 'Limite atingido',
              val: alertas.filter((a) => a.tipo === 'limite_atingido').length,
              color: COLORS.danger,
              icon: 'warning-outline',
            },
            {
              label: 'Reincidências',
              val: alertas.filter((a) => a.tipo === 'reincidencia').length,
              color: COLORS.info,
              icon: 'repeat-outline',
            },
          ].map((item, i) => (
            <View key={i} style={styles.alertaMetric}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
              <Text style={[styles.alertaMetricVal, { color: item.color }]}>{item.val}</Text>
              <Text style={styles.alertaMetricLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Distribuição por status */}
        <Text style={styles.sectionTitle}>Distribuição por status</Text>
        <View style={styles.statusCard}>
          {[
            { status: 'corte_necessario' as const, count: trechosCorte, label: 'Corte necessário' },
            { status: 'atencao' as const, count: trechosAtencao, label: 'Atenção' },
            { status: 'normal' as const, count: trechosNormal, label: 'Normal' },
          ].map((item) => {
            const pct = Math.round((item.count / trechos.length) * 100);
            const colors = STATUS_COLORS[item.status];
            return (
              <View key={item.status} style={styles.statusRow}>
                <StatusChip status={item.status} small />
                <View style={styles.statusBarWrapper}>
                  <View style={styles.statusBarBg}>
                    <View style={[styles.statusBarFill, { width: `${pct}%`, backgroundColor: colors.border }]} />
                  </View>
                </View>
                <Text style={styles.statusCount}>
                  {item.count} ({pct}%)
                </Text>
              </View>
            );
          })}
        </View>

        {/* Gráfico de altura média por semana */}
        <Text style={styles.sectionTitle}>Altura média geral por ciclo de coleta</Text>
        <View style={styles.graficoCard}>
          <View style={styles.graficoArea}>
            {semanasAltura.map((s, idx) => {
              const barH = (s.media / (maxMedia + 5)) * 100;
              const isLast = idx === semanasAltura.length - 1;
              const colorBar = s.media >= 20 ? COLORS.warning : COLORS.primaryLight;
              return (
                <View key={idx} style={styles.graficoBar}>
                  <Text style={styles.graficoBarVal}>{s.media.toFixed(1)}</Text>
                  <View style={styles.graficoBarBg}>
                    <View style={[styles.graficoBarFill, {
                      height: `${barH}%`,
                      backgroundColor: isLast ? COLORS.danger : colorBar,
                    }]} />
                  </View>
                  <Text style={styles.graficoBarLabel}>{s.semana}</Text>
                </View>
              );
            })}
          </View>
          <View style={styles.graficoLimiteLine}>
            <Text style={styles.graficoLimiteLabel}>← limite 30 cm</Text>
          </View>
        </View>

        {/* Trechos reincidentes */}
        {trechosReincidentes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Trechos com reincidência</Text>
            {trechosReincidentes.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={styles.reincidenteCard}
                onPress={() => navigation.navigate('Detalhe', { trechoId: t.id })}
                activeOpacity={0.8}
              >
                <View style={styles.reincidenteLeft}>
                  <Ionicons name="repeat-outline" size={18} color={COLORS.info} />
                  <View>
                    <Text style={styles.reincidenteRodovia}>{t.rodovia} km {t.kmInicial}–{t.kmFinal}</Text>
                    <Text style={styles.reincidenteObs} numberOfLines={1}>{t.observacoes}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Eficiência de alocação */}
        <Text style={styles.sectionTitle}>Eficiência de alocação de equipes</Text>
        <View style={styles.eficienciaCard}>
          {[
            { equipe: 'Equipe A', cortes: 2, rodovias: 'SP-280', eficiencia: 85 },
            { equipe: 'Equipe B', cortes: 2, rodovias: 'SP-160 / SP-348', eficiencia: 90 },
            { equipe: 'Equipe C', cortes: 1, rodovias: 'SP-330', eficiencia: 78 },
          ].map((item, i) => (
            <View key={i} style={[styles.equipeRow, i < 2 && styles.equipeRowBorder]}>
              <View>
                <Text style={styles.equipeNome}>{item.equipe}</Text>
                <Text style={styles.equipeInfo}>{item.cortes} corte{item.cortes !== 1 ? 's' : ''} · {item.rodovias}</Text>
              </View>
              <View style={styles.eficiencia}>
                <Text style={[styles.eficienciaVal, {
                  color: item.eficiencia >= 85 ? COLORS.primary : COLORS.warning
                }]}>{item.eficiencia}%</Text>
                <Text style={styles.eficienciaLabel}>eficiência</Text>
              </View>
            </View>
          ))}
        </View>
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
    marginTop: 6,
  },
  coletasCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  coletaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  coletaRodo: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  rodoviaBadge: {
    backgroundColor: COLORS.info,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rodoviaBadgeText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
  coletaKm: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  coletaStatus: { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },
  coletaCoberturaArea: { alignItems: 'flex-end', gap: 4 },
  coletaCobertura: { fontSize: 18, fontWeight: '700' },
  coletaProgressBg: { width: 80, height: 4, backgroundColor: COLORS.grayLight, borderRadius: 2 },
  coletaProgressFill: { height: '100%', borderRadius: 2 },
  coletaMedia: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.primaryBg,
  },
  coletaMediaLabel: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  coletaMediaVal: { fontSize: 20, fontWeight: '700' },
  alertasGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  alertaMetric: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  alertaMetricVal: { fontSize: 20, fontWeight: '700' },
  alertaMetricLabel: { fontSize: 9, color: COLORS.textSecondary, textAlign: 'center' },
  statusCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusBarWrapper: { flex: 1 },
  statusBarBg: { height: 8, backgroundColor: COLORS.grayLight, borderRadius: 4 },
  statusBarFill: { height: '100%', borderRadius: 4 },
  statusCount: { fontSize: 12, color: COLORS.textSecondary, width: 64, textAlign: 'right' },
  graficoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  graficoArea: {
    flexDirection: 'row',
    height: 120,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 24,
  },
  graficoBar: { alignItems: 'center', flex: 1 },
  graficoBarVal: { fontSize: 10, color: COLORS.textSecondary, marginBottom: 2 },
  graficoBarBg: {
    width: 32,
    height: 90,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.grayLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  graficoBarFill: { width: '100%', borderRadius: 4 },
  graficoBarLabel: { fontSize: 10, color: COLORS.textSecondary, position: 'absolute', bottom: 0 },
  graficoLimiteLine: {
    borderTopWidth: 1,
    borderTopColor: COLORS.danger,
    borderStyle: 'dashed',
    paddingTop: 4,
  },
  graficoLimiteLabel: { fontSize: 10, color: COLORS.danger, fontWeight: '500' },
  reincidenteCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.info + '40',
  },
  reincidenteLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  reincidenteRodovia: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  reincidenteObs: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
  eficienciaCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  equipeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  equipeRowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  equipeNome: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  equipeInfo: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  eficiencia: { alignItems: 'flex-end' },
  eficienciaVal: { fontSize: 20, fontWeight: '700' },
  eficienciaLabel: { fontSize: 11, color: COLORS.textSecondary },
});
