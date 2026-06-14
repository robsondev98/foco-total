import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const RegisterScreen = ({ navigation }: any) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const handleCadastro = () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }
    Alert.alert('Sucesso', 'Conta criada! Use o login admin para entrar.', [
      { text: 'OK', onPress: () => navigation.navigate('Login') },
    ]);
  };

  return (
    <LinearGradient colors={['#1A1A2E', '#16213E', '#0F3460']} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <ScrollView contentContainerStyle={styles.inner} showsVerticalScrollIndicator={false}>

          <View style={styles.logoWrapper}>
            <LinearGradient colors={['#E94560', '#6C63FF']} style={styles.logoGradient}>
              <Ionicons name="bulb" size={44} color="#FFF" />
            </LinearGradient>
            <Text style={styles.appName}>FOCO TOTAL</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Criar conta</Text>

            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color="#6C63FF" style={styles.icon} />
              <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#999"
                value={nome} onChangeText={setNome} />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#6C63FF" style={styles.icon} />
              <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999"
                value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color="#6C63FF" style={styles.icon} />
              <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#999"
                value={senha} onChangeText={setSenha} secureTextEntry />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="lock-open-outline" size={20} color="#6C63FF" style={styles.icon} />
              <TextInput style={styles.input} placeholder="Confirmar senha" placeholderTextColor="#999"
                value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry />
            </View>

            <TouchableOpacity onPress={handleCadastro} activeOpacity={0.85} style={{ marginTop: 8 }}>
              <LinearGradient colors={['#E94560', '#6C63FF']} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.btnText}>Cadastrar</Text>
                <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Já tem conta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Entrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  inner: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  logoWrapper: { alignItems: 'center', marginBottom: 28 },
  logoGradient: {
    width: 86, height: 86, borderRadius: 43, justifyContent: 'center', alignItems: 'center',
    elevation: 10, shadowColor: '#E94560', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10,
  },
  appName: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginTop: 12, letterSpacing: 3 },
  card: {
    backgroundColor: '#FFF', borderRadius: 24, padding: 28, width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 15,
  },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 22 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F4FF',
    borderRadius: 14, borderWidth: 1.5, borderColor: '#E0DEFF',
    paddingHorizontal: 14, height: 54, marginBottom: 14,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#222' },
  btn: { height: 54, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  footerText: { color: '#888', fontSize: 14 },
  footerLink: { color: '#6C63FF', fontSize: 14, fontWeight: 'bold' },
});

export default RegisterScreen;
