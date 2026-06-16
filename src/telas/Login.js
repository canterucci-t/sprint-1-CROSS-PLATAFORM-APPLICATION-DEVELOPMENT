import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Perfis disponíveis no sistema
const PERFIS = [
  { valor: 'supervisor', label: 'Supervisor', descricao: 'Alertas, ranking e cronograma' },
  { valor: 'operador', label: 'Operador de Vistoria', descricao: 'Coleta quinzenal em campo' },
  { valor: 'gestor', label: 'Gestor', descricao: 'Indicadores e relatórios' },
];

export default function Login({ onLogin }) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('carlos@motiva.com.br');
  const [senha, setSenha] = useState('motiva2026');
  const [perfilSelecionado, setPerfilSelecionado] = useState('supervisor');

  function handleEntrar() {
    // Validação simples
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe seu e-mail.');
      return;
    }
    if (!senha.trim()) {
      Alert.alert('Atenção', 'Informe sua senha.');
      return;
    }
    // Chama a função de login passada pelo App.tsx
    onLogin({ email, perfil: perfilSelecionado });
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.conteudo, { paddingTop: insets.top + 40 }]}
      keyboardShouldPersistTaps="handled"
    >
      {/* Logo */}
      <View style={styles.logoArea}>
        <View style={styles.logoIcone}>
          <Ionicons name="leaf" size={36} color="white" />
        </View>
        <Text style={styles.appNome}>Monitoramento{'\n'}Inteligente de Grama</Text>
        <Text style={styles.appSub}>Visão computacional e previsão de corte</Text>
        <View style={styles.motivaBadge}>
          <Text style={styles.motivaTexto}>CCR Motiva</Text>
        </View>
      </View>

      {/* Formulário */}
      <View style={styles.formulario}>
        <Text style={styles.formTitulo}>Acesso ao sistema</Text>

        <Text style={styles.rotulo}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="seu@motiva.com.br"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.rotulo}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          placeholder="••••••••"
          secureTextEntry
        />

        <Text style={styles.rotulo}>Perfil de acesso</Text>
        {PERFIS.map((p) => (
          <TouchableOpacity
            key={p.valor}
            style={[
              styles.perfilCard,
              perfilSelecionado === p.valor && styles.perfilCardSelecionado,
            ]}
            onPress={() => setPerfilSelecionado(p.valor)}
          >
            <Text style={[
              styles.perfilLabel,
              perfilSelecionado === p.valor && styles.perfilLabelSelecionado,
            ]}>
              {p.label}
            </Text>
            <Text style={[
              styles.perfilDesc,
              perfilSelecionado === p.valor && { color: 'rgba(255,255,255,0.8)' },
            ]}>
              {p.descricao}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.botaoEntrar} onPress={handleEntrar}>
          <Text style={styles.botaoTexto}>Entrar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.rodape}>Sprint 2 — Dados simulados para demonstração</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B5C46',
  },
  conteudo: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcone: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1F9D66',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appNome: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 6,
  },
  appSub: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  motivaBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  motivaTexto: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  formulario: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
  },
  formTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#263238',
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 12,
    fontWeight: '600',
    color: '#607D8B',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#263238',
    backgroundColor: '#F6F8FA',
    marginBottom: 14,
  },
  perfilCard: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#F6F8FA',
  },
  perfilCardSelecionado: {
    backgroundColor: '#0B5C46',
    borderColor: '#0B5C46',
  },
  perfilLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#263238',
    marginBottom: 2,
  },
  perfilLabelSelecionado: {
    color: 'white',
  },
  perfilDesc: {
    fontSize: 12,
    color: '#607D8B',
  },
  botaoEntrar: {
    backgroundColor: '#1F9D66',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  botaoTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rodape: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 20,
  },
});
