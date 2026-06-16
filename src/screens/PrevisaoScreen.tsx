import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import { COLORS, STATUS_COLORS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../types';
import { LABEL_VEGETACAO, LABEL_CLIMA } from '../data/mockData';
import ScreenHeader from '../components/ScreenHeader';
import StatusChip from '../components/StatusChip';
import GraficoCrescimento from '../components/GraficoCrescimento';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Previsao'>;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function PrevisaoScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { getTrechoById, alertas } = useApp();
  const trecho = getTrechoById(route.params.trechoId);
  const [alertaSalvo, setAlertaSalvo] = useState(false);

  if (!trecho) {
    return (
      <View style={styles.container}>
        <ScreenHeader titulo="Previsão" onBack={() => navigation.goBack()} />
        <Text style={{ padding: 24, color: COLORS.text }}>Trecho não encontrado.</Text>
      </View>
    );
  }

  const statusColors = STATUS_COLORS[trecho.status];

  const motivosPrevisao = [
    {
      icone: 'leaf-outline' as const,
      titulo: 'Tipo de vegetação',
      desc: `${LABEL_VEGETACAO[trecho.tipoVegetacao]} — taxa de crescimento ${
        trecho.tipoVegetacao === 'grama_densa' ? 'alta' : trecho.tipoVegetacao === 'capim_alto' ? 'muito alta' : 'moderada'
      }`,
    },
    {
      icone: 'partly-sunny-outline' as const,
      titulo: 'Condição climática',
      desc: `${LABEL_CLIMA[trecho.clima.condicao]} · ${trecho.clima.temperatura}°C · fator ${trecho.clima.fatorCrescimento}×`,
    },
    {
      icone: 'bar-chart-outline' as const,
      titulo: 'Histórico do trecho',
      desc: `Média de crescimento: +${((trecho.alturaAtual - trecho.historico[0].altura) / trecho.historico.length).toFixed(1)} cm/ciclo`,
    },
  ];

  const handleSalvarAlerta = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Alerta: ${trecho.rodovia} km ${trecho.kmInicial}–${trecho.kmFinal}`,
            body: `Grama a ${trecho.alturaAtual} cm. Limite: 30 cm. Corte: ${trecho.previsaoCorte}.`,
          },
          trigger: null,
        });
      }
    } catch (_) {}

    setAlertaSalvo(true);
    Alert.alert(
      'Alerta salvo!',
      `O trecho ${trecho.rodovia} km ${trecho.kmInicial}–${trecho.kmFinal} foi adicionado ao ranking de prioridades.`,
      [
        {
          text: 'Ver ranking',
          onPress: () => {
            navigation.navigate('Main');
          },
        },
        { text: 'OK' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        titulo="Previsão de Corte"
        subtitulo={`${trecho.rodovia} km ${trecho.kmInicial}–${trecho.kmFinal} · ${trecho.sentido}`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Resumo do trecho */}
        <View style={[styles.resumoCard, { borderLeftColor: statusColors.border }]}>
          <View style={styles.resumoHeader}>
            <View>
              <Text style={styles.resumoRodovia}>{trecho.rodovia} — {trecho.nomeRodovia}</Text>
              <Text style={styles.resumoKm}>km {trecho.kmInicial}–{trecho.kmFinal} · {trecho.sentido}</Text>
            </View>
            <StatusChip status={trecho.status} />
          </View>
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={[styles.metricVal, { color: statusColors.text }]}>{trecho.alturaAtual} cm</Text>
              <Text style={styles.metricLabel}>Altura atual</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color={COLORS.border} />
            <View style={styles.metric}>
              <Text style={[styles.metricVal, { color: COLORS.danger }]}>30 cm</Text>
              <Text style={styles.metricLabel}>Limite</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metric}>
              <Text style={[styles.metricVal, { color: COLORS.danger, fontSize: 14 }]}>
                {trecho.previsaoCorte === 'Imediato' ? 'IMEDIATO' : trecho.previsaoCorte.slice(5).replace('-', '/')}
              </Text>
              <Text style={styles.metricLabel}>Corte previsto</Text>
            </View>
          </View>
        </View>

        {/* Condições climáticas */}
        <Text style={styles.sectionTitle}>Condições climáticas</Text>
        <View style={styles.climaCard}>
          <View style={styles.climaHeader}>
            <Ionicons
              name={
                trecho.clima.condicao === 'seco' ? 'sunny-outline' :
                trecho.clima.condicao === 'muito_umido' ? 'thunderstorm-outline' : 'rainy-outline'
              }
              size={28}
              color={COLORS.info}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.climaCondicao}>{LABEL_CLIMA[trecho.clima.condicao]}</Text>
              <Text style={styles.climaDesc}>{trecho.clima.descricao}</Text>
            </View>
          </View>
          <View style={styles.climaMetrics}>
            <View style={styles.climaMetric}>
              <Ionicons name="thermometer-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.climaMetricLabel}>Temperatura</Text>
              <Text style={styles.climaMetricVal}>{trecho.clima.temperatura}°C</Text>
            </View>
            <View style={styles.climaMetric}>
              <Ionicons name="speedometer-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.climaMetricLabel}>Fator crescimento</Text>
              <Text style={[styles.climaMetricVal, { color: trecho.clima.fatorCrescimento > 1.5 ? COLORS.danger : COLORS.text }]}>
                {trecho.clima.fatorCrescimento}×
              </Text>
            </View>
            <View style={styles.climaMetric}>
              <Ionicons name="leaf-outline" size={16} color={COLORS.textSecondary} />
              <Text style={styles.climaMetricLabel}>Vegetação</Text>
              <Text style={styles.climaMetricVal}>{LABEL_VEGETACAO[trecho.tipoVegetacao]}</Text>
            </View>
          </View>
        </View>

        {/* Gráfico de tendência */}
        <Text style={styles.sectionTitle}>Histórico e tendência de crescimento</Text>
        <View style={styles.graficoCard}>
          <GraficoCrescimento historico={trecho.historico} limite={30} />
        </View>

        {/* Motivos da previsão */}
        <Text style={styles.sectionTitle}>Motivos da previsão</Text>
        {motivosPrevisao.map((m, i) => (
          <View key={i} style={styles.motivoItem}>
            <View style={styles.motivoIcon}>
              <Ionicons name={m.icone} size={18} color={COLORS.primary} />
            </View>
            <View style={styles.motivoContent}>
              <Text style={styles.motivoTitulo}>{m.titulo}</Text>
              <Text style={styles.motivoDesc}>{m.desc}</Text>
            </View>
          </View>
        ))}

        {/* Diagnóstico final */}
        <View style={[styles.diagnosticoCard, { backgroundColor: statusColors.bg, borderColor: statusColors.border }]}>
          <Ionicons
            name={trecho.status === 'corte_necessario' ? 'warning' : 'information-circle'}
            size={22}
            color={statusColors.text}
          />
          <View style={{ flex: 1 }}>
            <Text style={[styles.diagnosticoTitulo, { color: statusColors.text }]}>
              {trecho.status === 'corte_necessario'
                ? 'Corte imediato necessário'
                : trecho.status === 'atencao'
                ? `Programar corte em até ${trecho.diasAte30cm} dias`
                : 'Manter no ciclo quinzenal'}
            </Text>
            <Text style={[styles.diagnosticoDesc, { color: statusColors.text + 'CC' }]}>
              {trecho.status === 'corte_necessario'
                ? 'Altura já acima do limite. Priorizar imediatamente no cronograma de rocada.'
                : trecho.status === 'atencao'
                ? `Tendência de atingir 30 cm em ${trecho.diasAte30cm} dias. Ação preventiva recomendada.`
                : 'Trecho dentro do padrão. Acompanhar na próxima coleta quinzenal.'}
            </Text>
          </View>
        </View>

        {/* Botão salvar alerta */}
        {!alertaSalvo ? (
          <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvarAlerta} activeOpacity={0.85}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.white} />
            <Text style={styles.btnText}>Salvar alerta e adicionar ao ranking</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.alertaSalvoBox}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
            <Text style={styles.alertaSalvoText}>Alerta salvo com sucesso no ranking de prioridades</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.btnDetalhe}
          onPress={() => navigation.navigate('Detalhe', { trechoId: trecho.id })}
          activeOpacity={0.8}
        >
          <Text style={styles.btnDetalheText}>Ver detalhe completo do trecho</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
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
    marginTop: 6,
  },
  resumoCard: {
    backgroundColor: COLORS.white,
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
  resumoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  resumoRodovia: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  resumoKm: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metric: { alignItems: 'center', flex: 1 },
  metricVal: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  metricLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2, textAlign: 'center' },
  metricDivider: { width: 1, height: 36, backgroundColor: COLORS.border },
  climaCard: {
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
  climaHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  climaCondicao: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  climaDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 16 },
  climaMetrics: { flexDirection: 'row', gap: 8 },
  climaMetric: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  climaMetricLabel: { fontSize: 10, color: COLORS.textSecondary, textAlign: 'center' },
  climaMetricVal: { fontSize: 13, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  graficoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  motivoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  motivoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  motivoContent: { flex: 1 },
  motivoTitulo: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  motivoDesc: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 16 },
  diagnosticoCard: {
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    borderWidth: 1.5,
    marginBottom: 16,
    marginTop: 4,
  },
  diagnosticoTitulo: { fontSize: 14, fontWeight: '700', marginBottom: 3 },
  diagnosticoDesc: { fontSize: 12, lineHeight: 17 },
  btnSalvar: {
    backgroundColor: COLORS.danger,
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    shadowColor: COLORS.danger,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
  alertaSalvoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primaryBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  alertaSalvoText: { fontSize: 13, color: COLORS.primary, fontWeight: '600', flex: 1 },
  btnDetalhe: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 10,
    padding: 12,
  },
  btnDetalheText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
});
