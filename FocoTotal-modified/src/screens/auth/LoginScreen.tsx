import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

const LoginScreen = ({ navigation, onLogin }: any) => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);

  const handleLogin = () => {
    if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
      if (onLogin) onLogin();
    } else {
      Alert.alert('Erro', 'Usuário ou senha incorretos!');
    }
  };

  return (
    <LinearGradient colors={['#1A1A2E', '#16213E', '#0F3460']} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.inner}>
          <View style={styles.logoWrapper}>
            <LinearGradient colors={['#E94560', '#6C63FF']} style={styles.logoGradient}>
              <Ionicons name="bulb" size={52} color="#FFF" />
            </LinearGradient>
            <Text style={styles.appName}>FOCO TOTAL</Text>
            <Text style={styles.appSub}>Bem-estar digital</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Entrar</Text>

            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#6C63FF" style={styles.icon} />
              <TextInput style={styles.input} placeholder="Usuário" placeholderTextColor="#999"
                value={usuario} onChangeText={setUsuario} autoCapitalize="none" />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#6C63FF" style={styles.icon} />
              <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#999"
                value={senha} onChangeText={setSenha} secureTextEntry={!showSenha} />
              <TouchableOpacity onPress={() => setShowSenha(v => !v)}>
                <Ionicons name={showSenha ? 'eye-off-outline' : 'eye-outline'} size={20} color="#999" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Esqueceu sua senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogin} activeOpacity={0.85}>
              <LinearGradient colors={['#E94560', '#6C63FF']} style={styles.loginBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.loginBtnText}>Entrar</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Não tem conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.footerLink}>Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  logoWrapper: { alignItems: 'center', marginBottom: 32 },
  logoGradient: {
    width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center',
    elevation: 12, shadowColor: '#E94560', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 12,
  },
  appName: { color: '#FFF', fontSize: 26, fontWeight: 'bold', marginTop: 14, letterSpacing: 3 },
  appSub: { color: '#AAA', fontSize: 13, marginTop: 4 },
  card: {
    backgroundColor: '#FFF', borderRadius: 24, padding: 28, width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 15,
  },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 24 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F4FF',
    borderRadius: 14, borderWidth: 1.5, borderColor: '#E0DEFF',
    paddingHorizontal: 14, height: 54, marginBottom: 14,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#222' },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { color: '#6C63FF', fontSize: 13, fontWeight: '600' },
  loginBtn: { height: 54, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  loginBtnText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  footerText: { color: '#888', fontSize: 14 },
  footerLink: { color: '#6C63FF', fontSize: 14, fontWeight: 'bold' },
});

export default LoginScreen;
