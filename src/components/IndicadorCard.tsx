import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

interface IndicadorCardProps {
  titulo: string;
  valor: string | number;
  subtitulo?: string;
  icone: keyof typeof Ionicons.glyphMap;
  cor?: string;
  corFundo?: string;
}

export default function IndicadorCard({
  titulo,
  valor,
  subtitulo,
  icone,
  cor = COLORS.primary,
  corFundo = COLORS.primaryBg,
}: IndicadorCardProps) {
  return (
    <View style={[styles.card, { borderLeftColor: cor }]}>
      <View style={[styles.iconContainer, { backgroundColor: corFundo }]}>
        <Ionicons name={icone} size={22} color={cor} />
      </View>
      <View style={styles.content}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={[styles.valor, { color: cor }]}>{valor}</Text>
        {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  titulo: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  valor: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 26,
  },
  subtitulo: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
});
