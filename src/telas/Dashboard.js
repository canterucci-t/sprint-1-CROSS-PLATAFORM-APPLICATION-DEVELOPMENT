import React, { useState } from 'react';
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
import { trechos, alertas, corDoStatus, labelDoStatus, fundoDoStatus } from '../dados';

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Calcula os indicadores a partir dos dados mockados
  const qtdCorte = trechos.filter((t) => t.status === 'corte_necessario').length;
  const qtdAtencao = trechos.filter((t) => t.status === 'atencao').length;
  const qtdNormal = trechos.filter((t) => t.status === 'normal').length;
  const cortesSemana = trechos.filter((t) => t.diasAteCorte <= 7).length;

  // Trecho mais urgente (menor diasAteCorte)
  const trechoMaisUrgente = [...trechos].sort((a, b) => a.diasAteCorte - b.diasAteCorte)[0];

  // Alertas não lidos
  const alertasNaoLidos = alertas.filter((a) => !a.lido);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Cabeçalho */}
      <View style={styles.cabecalho}>
        <View style={styles.cabecalhoEsq}>
          <Ionicons name="leaf" size={22} color="white" />
          <View>
            <Text style={styles.saudacao}>Olá, Carlos 👋</Text>
            <Text style={styles.subtitulo}>Supervisor · Ciclo 12/2026</Text>
          </View>
        </View>
        <View style={styles.iconeBadge}>
          <Ionicons name="notifications-outline" size={22} color="white" />
          {alertasNaoLidos.length > 0 && (
            <View style={styles.badgeNotif}>
              <Text style={styles.badgeTexto}>{alertasNaoLidos.length}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.conteudo}>
        {/* Indicadores */}
        <Text style={styles.secaoTitulo}>Situação operacional</Text>

        <View style={styles.indicadoresGrid}>
          <View style={[styles.indicador, { borderLeftColor: '#D64545' }]}>
            <Ionicons name="warning-outline" size={20} color="#D64545" />
            <Text style={[styles.indicadorValor, { color: '#D64545' }]}>{qtdCorte}</Text>
            <Text style={styles.indicadorLabel}>Corte necessário</Text>
          </View>
          <View style={[styles.indicador, { borderLeftColor: '#F2B705' }]}>
            <Ionicons name="alert-circle-outline" size={20} color="#F2B705" />
            <Text style={[styles.indicadorValor, { color: '#F2B705' }]}>{qtdAtencao}</Text>
            <Text style={styles.indicadorLabel}>Em atenção</Text>
          </View>
          <View style={[styles.indicador, { borderLeftColor: '#1F9D66' }]}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#1F9D66" />
            <Text style={[styles.indicadorValor, { color: '#1F9D66' }]}>{qtdNormal}</Text>
            <Text style={styles.indicadorLabel}>Normal</Text>
          </View>
          <View style={[styles.indicador, { borderLeftColor: '#1E5AA8' }]}>
            <Ionicons name="cut-outline" size={20} color="#1E5AA8" />
            <Text style={[styles.indicadorValor, { color: '#1E5AA8' }]}>{cortesSemana}</Text>
            <Text style={styles.indicadorLabel}>Cortes na semana</Text>
          </View>
        </View>

        {/* Aviso do ciclo quinzenal */}
        <View style={styles.cicloCard}>
          <Ionicons name="time-outline" size={16} color="#0B5C46" />
          <Text style={styles.cicloTexto}>
            Vistoria quinzenal · Ciclo 12 · Próxima em <Text style={{ fontWeight: 'bold' }}>8 dias</Text>
          </Text>
        </View>

        {/* Trecho mais crítico */}
        <Text style={styles.secaoTitulo}>Trecho mais crítico agora</Text>
        <TouchableOpacity
          style={[styles.criticoCard, { borderLeftColor: corDoStatus(trechoMaisUrgente.status) }]}
          onPress={() => navigation.navigate('Detalhe', { trechoId: trechoMaisUrgente.id })}
        >
          <View style={styles.criticoCabecalho}>
            <Text style={styles.criticoRodovia}>
              {trechoMaisUrgente.rodovia} — {trechoMaisUrgente.km}
            </Text>
            <View style={[styles.chip, { backgroundColor: fundoDoStatus(trechoMaisUrgente.status) }]}>
              <Text style={[styles.chipTexto, { color: corDoStatus(trechoMaisUrgente.status) }]}>
                {labelDoStatus(trechoMaisUrgente.status).toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.criticoMetricas}>
            <View style={styles.metrica}>
              <Text style={[styles.metricaValor, { color: corDoStatus(trechoMaisUrgente.status) }]}>
                {trechoMaisUrgente.alturaAtual} cm
              </Text>
              <Text style={styles.metricaLabel}>Altura atual</Text>
            </View>
            <View style={styles.metrica}>
              <Text style={[styles.metricaValor, { color: '#D64545' }]}>30 cm</Text>
              <Text style={styles.metricaLabel}>Limite</Text>
            </View>
            <View style={styles.metrica}>
              <Text style={[styles.metricaValor, { color: '#D64545', fontSize: 14 }]}>
                {trechoMaisUrgente.previsaoCorte}
              </Text>
              <Text style={styles.metricaLabel}>Corte previsto</Text>
            </View>
          </View>
          <View style={styles.verDetalheLinha}>
            <Text style={styles.verDetalheTexto}>Ver detalhe completo</Text>
            <Ionicons name="arrow-forward" size={14} color="#0B5C46" />
          </View>
        </TouchableOpacity>

        {/* Botão ir ao Ranking */}
        <TouchableOpacity
          style={styles.botaoRanking}
          onPress={() => navigation.navigate('Ranking')}
        >
          <Ionicons name="podium-outline" size={18} color="white" />
          <Text style={styles.botaoRankingTexto}>Ver ranking de prioridades</Text>
          <Ionicons name="chevron-forward" size={16} color="white" />
        </TouchableOpacity>

        {/* Alertas recentes */}
        <Text style={styles.secaoTitulo}>Alertas recentes</Text>
        {alertas.map((alerta) => (
          <TouchableOpacity
            key={alerta.id}
            style={[styles.alertaItem, alerta.lido && { opacity: 0.5 }]}
            onPress={() => navigation.navigate('Detalhe', { trechoId: alerta.trechoId })}
          >
            <Ionicons
              name={alerta.tipo === 'Reincidência' ? 'repeat-outline' : 'warning-outline'}
              size={18}
              color={alerta.lido ? '#9E9E9E' : '#D64545'}
            />
            <View style={styles.alertaConteudo}>
              <Text style={styles.alertaTipo}>{alerta.tipo} · {alerta.data}</Text>
              <Text style={styles.alertaMensagem}>{alerta.mensagem}</Text>
            </View>
            {!alerta.lido && <View style={styles.dotNaoLido} />}
          </TouchableOpacity>
        ))}
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
    justifyContent: 'space-between',
  },
  cabecalhoEsq: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  saudacao: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
  },
  iconeBadge: {
    position: 'relative',
    padding: 4,
  },
  badgeNotif: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#D64545',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeTexto: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scroll: {
    flex: 1,
  },
  conteudo: {
    padding: 16,
    paddingBottom: 32,
  },
  secaoTitulo: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#607D8B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 6,
  },
  indicadoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  indicador: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    gap: 4,
    elevation: 2,
  },
  indicadorValor: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  indicadorLabel: {
    fontSize: 11,
    color: '#607D8B',
    textAlign: 'center',
  },
  cicloCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F6EF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F9D66',
  },
  cicloTexto: {
    fontSize: 13,
    color: '#0B5C46',
    flex: 1,
  },
  criticoCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 3,
  },
  criticoCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  criticoRodovia: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#263238',
  },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  chipTexto: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  criticoMetricas: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  metrica: {
    flex: 1,
    alignItems: 'center',
  },
  metricaValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#263238',
  },
  metricaLabel: {
    fontSize: 11,
    color: '#607D8B',
    marginTop: 2,
    textAlign: 'center',
  },
  verDetalheLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#E8F6EF',
    borderRadius: 8,
    paddingVertical: 8,
  },
  verDetalheTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B5C46',
  },
  botaoRanking: {
    backgroundColor: '#1F9D66',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    elevation: 3,
  },
  botaoRankingTexto: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  alertaItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  alertaConteudo: {
    flex: 1,
  },
  alertaTipo: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#607D8B',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  alertaMensagem: {
    fontSize: 13,
    color: '#263238',
    lineHeight: 17,
  },
  dotNaoLido: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D64545',
  },
});
