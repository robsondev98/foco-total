import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  return (
    <LinearGradient colors={['#1A1A2E', '#16213E', '#0F3460']} style={styles.gradient}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.inner}>
          <View style={styles.logoWrapper}>
            <LinearGradient colors={['#E94560', '#6C63FF']} style={styles.logoGradient}>
              <Ionicons name="key" size={48} color="#FFF" />
            </LinearGradient>
            <Text style={styles.appName}>FOCO TOTAL</Text>
            <Text style={styles.appSub}>Recuperar senha</Text>
          </View>

          <View style={styles.card}>
            {step === 1 ? (
              <>
                <Text style={styles.cardTitle}>Esqueceu a senha?</Text>
                <Text style={styles.cardDesc}>Informe seu email para receber o código de recuperação.</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color="#6C63FF" style={styles.icon} />
                  <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#999"
                    value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                </View>
                <TouchableOpacity onPress={() => setStep(2)} activeOpacity={0.85}>
                  <LinearGradient colors={['#E94560', '#6C63FF']} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text style={styles.btnText}>Enviar código</Text>
                    <Ionicons name="send" size={18} color="#FFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.cardTitle}>Código enviado!</Text>
                <Text style={styles.cardDesc}>Digite o código de 6 dígitos enviado para {email}.</Text>
                <View style={styles.codeBox}>
                  <TextInput style={styles.codeInput} placeholder="_ _ _ _ _ _" placeholderTextColor="#CCC"
                    maxLength={6} keyboardType="number-pad" value={code} onChangeText={setCode} />
                </View>
                <TouchableOpacity onPress={() => Alert.alert('Sucesso', 'Senha redefinida!')} activeOpacity={0.85}>
                  <LinearGradient colors={['#E94560', '#6C63FF']} style={styles.btn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text style={styles.btnText}>Confirmar</Text>
                    <Ionicons name="checkmark-circle-outline" size={18} color="#FFF" />
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setStep(1)} style={styles.resendBtn}>
                  <Text style={styles.resendText}>Reenviar código</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.footer}>
              <Text style={styles.footerText}>Lembrei a senha! </Text>
              <Text style={styles.footerLink}>Entrar</Text>
            </TouchableOpacity>
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
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A2E', marginBottom: 8 },
  cardDesc: { fontSize: 13, color: '#888', marginBottom: 22, lineHeight: 20 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F4F4FF',
    borderRadius: 14, borderWidth: 1.5, borderColor: '#E0DEFF',
    paddingHorizontal: 14, height: 54, marginBottom: 20,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#222' },
  codeBox: {
    backgroundColor: '#F4F4FF', borderRadius: 14, borderWidth: 1.5, borderColor: '#E0DEFF',
    height: 64, justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  codeInput: { fontSize: 28, letterSpacing: 8, fontWeight: 'bold', color: '#6C63FF' },
  btn: { height: 54, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  btnText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },
  resendBtn: { alignItems: 'center', marginTop: 16 },
  resendText: { color: '#6C63FF', fontSize: 13, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  footerText: { color: '#888', fontSize: 14 },
  footerLink: { color: '#6C63FF', fontSize: 14, fontWeight: 'bold' },
});

export default ForgotPasswordScreen;
