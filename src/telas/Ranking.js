import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { trechos, corDoStatus, labelDoStatus, fundoDoStatus } from '../dados';

// Ordena trechos do mais urgente ao menos urgente
const trechosOrdenados = [...trechos].sort((a, b) => a.diasAteCorte - b.diasAteCorte);

export default function Ranking() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <Ionicons name="podium" size={20} color="white" />
        <View>
          <Text style={styles.cabecalhoTitulo}>Ranking de Prioridades</Text>
          <Text style={styles.cabecalhoSub}>{trechos.length} trechos · Ciclo 12/2026</Text>
        </View>
      </View>

      {/* Legenda */}
      <View style={styles.legenda}>
        <View style={styles.legendaItem}>
          <View style={[styles.dot, { backgroundColor: '#D64545' }]} />
          <Text style={styles.legendaTexto}>Corte necessário</Text>
        </View>
        <View style={styles.legendaItem}>
          <View style={[styles.dot, { backgroundColor: '#F2B705' }]} />
          <Text style={styles.legendaTexto}>Atenção</Text>
        </View>
        <View style={styles.legendaItem}>
          <View style={[styles.dot, { backgroundColor: '#1F9D66' }]} />
          <Text style={styles.legendaTexto}>Normal</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.lista}>
        {trechosOrdenados.map((trecho, index) => {
          const cor = corDoStatus(trecho.status);
          const fundo = fundoDoStatus(trecho.status);
          const label = labelDoStatus(trecho.status);

          return (
            <TouchableOpacity
              key={trecho.id}
              style={styles.card}
              onPress={() => navigation.navigate('Detalhe', { trechoId: trecho.id })}
            >
              {/* Posição no ranking */}
              <View style={[styles.posicao, { backgroundColor: index < 3 ? cor : '#E0E0E0' }]}>
                <Text style={[styles.posicaoTexto, { color: index < 3 ? 'white' : '#607D8B' }]}>
                  {index + 1}
                </Text>
              </View>

              <View style={styles.cardConteudo}>
                <View style={styles.cardTopo}>
                  <View style={styles.cardTitulos}>
                    <Text style={styles.rodovia}>{trecho.rodovia}</Text>
                    <Text style={styles.km}>{trecho.km} · {trecho.sentido}</Text>
                  </View>
                  <View style={[styles.chip, { backgroundColor: fundo }]}>
                    <Text style={[styles.chipTexto, { color: cor }]}>{label.toUpperCase()}</Text>
                  </View>
                </View>

                {/* Barra de progresso da altura */}
                <View style={styles.barraContainer}>
                  <View
                    style={[
                      styles.barraFill,
                      {
                        width: `${Math.min((trecho.alturaAtual / 40) * 100, 100)}%`,
                        backgroundColor: cor,
                      },
                    ]}
                  />
                  {/* Marca de 30 cm (limite) */}
                  <View style={styles.barraMarca} />
                </View>

                <View style={styles.cardRodape}>
                  <View style={styles.metricinha}>
                    <Ionicons name="resize-outline" size={13} color={cor} />
                    <Text style={[styles.metricalor, { color: cor }]}>
                      {trecho.alturaAtual} cm
                    </Text>
                  </View>
                  <View style={styles.metricinha}>
                    <Ionicons name="calendar-outline" size={13} color="#607D8B" />
                    <Text style={styles.metricaLabel}>
                      {trecho.diasAteCorte === 0 ? 'Imediato' : `${trecho.diasAteCorte} dias`}
                    </Text>
                  </View>
                  <View style={styles.metricinha}>
                    <Ionicons name="leaf-outline" size={13} color="#607D8B" />
                    <Text style={styles.metricaLabel}>{trecho.tipoVegetacao}</Text>
                  </View>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={16} color="#B0BEC5" />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
  },
  cabecalho: {
    backgroundColor: '#0B5C46',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cabecalhoTitulo: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cabecalhoSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
  },
  legenda: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    gap: 16,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendaTexto: {
    fontSize: 11,
    color: '#607D8B',
  },
  lista: {
    padding: 12,
    paddingBottom: 32,
    gap: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
  },
  posicao: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  posicaoTexto: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardConteudo: {
    flex: 1,
    gap: 6,
  },
  cardTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitulos: {
    flex: 1,
  },
  rodovia: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#263238',
  },
  km: {
    fontSize: 12,
    color: '#607D8B',
    marginTop: 1,
  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  chipTexto: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  barraContainer: {
    height: 6,
    backgroundColor: '#ECEFF1',
    borderRadius: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  barraFill: {
    height: '100%',
    borderRadius: 3,
  },
  barraMarca: {
    position: 'absolute',
    left: '75%',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  cardRodape: {
    flexDirection: 'row',
    gap: 12,
  },
  metricinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metricalor: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  metricaLabel: {
    fontSize: 12,
    color: '#607D8B',
  },
});
