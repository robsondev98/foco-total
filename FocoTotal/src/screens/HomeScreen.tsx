import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import FocusLockService from '../services/FocusLockService';
import FocusLockScreen from './FocusLockScreen';

interface AppBlock {
  id: string; name: string; icon: string; packageName: string; timeRange: string; isActive: boolean;
}

const FOCUS_DURATIONS = [
  { label: '25 min', value: 25 * 60 },
  { label: '45 min', value: 45 * 60 },
  { label: '60 min', value: 60 * 60 },
];

const DEFAULT_APPS: AppBlock[] = [
  { id: '1', name: 'Instagram', icon: 'logo-instagram', packageName: 'com.instagram.android', timeRange: '08:00–18:00', isActive: true },
  { id: '2', name: 'TikTok', icon: 'musical-notes', packageName: 'com.zhiliaoapp.musically', timeRange: '08:00–18:00', isActive: true },
  { id: '3', name: 'Facebook', icon: 'logo-facebook', packageName: 'com.facebook.katana', timeRange: '09:00–17:00', isActive: false },
  { id: '4', name: 'Twitter/X', icon: 'logo-twitter', packageName: 'com.twitter.android', timeRange: '08:00–18:00', isActive: false },
  { id: '5', name: 'YouTube', icon: 'logo-youtube', packageName: 'com.google.android.youtube', timeRange: '20:00–22:00', isActive: false },
];

export default function HomeScreen() {
  const { completedFocusSessions, focusGoal, addFocusSession } = useApp();
  const [selectedDuration, setSelectedDuration] = useState(FOCUS_DURATIONS[0].value);
  const [seconds, setSeconds] = useState(FOCUS_DURATIONS[0].value);
  const [isRunning, setIsRunning] = useState(false);
  const [apps, setApps] = useState<AppBlock[]>(DEFAULT_APPS);
  const [lockVisible, setLockVisible] = useState(false);
  const [secondsAway, setSecondsAway] = useState(0);
  const [detectedApp, setDetectedApp] = useState<string | undefined>();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds(p => p - 1), 1000);
    } else if (seconds === 0 && isRunning) { handleComplete(); }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, seconds]);

  useEffect(() => {
    const unsub = FocusLockService.onReturn((away) => { setSecondsAway(away); setLockVisible(true); });
    return unsub;
  }, []);

  useEffect(() => {
    if (isRunning) { FocusLockService.startSession(apps.filter(a => a.isActive).map(a => a.name)); }
    else { FocusLockService.endSession(); setLockVisible(false); }
  }, [isRunning]);

  const handleComplete = () => {
    setIsRunning(false);
    const mins = Math.round(selectedDuration / 60);
    addFocusSession(mins);
    Alert.alert('Sessão concluída!', `${mins} minutos de foco registrados.`, [{ text: 'Ótimo!', onPress: reset }]);
  };

  const reset = () => { setIsRunning(false); setSeconds(selectedDuration); };
  const selectDuration = (val: number) => { if (isRunning) return; setSelectedDuration(val); setSeconds(val); };
  const toggleApp = (id: string) => setApps(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const timerPct = ((selectedDuration - seconds) / selectedDuration) * 100;
  const activeCount = apps.filter(a => a.isActive).length;
  const progressPct = Math.min((completedFocusSessions / focusGoal) * 100, 100);

  const getInsight = () => {
    const r = completedFocusSessions / focusGoal;
    if (r >= 1) return 'Parabéns! Você atingiu sua meta de foco hoje!';
    if (r >= 0.75) return 'Ótimo trabalho! Mais uma sessão e você chega lá.';
    if (r >= 0.5) return 'Bom progresso! Continue focado.';
    return 'Inicie uma sessão agora. Cada bloco de foco conta!';
  };

  const openSystemBlocker = () => {
    if (Platform.OS === 'android') Linking.openURL('content://com.android.settings.DIGITAL_WELLBEING').catch(() => Linking.openSettings());
    else Linking.openURL('App-Prefs:SCREEN_TIME').catch(() => Linking.openSettings());
  };

  return (
    <>
      <LinearGradient colors={['#1A1A2E', '#16213E']} style={st.gradient}>
        <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={st.header}>
            <LinearGradient colors={['#E94560', '#6C63FF']} style={st.headerIcon}>
              <Ionicons name="bulb" size={22} color="#FFF" />
            </LinearGradient>
            <View style={{ marginLeft: 12 }}>
              <Text style={st.title}>FOCO TOTAL</Text>
              <Text style={st.subtitle}>Bem-estar digital</Text>
            </View>
            {isRunning && (
              <View style={st.liveBadge}>
                <View style={st.liveDot} />
                <Text style={st.liveText}>ATIVO</Text>
              </View>
            )}
          </View>

          {/* Progresso */}
          <View style={st.card}>
            <View style={st.cardHeader}>
              <Ionicons name="trophy-outline" size={20} color="#E94560" />
              <Text style={st.cardTitle}>Progresso do dia</Text>
            </View>
            <View style={st.progressRow}>
              <Text style={st.progressBig}>{completedFocusSessions}<Text style={st.progressSmall}> / {focusGoal}</Text></Text>
              <Text style={st.progressPct}>{Math.round(progressPct)}%</Text>
            </View>
            <View style={st.barBg}>
              <LinearGradient colors={['#E94560', '#6C63FF']} style={[st.barFill, { width: `${progressPct}%` as any }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
            </View>
          </View>

          {/* Timer */}
          <View style={[st.card, isRunning && st.cardActive]}>
            <View style={st.cardHeader}>
              <Ionicons name="alarm-outline" size={20} color={isRunning ? '#E94560' : '#6C63FF'} />
              <Text style={st.cardTitle}>Sessão de foco</Text>
              {isRunning && <Text style={st.liveSub}>monitorando saída</Text>}
            </View>

            {!isRunning && (
              <View style={st.durRow}>
                {FOCUS_DURATIONS.map(d => (
                  <TouchableOpacity key={d.value} onPress={() => selectDuration(d.value)}
                    style={[st.durBtn, selectedDuration === d.value && st.durBtnOn]}>
                    <Text style={[st.durTxt, selectedDuration === d.value && st.durTxtOn]}>{d.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={st.timerWrap}>
              <Text style={[st.timerNum, isRunning && st.timerNumOn]}>{fmt(seconds)}</Text>
              {isRunning && (
                <View style={st.timerBarBg}>
                  <LinearGradient colors={['#E94560', '#6C63FF']} style={[st.timerBarFill, { width: `${timerPct}%` as any }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
                </View>
              )}
            </View>

            <View style={st.btnRow}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => setIsRunning(r => !r)} activeOpacity={0.85}>
                <LinearGradient
                  colors={isRunning ? ['#E74C3C', '#C0392B'] : ['#E94560', '#6C63FF']}
                  style={st.actionBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Ionicons name={isRunning ? 'stop' : 'play'} size={20} color="#FFF" />
                  <Text style={st.actionBtnTxt}>{isRunning ? '  Parar sessão' : '  Iniciar foco'}</Text>
                </LinearGradient>
              </TouchableOpacity>
              {!isRunning && (
                <TouchableOpacity style={st.resetBtn} onPress={reset}>
                  <Ionicons name="refresh" size={20} color="#AAA" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Apps */}
          <View style={st.card}>
            <View style={st.cardHeader}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#6C63FF" />
              <Text style={st.cardTitle}>Apps monitorados</Text>
              <View style={[st.badge, activeCount > 0 && st.badgeOn]}>
                <Text style={[st.badgeTxt, activeCount > 0 && st.badgeTxtOn]}>{activeCount} ativo{activeCount !== 1 ? 's' : ''}</Text>
              </View>
            </View>

            {apps.map(app => (
              <View key={app.id} style={[st.appRow, app.isActive && st.appRowOn]}>
                <View style={st.appInfo}>
                  <View style={[st.appIcon, app.isActive && st.appIconOn]}>
                    <Ionicons name={app.icon as any} size={18} color={app.isActive ? '#E94560' : '#888'} />
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={st.appName}>{app.name}</Text>
                    <Text style={st.appTime}>{app.timeRange}</Text>
                  </View>
                </View>
                <Switch value={app.isActive} onValueChange={() => toggleApp(app.id)}
                  trackColor={{ false: '#333', true: '#6C63FF' }} thumbColor="#FFF" />
              </View>
            ))}

            <TouchableOpacity style={st.sysBtn} onPress={openSystemBlocker}>
              <Ionicons name="settings-outline" size={15} color="#6C63FF" />
              <Text style={st.sysBtnTxt}>{Platform.OS === 'android' ? 'Abrir Bem-estar Digital' : 'Abrir Screen Time'}</Text>
              <Ionicons name="chevron-forward" size={14} color="#6C63FF" />
            </TouchableOpacity>
          </View>

          {/* Insight */}
          <LinearGradient colors={['#E94560', '#6C63FF']} style={st.insight} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Ionicons name="sparkles" size={16} color="#FFF" />
            <Text style={st.insightTxt}>{getInsight()}</Text>
          </LinearGradient>

          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>

      <FocusLockScreen
        visible={lockVisible} secondsAway={secondsAway} appName={detectedApp}
        onResume={() => { setLockVisible(false); setDetectedApp(undefined); if (!isRunning) setIsRunning(true); }}
        onAbandon={() => { setLockVisible(false); setDetectedApp(undefined); reset(); }}
      />
    </>
  );
}

const st = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: { flex: 1, padding: 20 },
  header: { marginTop: 44, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
  headerIcon: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFF', letterSpacing: 2 },
  subtitle: { fontSize: 12, color: '#AAA' },
  liveBadge: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(39,174,96,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, gap: 5 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#27AE60' },
  liveText: { fontSize: 11, fontWeight: 'bold', color: '#27AE60' },
  card: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  cardActive: { borderColor: '#E94560', borderWidth: 1.5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 8, flex: 1, color: '#FFF' },
  liveSub: { fontSize: 11, color: '#E94560', fontStyle: 'italic' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 },
  progressBig: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
  progressSmall: { fontSize: 16, color: '#AAA' },
  progressPct: { fontSize: 18, fontWeight: '600', color: '#E94560' },
  barBg: { height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  durRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  durBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center' },
  durBtnOn: { borderColor: '#6C63FF', backgroundColor: 'rgba(108,99,255,0.2)' },
  durTxt: { fontSize: 13, color: '#888', fontWeight: '500' },
  durTxtOn: { color: '#6C63FF' },
  timerWrap: { alignItems: 'center', marginBottom: 16 },
  timerNum: { fontSize: 64, fontWeight: 'bold', color: '#FFF', letterSpacing: 2 },
  timerNumOn: { color: '#E94560' },
  timerBarBg: { width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 8, overflow: 'hidden' },
  timerBarFill: { height: 4, borderRadius: 2 },
  btnRow: { flexDirection: 'row', gap: 10 },
  actionBtn: { flexDirection: 'row', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionBtnTxt: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  resetBtn: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  badge: { backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeOn: { backgroundColor: 'rgba(233,69,96,0.2)' },
  badgeTxt: { fontSize: 11, color: '#888', fontWeight: '600' },
  badgeTxtOn: { color: '#E94560' },
  appRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 12, marginBottom: 8, backgroundColor: 'rgba(255,255,255,0.05)' },
  appRowOn: { backgroundColor: 'rgba(233,69,96,0.1)' },
  appInfo: { flexDirection: 'row', alignItems: 'center' },
  appIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)', justifyContent: 'center', alignItems: 'center' },
  appIconOn: { backgroundColor: 'rgba(233,69,96,0.15)' },
  appName: { fontWeight: 'bold', fontSize: 14, color: '#FFF' },
  appTime: { fontSize: 11, color: '#888', marginTop: 1 },
  sysBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 14, marginTop: 4, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)' },
  sysBtnTxt: { flex: 1, color: '#6C63FF', fontSize: 13, fontWeight: '500' },
  insight: { borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  insightTxt: { flex: 1, color: '#FFF', fontSize: 14, fontStyle: 'italic', lineHeight: 20 },
});
