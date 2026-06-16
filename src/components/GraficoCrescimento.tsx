import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MedicaoHistorica } from '../types';
import { COLORS, STATUS_COLORS } from '../theme/colors';

interface GraficoCrescimentoProps {
  historico: MedicaoHistorica[];
  limite?: number;
}

export default function GraficoCrescimento({
  historico,
  limite = 30,
}: GraficoCrescimentoProps) {
  const maxAltura = Math.max(limite + 5, ...historico.map((h) => h.altura));
  const CHART_HEIGHT = 100;

  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('-');
    return `${parts[2]}/${parts[1]}`;
  };

  return (
    <View style={styles.container}>
      {/* Y-axis labels */}
      <View style={styles.yAxis}>
        <Text style={styles.yLabel}>{maxAltura}cm</Text>
        <Text style={[styles.yLabel, { color: COLORS.danger }]}>{limite}cm</Text>
        <Text style={styles.yLabel}>0</Text>
      </View>

      {/* Chart area */}
      <View style={styles.chartArea}>
        {/* Limit line */}
        <View
          style={[
            styles.limitLine,
            { bottom: (limite / maxAltura) * CHART_HEIGHT },
          ]}
        />

        {/* Bars */}
        <View style={styles.barsContainer}>
          {historico.map((medicao, idx) => {
            const barHeight = (medicao.altura / maxAltura) * CHART_HEIGHT;
            const colors = STATUS_COLORS[medicao.status];
            const isLast = idx === historico.length - 1;

            return (
              <View key={idx} style={styles.barWrapper}>
                <Text style={[styles.barValue, { color: colors.text }]}>
                  {medicao.altura}
                </Text>
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        height: barHeight,
                        backgroundColor: colors.border,
                        opacity: isLast ? 1 : 0.65,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barDate}>{formatDate(medicao.data)}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 140,
    paddingTop: 8,
  },
  yAxis: {
    width: 36,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 6,
    paddingBottom: 20,
  },
  yLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  limitLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: COLORS.danger,
    borderStyle: 'dashed',
    opacity: 0.7,
    zIndex: 1,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 20,
    height: 100,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  barBg: {
    width: 28,
    height: 100,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.grayLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  barDate: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 4,
    position: 'absolute',
    bottom: 0,
  },
});
