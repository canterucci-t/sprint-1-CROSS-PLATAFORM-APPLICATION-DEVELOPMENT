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
import { cronograma, getTrechoPorId, corDoStatus } from '../dados';

// Agrupa os itens do cronograma pelo campo `dia`
function agruparPorDia(lista) {
  const grupos = {};
  lista.forEach((item) => {
    if (!grupos[item.dia]) {
      grupos[item.dia] = [];
    }
    grupos[item.dia].push(item);
  });
  return grupos;
}

export default function Cronograma() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const grupos = agruparPorDia(cronograma);
  const dias = Object.keys(grupos);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <Ionicons name="calendar" size={20} color="white" />
        <View>
          <Text style={styles.cabecalhoTitulo}>Cronograma de Cortes</Text>
          <Text style={styles.cabecalhoSub}>{cronograma.length} cortes planejados</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.lista}>
        {/* Aviso informativo */}
        <View style={styles.avisoCard}>
          <Ionicons name="information-circle-outline" size={16} color="#1E5AA8" />
          <Text style={styles.avisoTexto}>
            O cronograma é gerado automaticamente com base na altura e urgência de cada trecho.
          </Text>
        </View>

        {/* Grupos por dia */}
        {dias.map((dia) => (
          <View key={dia} style={styles.grupo}>
            {/* Cabeçalho do dia */}
            <View style={styles.diaHeader}>
              <Ionicons name="today-outline" size={16} color="#0B5C46" />
              <Text style={styles.diaTitulo}>{dia}</Text>
              <View style={styles.diaChip}>
                <Text style={styles.diaChipTexto}>
                  {grupos[dia].length} {grupos[dia].length === 1 ? 'corte' : 'cortes'}
                </Text>
              </View>
            </View>

            {/* Itens do dia */}
            {grupos[dia].map((item) => {
              const trecho = getTrechoPorId(item.trechoId);
              if (!trecho) return null;
              const cor = corDoStatus(trecho.status);

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.itemCard, { borderLeftColor: cor }]}
                  onPress={() => navigation.navigate('Detalhe', { trechoId: trecho.id })}
                >
                  <View style={styles.itemEsq}>
                    <View style={[styles.prioridadeBadge, { backgroundColor: cor }]}>
                      <Text style={styles.prioridadeTexto}>#{item.prioridade}</Text>
                    </View>
                    <View style={styles.itemTextos}>
                      <Text style={styles.itemRodovia}>
                        {trecho.rodovia} · {trecho.km}
                      </Text>
                      <Text style={styles.itemSentido}>{trecho.sentido} · {trecho.tipoVegetacao}</Text>
                      <View style={styles.itemInfo}>
                        <Ionicons name="people-outline" size={13} color="#607D8B" />
                        <Text style={styles.itemEquipe}>{item.equipe}</Text>
                        <Ionicons name="resize-outline" size={13} color={cor} style={{ marginLeft: 10 }} />
                        <Text style={[styles.itemAltura, { color: cor }]}>
                          {trecho.alturaAtual} cm
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#B0BEC5" />
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {/* Botão para ver ranking */}
        <TouchableOpacity
          style={styles.botaoRanking}
          onPress={() => navigation.navigate('Ranking')}
        >
          <Ionicons name="podium-outline" size={16} color="#0B5C46" />
          <Text style={styles.botaoRankingTexto}>Ver ranking completo de urgência</Text>
          <Ionicons name="chevron-forward" size={14} color="#0B5C46" />
        </TouchableOpacity>
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
  lista: {
    padding: 12,
    paddingBottom: 32,
    gap: 12,
  },
  avisoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#E3F0FF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  avisoTexto: {
    flex: 1,
    fontSize: 12,
    color: '#1E5AA8',
    lineHeight: 18,
  },
  grupo: {
    gap: 8,
  },
  diaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  diaTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0B5C46',
    flex: 1,
  },
  diaChip: {
    backgroundColor: '#E8F6EF',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  diaChipTexto: {
    fontSize: 11,
    color: '#0B5C46',
    fontWeight: '600',
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  itemEsq: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  prioridadeBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 2,
  },
  prioridadeTexto: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  itemTextos: {
    flex: 1,
    gap: 2,
  },
  itemRodovia: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#263238',
  },
  itemSentido: {
    fontSize: 12,
    color: '#607D8B',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  itemEquipe: {
    fontSize: 12,
    color: '#607D8B',
  },
  itemAltura: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  botaoRanking: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F6EF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F9D66',
    marginTop: 4,
  },
  botaoRankingTexto: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0B5C46',
  },
});
