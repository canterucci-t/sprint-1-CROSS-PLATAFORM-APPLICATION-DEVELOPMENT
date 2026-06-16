import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, STATUS_COLORS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../types';
import { LABEL_VEGETACAO, LABEL_STATUS } from '../data/mockData';
import ScreenHeader from '../components/ScreenHeader';
import StatusChip from '../components/StatusChip';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Analise'>;

export default function AnaliseScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { getTrechoById } = useApp();
  const trecho = getTrechoById(route.params.trechoId);

  const [scanned, setScanned] = useState(false);
  const scanAnim = React.useRef(new Animated.Value(0)).current;
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scanAnim, { toValue: 1, duration: 1000, useNativeDriver: false }),
      Animated.timing(progressAnim, {
        toValue: trecho ? Math.min(trecho.alturaAtual / 35, 1) : 0.8,
        duration: 800,
        useNativeDriver: false,
      }),
    ]).start(() => setScanned(true));
  }, []);

  if (!trecho) {
    return (
      <View style={styles.container}>
        <ScreenHeader titulo="Análise" onBack={() => navigation.goBack()} />
        <Text style={{ padding: 24, color: COLORS.text }}>Trecho não encontrado.</Text>
      </View>
    );
  }

  const statusColors = STATUS_COLORS[trecho.status];
  const confianca = 94;
  const alturaPercent = Math.min((trecho.alturaAtual / 35) * 100, 100);
  const limitePercent = (30 / 35) * 100;

  return (
    <View style={styles.container}>
      <ScreenHeader
        titulo="Análise por Visão Computacional"
        subtitulo={`${trecho.rodovia} km ${trecho.kmInicial}–${trecho.kmFinal}`}
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Imagem com área de vegetação destacada */}
        <View style={styles.imagemCard}>
          <View style={styles.imagemBg}>
            <Ionicons name="image-outline" size={50} color="rgba(255,255,255,0.4)" />
            {/* Simulated vegetation overlay */}
            <View style={styles.vegetacaoOverlay}>
              <View style={styles.vegetacaoBox}>
                <Text style={styles.vegetacaoBoxLabel}>Vegetação detectada</Text>
              </View>
            </View>
            {/* Scan line animation */}
            {!scanned && (
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    top: scanAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            )}
            {scanned && (
              <View style={styles.scanDone}>
                <Ionicons name="checkmark-circle" size={28} color={COLORS.white} />
                <Text style={styles.scanDoneText}>Análise concluída</Text>
              </View>
            )}
          </View>
          <View style={styles.imagemFooter}>
            <Ionicons name="camera-outline" size={13} color={COLORS.textSecondary} />
            <Text style={styles.imagemFooterText}>
              SP-{trecho.rodovia.replace('SP-', '')} · km {trecho.kmInicial} · {trecho.ultimaColeta} · Câmera frontal
            </Text>
          </View>
        </View>

        {/* Resultado principal */}
        <View style={[styles.resultadoCard, { borderLeftColor: statusColors.border }]}>
          <View style={styles.resultadoHeader}>
            <Text style={styles.resultadoTitulo}>Altura estimada da grama</Text>
            <StatusChip status={trecho.status} />
          </View>
          <Text style={[styles.alturaGrande, { color: statusColors.text }]}>
            {trecho.alturaAtual} <Text style={styles.alturaCm}>cm</Text>
          </Text>

          {/* Confiança */}
          <View style={styles.confiancaRow}>
            <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.primary} />
            <Text style={styles.confiancaText}>
              Confiança da leitura: <Text style={{ fontWeight: '700', color: COLORS.primary }}>{confianca}%</Text>
            </Text>
          </View>

          {/* Barra comparativa */}
          <View style={styles.comparativoContainer}>
            <View style={styles.comparativoBg}>
              {/* Limite line */}
              <View style={[styles.limiteLine, { left: `${limitePercent}%` }]} />
              {/* Altura fill */}
              <Animated.View
                style={[
                  styles.alturaFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', `${alturaPercent}%`],
                    }),
                    backgroundColor: statusColors.border,
                  },
                ]}
              />
            </View>
            <View style={styles.comparativoLabels}>
              <Text style={styles.comparativoLabel}>0 cm</Text>
              <View style={styles.comparativoLimite}>
                <Text style={[styles.comparativoLabel, { color: COLORS.danger }]}>30 cm (limite)</Text>
              </View>
              <Text style={styles.comparativoLabel}>35 cm</Text>
            </View>
          </View>
        </View>

        {/* Detalhes da análise */}
        <Text style={styles.sectionTitle}>Dados da análise</Text>
        <View style={styles.dadosGrid}>
          <View style={styles.dadoItem}>
            <Ionicons name="leaf-outline" size={18} color={COLORS.primary} />
            <Text style={styles.dadoLabel}>Tipo de vegetação</Text>
            <Text style={styles.dadoValor}>{LABEL_VEGETACAO[trecho.tipoVegetacao]}</Text>
          </View>
          <View style={styles.dadoItem}>
            <Ionicons name="analytics-outline" size={18} color={COLORS.primary} />
            <Text style={styles.dadoLabel}>Altura medida</Text>
            <Text style={[styles.dadoValor, { color: statusColors.text }]}>{trecho.alturaAtual} cm</Text>
          </View>
          <View style={styles.dadoItem}>
            <Ionicons name="warning-outline" size={18} color={COLORS.danger} />
            <Text style={styles.dadoLabel}>Limite operacional</Text>
            <Text style={[styles.dadoValor, { color: COLORS.danger }]}>30 cm</Text>
          </View>
          <View style={styles.dadoItem}>
            <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.primary} />
            <Text style={styles.dadoLabel}>Status do trecho</Text>
            <Text style={[styles.dadoValor, { color: statusColors.text }]}>{LABEL_STATUS[trecho.status]}</Text>
          </View>
        </View>

        {/* Localização GPS */}
        <View style={styles.gpsCard}>
          <Ionicons name="navigate-circle-outline" size={16} color={COLORS.info} />
          <View style={{ flex: 1 }}>
            <Text style={styles.gpsLabel}>Coordenadas registradas</Text>
            <Text style={styles.gpsCoords}>
              {trecho.coordenadas.lat.toFixed(5)}, {trecho.coordenadas.lng.toFixed(5)}
            </Text>
          </View>
          <View style={styles.gpsStatus}>
            <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
            <Text style={styles.gpsStatusText}>GPS fixo</Text>
          </View>
        </View>

        {/* Botão */}
        <TouchableOpacity
          style={styles.btnPrevisao}
          onPress={() => navigation.navigate('Previsao', { trechoId: trecho.id })}
          activeOpacity={0.85}
        >
          <Ionicons name="trending-up-outline" size={20} color={COLORS.white} />
          <Text style={styles.btnText}>Ver previsão de corte</Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
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
  imagemCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  imagemBg: {
    height: 180,
    backgroundColor: '#1A3A2A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  vegetacaoOverlay: {
    position: 'absolute',
    top: 40,
    left: 30,
    right: 30,
    bottom: 40,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    borderRadius: 4,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(31,157,102,0.15)',
  },
  vegetacaoBox: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    margin: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  vegetacaoBoxLabel: { fontSize: 10, color: COLORS.white, fontWeight: '700' },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.9,
  },
  scanDone: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  scanDoneText: { color: COLORS.white, fontSize: 11, fontWeight: '600' },
  imagemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    backgroundColor: COLORS.grayLight,
  },
  imagemFooterText: { fontSize: 11, color: COLORS.textSecondary },
  resultadoCard: {
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
  resultadoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultadoTitulo: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  alturaGrande: { fontSize: 52, fontWeight: '700', lineHeight: 56, marginBottom: 8 },
  alturaCm: { fontSize: 24, fontWeight: '500' },
  confiancaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  confiancaText: { fontSize: 13, color: COLORS.textSecondary },
  comparativoContainer: { gap: 6 },
  comparativoBg: {
    height: 12,
    backgroundColor: COLORS.grayLight,
    borderRadius: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  limiteLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: COLORS.danger,
    zIndex: 2,
  },
  alturaFill: { height: '100%', borderRadius: 6 },
  comparativoLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
  },
  comparativoLabel: { fontSize: 10, color: COLORS.textSecondary },
  comparativoLimite: { position: 'absolute', left: `${(30 / 35) * 100 - 10}%` },
  dadosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  dadoItem: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  dadoLabel: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center' },
  dadoValor: { fontSize: 14, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  gpsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.infoBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.info + '30',
  },
  gpsLabel: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 2 },
  gpsCoords: { fontSize: 12, color: COLORS.info, fontWeight: '600', fontFamily: 'monospace' },
  gpsStatus: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  gpsStatusText: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  btnPrevisao: {
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
