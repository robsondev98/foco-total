import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

const SettingsScreen = () => {
  const [reminders, setReminders] = useState(true);
  const [limitAlerts, setLimitAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [socialLimit, setSocialLimit] = useState(2);
  const [focusGoal, setFocusGoal] = useState(6);

  const SettingRow = ({ name, desc, value, onChange }: any) => (
    <View style={st.settingRow}>
      <View style={{ flex: 1 }}>
        <Text style={st.settingName}>{name}</Text>
        <Text style={st.settingDesc}>{desc}</Text>
      </View>
      <Switch value={value} onValueChange={onChange}
        trackColor={{ false: 'rgba(255,255,255,0.1)', true: '#6C63FF' }} thumbColor="#FFF" />
    </View>
  );

  return (
    <LinearGradient colors={['#1A1A2E', '#16213E']} style={{ flex: 1 }}>
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>

        <View style={st.header}>
          <LinearGradient colors={['#E94560', '#6C63FF']} style={st.headerIcon}>
            <Ionicons name="settings" size={20} color="#FFF" />
          </LinearGradient>
          <View style={{ marginLeft: 12 }}>
            <Text style={st.title}>FOCO TOTAL</Text>
            <Text style={st.subtitle}>Configurações</Text>
          </View>
        </View>

        {/* Apps Bloqueados */}
        <View style={st.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={st.iconBox}>
                <Ionicons name="shield-outline" size={20} color="#6C63FF" />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={st.cardTitle}>Apps Bloqueados</Text>
                <Text style={st.cardSub}>3 de 5 apps bloqueados</Text>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.8}>
              <LinearGradient colors={['#E94560', '#6C63FF']} style={st.addBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#FFF' }}>+ Adicionar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={st.tipBox}>
            <Ionicons name="bulb-outline" size={18} color="#6C63FF" />
            <Text style={st.tipText}>Dica: Bloqueie apps durante horários de trabalho para aumentar sua produtividade</Text>
          </View>
        </View>

        {/* Notificações */}
        <View style={st.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
            <View style={st.iconBox}>
              <Ionicons name="notifications-outline" size={20} color="#E94560" />
            </View>
            <Text style={[st.cardTitle, { marginLeft: 12 }]}>Notificações</Text>
          </View>
          <SettingRow name="Lembretes de Pausa" desc="A cada 60 minutos" value={reminders} onChange={setReminders} />
          <SettingRow name="Alertas de Limite" desc="Quando exceder o tempo" value={limitAlerts} onChange={setLimitAlerts} />
          <SettingRow name="Resumo Diário" desc="Às 20:00" value={dailySummary} onChange={setDailySummary} />
        </View>

        {/* Metas */}
        <View style={st.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <View style={st.iconBox}>
              <Ionicons name="trophy-outline" size={20} color="#27AE60" />
            </View>
            <Text style={[st.cardTitle, { marginLeft: 12 }]}>Metas e Limites</Text>
          </View>

          <View style={st.sliderSection}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={st.settingName}>Limite diário de redes sociais</Text>
              <Text style={st.sliderValue}>{socialLimit}h</Text>
            </View>
            <Slider style={{ height: 40, marginHorizontal: -4 }} minimumValue={1} maximumValue={8} step={1}
              value={socialLimit} onValueChange={setSocialLimit}
              minimumTrackTintColor="#6C63FF" maximumTrackTintColor="rgba(255,255,255,0.1)" thumbTintColor="#6C63FF" />
          </View>

          <View style={st.sliderSection}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={st.settingName}>Meta de sessões de foco</Text>
              <Text style={st.sliderValue}>{focusGoal}/dia</Text>
            </View>
            <Slider style={{ height: 40, marginHorizontal: -4 }} minimumValue={1} maximumValue={12} step={1}
              value={focusGoal} onValueChange={setFocusGoal}
              minimumTrackTintColor="#E94560" maximumTrackTintColor="rgba(255,255,255,0.1)" thumbTintColor="#E94560" />
          </View>
        </View>

        {/* Sobre */}
        <View style={st.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
            <View style={st.iconBox}>
              <Ionicons name="information-circle-outline" size={20} color="#AAA" />
            </View>
            <Text style={[st.cardTitle, { marginLeft: 12 }]}>Sobre</Text>
          </View>
          <Text style={{ color: '#666', fontSize: 13, lineHeight: 20 }}>Foco Total v1.0.0{'\n'}Seu assistente de bem-estar digital.</Text>
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </LinearGradient>
  );
};

const st = StyleSheet.create({
  scroll: { flex: 1, padding: 20 },
  header: { marginTop: 44, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
  headerIcon: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFF', letterSpacing: 2 },
  subtitle: { fontSize: 12, color: '#AAA' },
  card: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  iconBox: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
  cardSub: { fontSize: 12, color: '#888', marginTop: 2 },
  addBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  tipBox: { backgroundColor: 'rgba(108,99,255,0.1)', padding: 12, borderRadius: 10, flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, borderColor: 'rgba(108,99,255,0.2)' },
  tipText: { fontSize: 12, color: '#AAA', marginLeft: 10, flex: 1, lineHeight: 18 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  settingName: { fontSize: 15, fontWeight: '600', color: '#DDD' },
  settingDesc: { fontSize: 12, color: '#666', marginTop: 2 },
  sliderSection: { marginBottom: 20 },
  sliderValue: { fontWeight: 'bold', color: '#6C63FF', fontSize: 15 },
});

export default SettingsScreen;
