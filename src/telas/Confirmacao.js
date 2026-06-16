import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getTrechoPorId } from '../dados';

export default function Confirmacao() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  const { trechoId } = route.params;
  const trecho = getTrechoPorId(trechoId);

  // Volta para o Dashboard (raiz das tabs)
  function voltarDashboard() {
    navigation.navigate('Principal');
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Ícone de sucesso */}
      <View style={styles.iconeArea}>
        <View style={styles.iconeCirculo}>
          <Ionicons name="checkmark" size={48} color="white" />
        </View>
        <Text style={styles.titulo}>Prioridade registrada!</Text>
        <Text style={styles.subtitulo}>
          O trecho foi movido para o topo do cronograma de corte.
        </Text>
      </View>

      {/* Resumo do trecho priorizado */}
      {trecho && (
        <View style={styles.resumoCard}>
          <Text style={styles.resumoTitulo}>Trecho priorizado</Text>

          <View style={styles.resumoLinha}>
            <Ionicons name="navigate-outline" size={16} color="#0B5C46" />
            <Text style={styles.resumoLabel}>Rodovia</Text>
            <Text style={styles.resumoValor}>{trecho.rodovia} · {trecho.nomeRodovia}</Text>
          </View>

          <View style={styles.resumoLinha}>
            <Ionicons name="location-outline" size={16} color="#0B5C46" />
            <Text style={styles.resumoLabel}>Trecho</Text>
            <Text style={styles.resumoValor}>{trecho.km} · {trecho.sentido}</Text>
          </View>

          <View style={styles.resumoLinha}>
            <Ionicons name="resize-outline" size={16} color="#D64545" />
            <Text style={styles.resumoLabel}>Altura</Text>
            <Text style={[styles.resumoValor, { color: '#D64545', fontWeight: 'bold' }]}>
              {trecho.alturaAtual} cm (limite: {trecho.limite} cm)
            </Text>
          </View>

          <View style={styles.resumoLinha}>
            <Ionicons name="calendar-outline" size={16} color="#1E5AA8" />
            <Text style={styles.resumoLabel}>Corte em</Text>
            <Text style={[styles.resumoValor, { color: '#1E5AA8' }]}>Próximo dia útil disponível</Text>
          </View>

          {/* Equipe alocada */}
          <View style={styles.equipeCard}>
            <Ionicons name="people" size={18} color="#1F9D66" />
            <Text style={styles.equipeTexto}>Equipe A alocada para execução</Text>
          </View>
        </View>
      )}

      {/* Próximos passos */}
      <View style={styles.proximosCard}>
        <Text style={styles.proximosTitulo}>Próximos passos</Text>
        <View style={styles.passoItem}>
          <View style={styles.passoBullet}>
            <Text style={styles.passoBulletTexto}>1</Text>
          </View>
          <Text style={styles.passoTexto}>Supervisor será notificado do reordenamento</Text>
        </View>
        <View style={styles.passoItem}>
          <View style={styles.passoBullet}>
            <Text style={styles.passoBulletTexto}>2</Text>
          </View>
          <Text style={styles.passoTexto}>Equipe receberá atualização no app de campo</Text>
        </View>
        <View style={styles.passoItem}>
          <View style={styles.passoBullet}>
            <Text style={styles.passoBulletTexto}>3</Text>
          </View>
          <Text style={styles.passoTexto}>Execução registrada e monitorada em tempo real</Text>
        </View>
      </View>

      {/* Botão voltar ao Dashboard */}
      <TouchableOpacity style={styles.botaoVoltar} onPress={voltarDashboard}>
        <Ionicons name="grid-outline" size={20} color="white" />
        <Text style={styles.botaoVoltarTexto}>Voltar ao Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
    padding: 20,
    justifyContent: 'center',
    gap: 16,
  },
  iconeArea: {
    alignItems: 'center',
    gap: 10,
  },
  iconeCirculo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1F9D66',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0B5C46',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 14,
    color: '#607D8B',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  resumoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    elevation: 2,
  },
  resumoTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#607D8B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  resumoLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resumoLabel: {
    fontSize: 12,
    color: '#9E9E9E',
    width: 60,
  },
  resumoValor: {
    fontSize: 13,
    color: '#263238',
    flex: 1,
  },
  equipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F6EF',
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
  },
  equipeTexto: {
    fontSize: 13,
    color: '#0B5C46',
    fontWeight: '600',
  },
  proximosCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    gap: 10,
    elevation: 2,
  },
  proximosTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#607D8B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  passoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  passoBullet: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#0B5C46',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  passoBulletTexto: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  passoTexto: {
    fontSize: 13,
    color: '#455A64',
    flex: 1,
    lineHeight: 18,
  },
  botaoVoltar: {
    backgroundColor: '#0B5C46',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 3,
  },
  botaoVoltarTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
