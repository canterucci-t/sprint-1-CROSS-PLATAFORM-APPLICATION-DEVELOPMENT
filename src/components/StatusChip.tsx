import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusVegetacao } from '../types';
import { STATUS_COLORS } from '../theme/colors';
import { LABEL_STATUS } from '../data/mockData';

interface StatusChipProps {
  status: StatusVegetacao;
  small?: boolean;
}

export default function StatusChip({ status, small = false }: StatusChipProps) {
  const colors = STATUS_COLORS[status];

  return (
    <View
      style={[
        styles.chip,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          paddingHorizontal: small ? 8 : 12,
          paddingVertical: small ? 2 : 4,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: colors.text, fontSize: small ? 10 : 12 },
        ]}
      >
        {LABEL_STATUS[status]?.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
