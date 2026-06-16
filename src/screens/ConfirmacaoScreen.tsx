import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, STATUS_COLORS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'Confirmacao'>;

export default function ConfirmacaoScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { getTrechoById } = useApp();
  const insets = useSafeAreaInsets();
  const trecho = getTrechoById(route.params.trechoId);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 60, friction: 6 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  const { equipe, dataPlaneada } = route.params;
  const dataFormatada = dataPlaneada
    ? `${dataPlaneada.slice(8)}/${dataPlaneada.slice(5, 7)}/2026`
    : '';

  const diaMap: Record<string, string> = {
    '2026-06-16': 'Segunda-feira',
    '2026-06-17': 'Terça-feira',
    '2026-06-18': 'Quarta-feira',
    '2026-06-19': 'Quinta-feira',
    '2026-06-20': 'Sexta-feira',
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        {/* Ícone de sucesso animado */}
        <Animated.View style={[styles.successIcon, { transform: [{ scale: scaleAnim }] }]}>
          <Ionicons name="checkmark" size={52} color={COLORS.white} />
        </Animated.View>

        <Animated.View style={[styles.textBlock, { opacity: opacityAnim }]}>
          <Text style={styles.titulo}>Cronograma confirmado!</Text>
          <Text style={styles.subtitulo}>
            O trecho foi adicionado ao cronograma de corte com sucesso.
          </Text>
        </Animated.View>

        {/* Card de resumo */}
        {trecho && (
          <Animated.View style={[styles.resumoCard, { opacity: opacityAnim }]}>
            {/* Header */}
            <View style={[styles.cardHeader, { backgroundColor: STATUS_COLORS[trecho.status].bg }]}>
              <View style={styles.rodoviaBadge}>
                <Text style={styles.rodoviaBadgeText}>{trecho.rodovia}</Text>
              </View>
              <Text style={styles.cardKm}>km {trecho.kmInicial}–{trecho.kmFinal} · {trecho.sentido}</Text>
            </View>

            {/* Detalhes */}
            <View style={styles.cardBody}>
              {[
                {
                  icon: 'analytics-outline' as const,
                  label: 'Altura atual',
                  val: `${trecho.alturaAtual} cm`,
                  color: STATUS_COLORS[trecho.status].text,
                },
                {
                  icon: 'warning-outline' as const,
                  label: 'Limite operacional',
                  val: '30 cm',
                  color: COLORS.danger,
                },
                {
                  icon: 'people-outline' as const,
                  label: 'Equipe designada',
                  val: equipe,
                  color: COLORS.text,
                },
                {
                  icon: 'calendar' as const,
                  label: 'Data planejada',
                  val: `${diaMap[dataPlaneada] ?? ''}, ${dataFormatada}`,
                  color: COLORS.primary,
                },
              ].map((item, i) => (
                <View key={i} style={styles.detalheRow}>
                  <View style={styles.detalheIcon}>
                    <Ionicons name={item.icon} size={16} color={item.color} />
                  </View>
                  <Text style={styles.detalheLabel}>{item.label}</Text>
                  <Text style={[styles.detalheVal, { color: item.color }]}>{item.val}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Informação de rastreabilidade */}
        <Animated.View style={[styles.rastreioCard, { opacity: opacityAnim }]}>
          <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.primary} />
          <Text style={styles.rastreioText}>
            Agendamento registrado · Equipe notificada · Rastreável no sistema Motiva
          </Text>
        </Animated.View>
      </View>

      {/* Botão */}
      <Animated.View style={[styles.btnArea, { opacity: opacityAnim }]}>
        <TouchableOpacity
          style={styles.btnDashboard}
          onPress={() => navigation.navigate('Main')}
          activeOpacity={0.85}
        >
          <Ionicons name="grid-outline" size={20} color={COLORS.white} />
          <Text style={styles.btnText}>Voltar ao Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnCronograma}
          onPress={() => {
            navigation.navigate('Main');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.btnCronogramaText}>Ver cronograma completo</Text>
          <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 24,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  textBlock: {
    alignItems: 'center',
    gap: 8,
  },
  titulo: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitulo: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  resumoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  cardHeader: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rodoviaBadge: {
    backgroundColor: COLORS.info,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  rodoviaBadgeText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  cardKm: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  cardBody: { padding: 14, gap: 12 },
  detalheRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detalheIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detalheLabel: { flex: 1, fontSize: 13, color: COLORS.textSecondary },
  detalheVal: { fontSize: 14, fontWeight: '700', textAlign: 'right', flex: 1 },
  rastreioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  rastreioText: { flex: 1, color: 'rgba(255,255,255,0.9)', fontSize: 12, lineHeight: 17 },
  btnArea: { paddingHorizontal: 24, paddingBottom: 20, gap: 10 },
  btnDashboard: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  btnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  btnCronograma: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 12,
  },
  btnCronogramaText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
});
