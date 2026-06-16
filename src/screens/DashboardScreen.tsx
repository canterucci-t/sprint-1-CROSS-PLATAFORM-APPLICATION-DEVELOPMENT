import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../types';
import { LABEL_ALERTA, getTrechosOrdenadosPorUrgencia } from '../data/mockData';
import IndicadorCard from '../components/IndicadorCard';
import StatusChip from '../components/StatusChip';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function DashboardScreen() {
  const { usuario, trechos, coletas, alertas, marcarAlertaLido } = useApp();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const [refreshing, setRefreshing] = React.useState(false);

  const alertasNaoLidos = alertas.filter((a) => !a.lido);
  const trechosCorte = trechos.filter((t) => t.status === 'corte_necessario').length;
  const trechosAtencao = trechos.filter((t) => t.status === 'atencao').length;
  const coletaAtual = coletas.find((c) => c.status === 'em_andamento') ?? coletas[0];
  const trechoMaisUrgente = getTrechosOrdenadosPorUrgencia(trechos)[0];
  const cortesNaSemana = trechos.filter((t) => t.diasAte30cm <= 7).length;

  const perfisLabel: Record<string, string> = {
    supervisor: 'Supervisor',
    operador: 'Operador',
    gestor: 'Gestor',
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoMark}>
            <Ionicons name="leaf" size={18} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.greeting}>
              Olá, {usuario?.nome?.split(' ')[0]} 👋
            </Text>
            <Text style={styles.perfilLabel}>
              {perfisLabel[usuario?.perfil ?? '']} · Ciclo 12/2026
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.alertaBell}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.white} />
          {alertasNaoLidos.length > 0 && (
            <View style={styles.badgeNotif}>
              <Text style={styles.badgeNotifText}>{alertasNaoLidos.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {/* Indicadores */}
        <Text style={styles.sectionTitle}>Situação operacional</Text>
        <IndicadorCard
          titulo="Cobertura da última coleta"
          valor={`${coletaAtual.coberturaPercent}%`}
          subtitulo={`${coletaAtual.rodovia} — Ciclo ${coletaAtual.ciclo}/${coletaAtual.anoMes}`}
          icone="radio-outline"
          cor={COLORS.primary}
          corFundo={COLORS.primaryBg}
        />
        <IndicadorCard
          titulo="Trechos acima de 30 cm"
          valor={trechosCorte}
          subtitulo="Corte imediato necessário"
          icone="warning-outline"
          cor={COLORS.danger}
          corFundo={COLORS.dangerBg}
        />
        <IndicadorCard
          titulo="Trechos em atenção"
          valor={trechosAtencao}
          subtitulo="Próximos ao limite de 30 cm"
          icone="alert-circle-outline"
          cor={COLORS.warning}
          corFundo={COLORS.warningBg}
        />
        <IndicadorCard
          titulo="Cortes previstos esta semana"
          valor={cortesNaSemana}
          subtitulo="Trechos com previsão ≤ 7 dias"
          icone="cut-outline"
          cor={COLORS.info}
          corFundo={COLORS.infoBg}
        />

        {/* Ciclo quinzenal */}
        <View style={styles.cicloCard}>
          <Ionicons name="time-outline" size={18} color={COLORS.primary} />
          <Text style={styles.cicloText}>
            Vistoria quinzenal · Ciclo 12 · Próxima em{' '}
            <Text style={{ fontWeight: '700' }}>8 dias</Text>
          </Text>
        </View>

        {/* Trecho crítico */}
        {trechoMaisUrgente && (
          <View style={styles.criticoCard}>
            <View style={styles.criticoHeader}>
              <Text style={styles.criticoLabel}>Próximo trecho crítico</Text>
              <StatusChip status={trechoMaisUrgente.status} small />
            </View>
            <Text style={styles.criticoRodovia}>
              {trechoMaisUrgente.rodovia} — km {trechoMaisUrgente.kmInicial}–{trechoMaisUrgente.kmFinal} {trechoMaisUrgente.sentido}
            </Text>
            <View style={styles.criticoMetrics}>
              <View style={styles.metric}>
                <Text style={styles.metricVal}>{trechoMaisUrgente.alturaAtual} cm</Text>
                <Text style={styles.metricLabel}>Altura atual</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metric}>
                <Text style={[styles.metricVal, { color: COLORS.danger }]}>30 cm</Text>
                <Text style={styles.metricLabel}>Limite</Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metric}>
                <Text style={[styles.metricVal, { color: COLORS.danger }]}>
                  {trechoMaisUrgente.previsaoCorte === 'Imediato' ? 'Imediato' : trechoMaisUrgente.previsaoCorte.slice(5).replace('-', '/')}
                </Text>
                <Text style={styles.metricLabel}>Corte</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.btnDetalhe}
              onPress={() => navigation.navigate('Detalhe', { trechoId: trechoMaisUrgente.id })}
              activeOpacity={0.8}
            >
              <Text style={styles.btnDetalheText}>Ver detalhe completo</Text>
              <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Coleta atual */}
        <TouchableOpacity
          style={styles.btnColeta}
          onPress={() => navigation.navigate('Coleta', { coletaId: coletaAtual.id })}
          activeOpacity={0.85}
        >
          <Ionicons name="car-sport-outline" size={20} color={COLORS.white} />
          <View style={{ flex: 1 }}>
            <Text style={styles.btnColetaTitle}>Ver coleta atual</Text>
            <Text style={styles.btnColetaSub}>
              {coletaAtual.rodovia} · {coletaAtual.coberturaPercent}% cobertura
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.white} />
        </TouchableOpacity>

        {/* Alertas recentes */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Alertas recentes</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {alertas.slice(0, 4).map((alerta) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            limite_atingido: 'warning',
            previsao_critica: 'alert-circle',
            reincidencia: 'repeat',
          };
          const colorMap: Record<string, string> = {
            limite_atingido: COLORS.danger,
            previsao_critica: COLORS.warning,
            reincidencia: COLORS.info,
          };
          return (
            <TouchableOpacity
              key={alerta.id}
              style={[styles.alertaItem, alerta.lido && styles.alertaLido]}
              onPress={() => {
                marcarAlertaLido(alerta.id);
                navigation.navigate('Detalhe', { trechoId: alerta.trechoId });
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.alertaIcon, { backgroundColor: colorMap[alerta.tipo] + '20' }]}>
                <Ionicons name={iconMap[alerta.tipo]} size={16} color={colorMap[alerta.tipo]} />
              </View>
              <View style={styles.alertaContent}>
                <Text style={styles.alertaTipo}>{LABEL_ALERTA[alerta.tipo]}</Text>
                <Text style={styles.alertaMensagem} numberOfLines={2}>{alerta.mensagem}</Text>
              </View>
              {!alerta.lido && <View style={styles.dotNaoLido} />}
            </TouchableOpacity>
          );
        })}

        {/* Relatórios */}
        <TouchableOpacity
          style={styles.btnRelatorios}
          onPress={() => navigation.navigate('Relatorios')}
          activeOpacity={0.8}
        >
          <Ionicons name="bar-chart-outline" size={18} color={COLORS.info} />
          <Text style={styles.btnRelatoriosText}>Acessar relatórios gerenciais</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.info} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  perfilLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 1,
  },
  alertaBell: {
    position: 'relative',
    padding: 4,
  },
  badgeNotif: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeNotifText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
  },
  sectionLink: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  cicloCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primaryBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryLight + '40',
  },
  cicloText: {
    fontSize: 13,
    color: COLORS.primary,
    flex: 1,
  },
  criticoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  criticoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  criticoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  criticoRodovia: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  criticoMetrics: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  metricLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  btnDetalhe: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
    backgroundColor: COLORS.primaryBg,
    borderRadius: 8,
    paddingVertical: 8,
  },
  btnDetalheText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  btnColeta: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnColetaTitle: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  btnColetaSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 1,
  },
  alertaItem: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  alertaLido: {
    opacity: 0.6,
  },
  alertaIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertaContent: {
    flex: 1,
  },
  alertaTipo: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  alertaMensagem: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 17,
  },
  dotNaoLido: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
  },
  btnRelatorios: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: COLORS.info,
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
    backgroundColor: COLORS.infoBg,
  },
  btnRelatoriosText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.info,
  },
});
