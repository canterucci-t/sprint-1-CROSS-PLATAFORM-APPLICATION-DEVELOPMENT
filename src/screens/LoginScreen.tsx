import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { PerfilUsuario } from '../types';

const PERFIS: { label: string; value: PerfilUsuario; icon: keyof typeof Ionicons.glyphMap; desc: string }[] = [
  { label: 'Operador de Vistoria', value: 'operador', icon: 'car-outline', desc: 'Coleta quinzenal em campo' },
  { label: 'Supervisor', value: 'supervisor', icon: 'person-circle-outline', desc: 'Análise, alertas e cronograma' },
  { label: 'Gestor', value: 'gestor', icon: 'bar-chart-outline', desc: 'Indicadores e relatórios' },
];

export default function LoginScreen() {
  const { login } = useApp();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('carlos@motiva.com.br');
  const [senha, setSenha] = useState('motiva2026');
  const [perfil, setPerfil] = useState<PerfilUsuario>('supervisor');
  const [loading, setLoading] = useState(false);
  const [showSenha, setShowSenha] = useState(false);

  const handleLogin = () => {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Informe seu e-mail corporativo.');
      return;
    }
    if (!senha.trim()) {
      Alert.alert('Atenção', 'Informe sua senha.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const ok = login(email.trim(), perfil);
      setLoading(false);
      if (!ok) {
        Alert.alert('Acesso negado', 'Credenciais inválidas. Verifique e-mail e perfil.');
      }
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoIcon}>
            <Ionicons name="leaf" size={36} color={COLORS.white} />
          </View>
          <Text style={styles.appName}>Monitoramento{'\n'}Inteligente de Grama</Text>
          <Text style={styles.appSub}>Visão computacional e previsão de corte</Text>
          <View style={styles.motivaBadge}>
            <Text style={styles.motivaText}>CCR Motiva</Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.formTitle}>Acesso ao sistema</Text>

          <Text style={styles.label}>E-mail corporativo</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@motiva.com.br"
              placeholderTextColor={COLORS.gray}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <Text style={styles.label}>Senha</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={18} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              placeholder="••••••••"
              placeholderTextColor={COLORS.gray}
              secureTextEntry={!showSenha}
            />
            <TouchableOpacity onPress={() => setShowSenha(!showSenha)} style={styles.eyeButton}>
              <Ionicons name={showSenha ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Perfil de acesso</Text>
          <View style={styles.perfilGrid}>
            {PERFIS.map((p) => (
              <TouchableOpacity
                key={p.value}
                style={[styles.perfilCard, perfil === p.value && styles.perfilCardSelected]}
                onPress={() => setPerfil(p.value)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={p.icon}
                  size={22}
                  color={perfil === p.value ? COLORS.white : COLORS.primary}
                />
                <Text style={[styles.perfilLabel, perfil === p.value && styles.perfilLabelSelected]}>
                  {p.label}
                </Text>
                <Text style={[styles.perfilDesc, perfil === p.value && { color: 'rgba(255,255,255,0.8)' }]}>
                  {p.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.btnEntrar, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.btnText}>Autenticando...</Text>
            ) : (
              <>
                <Text style={styles.btnText}>Entrar</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.versao}>Sprint 2 — Dados simulados para demonstração</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  content: {
    paddingHorizontal: 24,
    flexGrow: 1,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  appName: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '700',
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
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  motivaText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  form: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    marginBottom: 14,
    backgroundColor: COLORS.background,
  },
  inputIcon: {
    paddingLeft: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  perfilGrid: {
    gap: 8,
    marginBottom: 20,
  },
  perfilCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    gap: 10,
    backgroundColor: COLORS.background,
  },
  perfilCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  perfilLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  perfilLabelSelected: {
    color: COLORS.white,
  },
  perfilDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  btnEntrar: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  versao: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 20,
  },
});
