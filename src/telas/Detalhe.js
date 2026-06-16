import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getTrechoPorId, corDoStatus, labelDoStatus, fundoDoStatus } from '../dados';

export default function Detalhe() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();

  // Recebe o trechoId passado via navigation.navigate('Detalhe', { trechoId: '...' })
  const { trechoId } = route.params;
  const trecho = getTrechoPorId(trechoId);

  const [priorizando, setPriorizando] = useState(false);

  if (!trecho) {
    return (
      <View style={styles.erroContainer}>
        <Text style={styles.erroTexto}>Trecho não encontrado.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.erroVoltar}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cor = corDoStatus(trecho.status);
  const fundo = fundoDoStatus(trecho.status);
  const label = labelDoStatus(trecho.status);

  // Valor máximo do histórico (para escalar a barra)
  const alturaMax = Math.max(...trecho.historico.map((h) => h.altura), 40);

  function handlePriorizar() {
    if (trecho.status === 'normal') {
      Alert.alert(
        'Trecho em dia',
        'Este trecho está dentro do limite normal. Deseja mesmo priorizar o corte?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sim, priorizar', onPress: () => confirmarPriorizacao() },
        ]
      );
    } else {
      confirmarPriorizacao();
    }
  }

  function confirmarPriorizacao() {
    setPriorizando(true);
    // Simula processamento (em app real, chamaria a API)
    setTimeout(() => {
      navigation.navigate('Confirmacao', { trechoId: trecho.id });
      setPriorizando(false);
    }, 600);
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Cabeçalho com botão voltar */}
      <View style={[styles.cabecalho, { borderBottomColor: cor }]}>
        <TouchableOpacity style={styles.voltarBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#0B5C46" />
        </TouchableOpacity>
        <View style={styles.cabecalhoTextos}>
          <Text style={styles.cabecalhoRodovia}>{trecho.rodovia} · {trecho.nomeRodovia}</Text>
          <Text style={styles.cabecalhoKm}>{trecho.km} · {trecho.sentido}</Text>
        </View>
        <View style={[styles.statusChip, { backgroundColor: fundo }]}>
          <Text style={[styles.statusTexto, { color: cor }]}>{label.toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.conteudo}>
        {/* Card de métricas principais */}
        <View style={[styles.metricasCard, { borderLeftColor: cor }]}>
          <View style={styles.metricaItem}>
            <Text style={[styles.metricaValor, { color: cor }]}>{trecho.alturaAtual} cm</Text>
            <Text style={styles.metricaLabel}>Altura atual</Text>
          </View>
          <View style={styles.divisor} />
          <View style={styles.metricaItem}>
            <Text style={[styles.metricaValor, { color: '#D64545' }]}>{trecho.limite} cm</Text>
            <Text style={styles.metricaLabel}>Limite</Text>
          </View>
          <View style={styles.divisor} />
          <View style={styles.metricaItem}>
            <Text style={[styles.metricaValor, { color: '#1E5AA8', fontSize: 14 }]}>
              {trecho.previsaoCorte}
            </Text>
            <Text style={styles.metricaLabel}>Previsão de corte</Text>
          </View>
        </View>

        {/* Informações do trecho */}
        <View style={styles.infoCard}>
          <InfoLinha icone="leaf-outline" rotulo="Vegetação" valor={trecho.tipoVegetacao} />
          <InfoLinha icone="cloud-outline" rotulo="Clima" valor={trecho.clima} />
          <InfoLinha icone="camera-outline" rotulo="Última vistoria" valor={trecho.ultimaColeta} />
          {trecho.observacao && (
            <InfoLinha icone="chatbubble-ellipses-outline" rotulo="Observação" valor={trecho.observacao} destaque />
          )}
        </View>

        {/* Histórico de crescimento */}
        <Text style={styles.secaoTitulo}>Histórico de crescimento</Text>
        <View style={styles.historicoCard}>
          {/* Linha de limite */}
          <View style={styles.limiteIndicador}>
            <View style={styles.linhaDasheada} />
            <Text style={styles.limiteLabel}>Limite 30 cm</Text>
          </View>

          <View style={styles.barrasContainer}>
            {trecho.historico.map((ponto, idx) => {
              const percentual = (ponto.altura / alturaMax) * 100;
              const corBarra = ponto.altura >= 30 ? '#D64545' : ponto.altura >= 25 ? '#F2B705' : '#1F9D66';
              return (
                <View key={idx} style={styles.barraGrupo}>
                  <Text style={[styles.barraValor, { color: corBarra }]}>{ponto.altura}</Text>
                  <View style={styles.barraEixo}>
                    <View
                      style={[styles.barraFill, { height: `${percentual}%`, backgroundColor: corBarra }]}
                    />
                  </View>
                  <Text style={styles.barraData}>{ponto.data}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Botão de priorizar */}
        <TouchableOpacity
          style={[styles.botaoPriorizar, priorizando && styles.botaoPriorizandoStyle]}
          onPress={handlePriorizar}
          disabled={priorizando}
        >
          {priorizando ? (
            <Text style={styles.botaoTexto}>Priorizando...</Text>
          ) : (
            <>
              <Ionicons name="arrow-up-circle-outline" size={20} color="white" />
              <Text style={styles.botaoTexto}>Priorizar no cronograma</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.rodape}>
          Dados coletados via vistoria quinzenal — Ciclo 12/2026
        </Text>
      </ScrollView>
    </View>
  );
}

// Componente simples para uma linha de informação
function InfoLinha({ icone, rotulo, valor, destaque }) {
  return (
    <View style={estilosInfo.linha}>
      <Ionicons name={icone} size={16} color={destaque ? '#D64545' : '#607D8B'} />
      <View style={estilosInfo.textos}>
        <Text style={estilosInfo.rotulo}>{rotulo}</Text>
        <Text style={[estilosInfo.valor, destaque && { color: '#D64545' }]}>{valor}</Text>
      </View>
    </View>
  );
}

const estilosInfo = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  textos: {
    flex: 1,
  },
  rotulo: {
    fontSize: 11,
    color: '#9E9E9E',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 1,
  },
  valor: {
    fontSize: 13,
    color: '#263238',
    lineHeight: 18,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
  },
  erroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  erroTexto: {
    fontSize: 16,
    color: '#607D8B',
  },
  erroVoltar: {
    fontSize: 15,
    color: '#1F9D66',
    fontWeight: 'bold',
  },
  cabecalho: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderBottomWidth: 3,
    elevation: 3,
  },
  voltarBtn: {
    padding: 4,
  },
  cabecalhoTextos: {
    flex: 1,
  },
  cabecalhoRodovia: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#263238',
  },
  cabecalhoKm: {
    fontSize: 12,
    color: '#607D8B',
  },
  statusChip: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusTexto: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  conteudo: {
    padding: 16,
    paddingBottom: 40,
  },
  metricasCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    borderLeftWidth: 4,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    elevation: 2,
  },
  metricaItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricaValor: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#263238',
  },
  metricaLabel: {
    fontSize: 11,
    color: '#607D8B',
    textAlign: 'center',
    marginTop: 3,
  },
  divisor: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  secaoTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#607D8B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  historicoCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  limiteIndicador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  linhaDasheada: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#D64545',
    borderStyle: 'dashed',
  },
  limiteLabel: {
    fontSize: 11,
    color: '#D64545',
    fontWeight: '600',
  },
  barrasContainer: {
    flexDirection: 'row',
    height: 110,
    alignItems: 'flex-end',
    gap: 12,
  },
  barraGrupo: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barraValor: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  barraEixo: {
    width: '60%',
    height: '80%',
    justifyContent: 'flex-end',
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barraFill: {
    width: '100%',
    borderRadius: 4,
  },
  barraData: {
    fontSize: 10,
    color: '#9E9E9E',
    marginTop: 4,
  },
  botaoPriorizar: {
    backgroundColor: '#0B5C46',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    elevation: 3,
    marginBottom: 16,
  },
  botaoPriorizandoStyle: {
    backgroundColor: '#607D8B',
  },
  botaoTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rodape: {
    fontSize: 11,
    color: '#B0BEC5',
    textAlign: 'center',
  },
});
