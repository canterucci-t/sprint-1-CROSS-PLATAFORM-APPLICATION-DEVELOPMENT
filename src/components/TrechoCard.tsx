import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Trecho } from '../types';
import { COLORS, STATUS_COLORS } from '../theme/colors';
import { LABEL_VEGETACAO } from '../data/mockData';
import StatusChip from './StatusChip';

interface TrechoCardProps {
  trecho: Trecho;
  onPress?: () => void;
  posicao?: number;
}

export default function TrechoCard({ trecho, onPress, posicao }: TrechoCardProps) {
  const statusColors = STATUS_COLORS[trecho.status];
  const progressPercent = Math.min((trecho.alturaAtual / 30) * 100, 100);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.card}>
      {posicao !== undefined && (
        <View style={[styles.badge, { backgroundColor: statusColors.border }]}>
          <Text style={styles.badgeText}>{posicao}</Text>
        </View>
      )}
      <View style={styles.header}>
        <View style={styles.rodoviaBadge}>
          <Text style={styles.rodoviaText}>{trecho.rodovia}</Text>
        </View>
        <Text style={styles.km}>
          km {trecho.kmInicial}–{trecho.kmFinal} · {trecho.sentido}
        </Text>
        <StatusChip status={trecho.status} small />
      </View>

      <View style={styles.alturaRow}>
        <View style={styles.alturaInfo}>
          <Text style={styles.alturaLabel}>Altura atual</Text>
          <Text style={[styles.alturaValor, { color: statusColors.text }]}>
            {trecho.alturaAtual} cm
          </Text>
        </View>
        <View style={styles.alturaInfo}>
          <Text style={styles.alturaLabel}>Limite</Text>
          <Text style={styles.alturaLimite}>30 cm</Text>
        </View>
        {trecho.diasAte30cm > 0 ? (
          <View style={styles.alturaInfo}>
            <Text style={styles.alturaLabel}>Dias p/ corte</Text>
            <Text style={[styles.diasValor, { color: statusColors.text }]}>
              {trecho.diasAte30cm}d
            </Text>
          </View>
        ) : null}
      </View>

      {/* Progress bar */}
      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            { width: `${progressPercent}%`, backgroundColor: statusColors.border },
          ]}
        />
        <View style={styles.progressLimitLine} />
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="leaf-outline" size={12} color={COLORS.textSecondary} />
          <Text style={styles.footerText}>{LABEL_VEGETACAO[trecho.tipoVegetacao]}</Text>
        </View>
        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={12} color={COLORS.textSecondary} />
          <Text style={styles.footerText}>
            {trecho.previsaoCorte === 'Imediato'
              ? 'Corte imediato'
              : `Corte: ${trecho.previsaoCorte.slice(5).replace('-', '/')}`}
          </Text>
        </View>
        {onPress && (
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  rodoviaBadge: {
    backgroundColor: COLORS.info,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  rodoviaText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  km: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
    flex: 1,
  },
  alturaRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 8,
  },
  alturaInfo: {
    alignItems: 'flex-start',
  },
  alturaLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  alturaValor: {
    fontSize: 20,
    fontWeight: '700',
  },
  alturaLimite: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  diasValor: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressBg: {
    height: 6,
    backgroundColor: COLORS.grayLight,
    borderRadius: 3,
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLimitLine: {
    position: 'absolute',
    right: 0,
    top: -2,
    width: 2,
    height: 10,
    backgroundColor: COLORS.danger,
    borderRadius: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
