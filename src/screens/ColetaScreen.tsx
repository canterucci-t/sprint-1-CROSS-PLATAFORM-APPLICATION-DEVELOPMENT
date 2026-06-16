import React, { useState, useEffect } from 'react';
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
import * as Location from 'expo-location';
import { COLORS, STATUS_COLORS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../types';
import { LABEL_STATUS } from '../data/mockData';
import ScreenHeader from '../components/ScreenHeader';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Coleta'>;

export default function ColetaScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { coletas, trechos, getTrechoById } = useApp();

  const coleta = coletas.find((c) => c.id === route.params.coletaId) ?? coletas[0];
  const trechosColetados = coleta.trechosColetados.map((id) => getTrechoById(id)).filter(Boolean);

  const [gpsAtivo, setGpsAtivo] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [processando, setProcessando] = useState(false);
  const [trechoSelecionado, setTrechoSelecionado] = useState(trechosColetados[0]?.id ?? '');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setGpsCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
        setGpsAtivo(true);
      }
    })();
  }, []);

  const handleProcessar = () => {
    if (!trechoSelecionado) {
      Alert.alert('Selecione um trecho', 'Toque em um trecho da lista para analisar.');
      return;
    }
    setProcessando(true);
    setTimeout(() => {
      setProcessando(false);
      navigation.navigate('Analise', { trechoId: trechoSelecionado });
    }, 1200);
  };

  const progresso = Math.round((coleta.trechosColetados.length / coleta.totalTrechos) * 100);

  return (
    <View style={styles.container}>
      <ScreenHeader
        titulo="Coleta Quinzenal"
        subtitulo={`Ciclo ${coleta.ciclo} · ${coleta.anoMes}`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Identificação do ciclo */}
        <View style={styles.cicloCard}>
          <View style={styles.cicloRow}>
            <View>
              <Text style={styles.cicloTitulo}>Ciclo {coleta.ciclo} · {coleta.anoMes}</Text>
              <Text style={styles.cicloRodovia}>{coleta.rodovia} — {coleta.nomeRodovia}</Text>
              <Text style={styles.cicloInfo}>
                km {coleta.kmInicial} ao {coleta.kmFinal} · {coleta.sentido}
              </Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: coleta.status === 'em_andamento' ? COLORS.warningBg : COLORS.primaryBg }
            ]}>
              <Text style={[
                styles.statusBadgeText,
                { color: coleta.status === 'em_andamento' ? '#7B5800' : COLORS.primary }
              ]}>
                {coleta.status === 'em_andamento' ? 'Em andamento' : 'Concluída'}
              </Text>
            </View>
          </View>
          <Text style={styles.operadorText}>
            <Ionicons name="person-outline" size={12} color={COLORS.textSecondary} /> Operador: {coleta.operador}
          </Text>
        </View>

        {/* Sensores */}
        <Text style={styles.sectionTitle}>Sensores do veículo</Text>
        <View style={styles.sensoresRow}>
          <View style={[styles.sensorCard, { borderColor: COLORS.primaryLight }]}>
            <Ionicons name="camera" size={24} color={COLORS.primary} />
            <Text style={styles.sensorLabel}>Câmera</Text>
            <View style={[styles.sensorStatus, { backgroundColor: COLORS.primaryBg }]}>
              <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
              <Text style={[styles.sensorStatusText, { color: COLORS.primary }]}>Ativa (simulado)</Text>
            </View>
          </View>
          <View style={[styles.sensorCard, { borderColor: gpsAtivo ? COLORS.primaryLight : COLORS.border }]}>
            <Ionicons name="navigate" size={24} color={gpsAtivo ? COLORS.primary : COLORS.gray} />
            <Text style={styles.sensorLabel}>GPS</Text>
            <View style={[styles.sensorStatus, { backgroundColor: gpsAtivo ? COLORS.primaryBg : COLORS.grayLight }]}>
              <View style={[styles.dot, { backgroundColor: gpsAtivo ? COLORS.primary : COLORS.gray }]} />
              <Text style={[styles.sensorStatusText, { color: gpsAtivo ? COLORS.primary : COLORS.gray }]}>
                {gpsAtivo ? `±3m` : 'Aguardando'}
              </Text>
            </View>
          </View>
        </View>

        {gpsCoords && (
          <View style={styles.coordsCard}>
            <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.coordsText}>
              {gpsCoords.lat.toFixed(5)}, {gpsCoords.lng.toFixed(5)}
            </Text>
          </View>
        )}

        {/* Progresso */}
        <Text style={styles.sectionTitle}>Progresso da coleta</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Trechos coletados</Text>
            <Text style={styles.progressValor}>
              {coleta.trechosColetados.length}/{coleta.totalTrechos}
            </Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progresso}%` }]} />
          </View>
          <Text style={styles.progressPct}>{progresso}% de cobertura</Text>
        </View>

        {/* Imagem simulada */}
        <View style={styles.imagemCard}>
          <View style={styles.imagemPlaceholder}>
            <Ionicons name="image-outline" size={40} color={COLORS.gray} />
            <Text style={styles.imagemText}>Imagem capturada — km {coleta.kmInicial + 2}</Text>
            <Text style={styles.imagemSub}>Câmera frontal · Processando vegetação</Text>
          </View>
          <View style={styles.imagemInfo}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.primary} />
            <Text style={styles.imagemInfoText}>Vegetação detectada na faixa lateral</Text>
          </View>
        </View>

        {/* Trechos medidos */}
        <Text style={styles.sectionTitle}>Trechos medidos nesta coleta</Text>
        <Text style={styles.selectHint}>Toque em um trecho para processar a análise</Text>
        {trechosColetados.map((t) => {
          if (!t) return null;
          const colors = STATUS_COLORS[t.status];
          const isSelected = trechoSelecionado === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.trechoItem, isSelected && { borderColor: COLORS.primary, borderWidth: 2 }]}
              onPress={() => setTrechoSelecionado(t.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.trechoIconArea, { backgroundColor: colors.bg }]}>
                <Ionicons name="layers-outline" size={18} color={colors.text} />
              </View>
              <View style={styles.trechoInfo}>
                <Text style={styles.trechoRodovia}>{t.rodovia} · km {t.kmInicial}–{t.kmFinal}</Text>
                <Text style={styles.trechoAltura}>
                  <Text style={{ fontWeight: '700', color: colors.text }}>{t.alturaAtual} cm</Text>
                  {' '}medidos · {LABEL_STATUS[t.status]}
                </Text>
              </View>
              <View style={[styles.trechoStatusDot, { backgroundColor: colors.border }]} />
              {isSelected && <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />}
            </TouchableOpacity>
          );
        })}

        {/* Botão */}
        <TouchableOpacity
          style={[styles.btnProcessar, processando && { opacity: 0.7 }]}
          onPress={handleProcessar}
          activeOpacity={0.85}
          disabled={processando}
        >
          <Ionicons name={processando ? 'hourglass-outline' : 'analytics-outline'} size={20} color={COLORS.white} />
          <Text style={styles.btnText}>
            {processando ? 'Processando medição...' : 'Processar medição por visão computacional'}
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
    marginBottom: 8,
    marginTop: 6,
  },
  cicloCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cicloRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  cicloTitulo: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  cicloRodovia: { fontSize: 16, fontWeight: '700', color: COLORS.primary, marginBottom: 2 },
  cicloInfo: { fontSize: 13, color: COLORS.textSecondary },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusBadgeText: { fontSize: 12, fontWeight: '600' },
  operadorText: { fontSize: 12, color: COLORS.textSecondary },
  sensoresRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  sensorCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sensorLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  sensorStatus: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  sensorStatusText: { fontSize: 11, fontWeight: '600' },
  coordsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.grayLight,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 16,
  },
  coordsText: { fontSize: 11, color: COLORS.textSecondary, fontFamily: 'monospace' },
  progressCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  progressValor: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  progressBg: { height: 8, backgroundColor: COLORS.grayLight, borderRadius: 4, marginBottom: 6 },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  progressPct: { fontSize: 12, color: COLORS.textSecondary, textAlign: 'right' },
  imagemCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  imagemPlaceholder: {
    height: 140,
    backgroundColor: COLORS.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  imagemText: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  imagemSub: { fontSize: 11, color: COLORS.textSecondary },
  imagemInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10 },
  imagemInfoText: { fontSize: 12, color: COLORS.primary, fontWeight: '500' },
  selectHint: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 8 },
  trechoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    gap: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  trechoIconArea: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  trechoInfo: { flex: 1 },
  trechoRodovia: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  trechoAltura: { fontSize: 12, color: COLORS.textSecondary },
  trechoStatusDot: { width: 10, height: 10, borderRadius: 5 },
  btnProcessar: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnText: { color: COLORS.white, fontSize: 15, fontWeight: '700' },
});
