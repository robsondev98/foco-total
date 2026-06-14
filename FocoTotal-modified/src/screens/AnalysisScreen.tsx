import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';

const WEEKLY_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const WEEKLY_SOCIAL = [95, 120, 78, 60, 110, 145, 87];
const WEEKLY_FOCUS  = [4, 5, 6, 7, 3, 2, 4];

const APP_USAGE = [
  { name: 'Instagram', current: 45, limit: 30 },
  { name: 'TikTok',    current: 62, limit: 60 },
  { name: 'Facebook',  current: 18, limit: 30 },
  { name: 'Twitter/X', current: 25, limit: 30 },
  { name: 'YouTube',   current: 89, limit: 90 },
];

const Bar = ({ value, max, color }: { value: number; max: number; color: string }) => (
  <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
    <View style={{ height: 8, borderRadius: 4, width: `${Math.min((value / max) * 100, 100)}%`, backgroundColor: color }} />
  </View>
);

const WeeklyChart = ({ data, max, colors }: { data: number[]; max: number; colors: [string, string] }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 90, marginVertical: 10 }}>
    {data.map((v, i) => (
      <View key={i} style={{ flex: 1, alignItems: 'center' }}>
        <View style={{ flex: 1, width: '70%', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden', justifyContent: 'flex-end' }}>
          <LinearGradient colors={colors} style={{ width: '100%', height: `${Math.min((v / max) * 100, 100)}%`, borderRadius: 4 }} />
        </View>
        <Text style={{ fontSize: 10, color: '#888', marginTop: 4 }}>{WEEKLY_LABELS[i]}</Text>
      </View>
    ))}
  </View>
);

const AnalysisScreen = () => {
  const { completedFocusSessions, focusGoal, socialLimit, goals, socialUsageToday } = useApp();
  const [aiInsight, setAiInsight] = useState('');
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [insightError, setInsightError] = useState(false);
  const completedGoals = goals.filter(g => g.completed).length;
  const totalMinutesLimit = socialLimit * 60;

  const generateInsight = async () => {
    setLoadingInsight(true); setInsightError(false); setAiInsight('');
    const prompt = `Você é um assistente de bem-estar digital. O usuário tem os seguintes dados de hoje:\n- Sessões de foco completadas: ${completedFocusSessions} de ${focusGoal} (meta diária)\n- Tempo em redes sociais: ${socialUsageToday} minutos de ${totalMinutesLimit} permitidos\n- Metas concluídas: ${completedGoals} de ${goals.length}\n\nGere um insight personalizado, motivador e prático em 2 frases curtas em português. Seja direto e específico para esses números.`;
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 200, messages: [{ role: 'user', content: prompt }] }),
      });
      const data = await response.json();
      setAiInsight(data.content?.map((b: any) => b.text || '').join('').trim() ?? '');
    } catch { setInsightError(true); }
    finally { setLoadingInsight(false); }
  };

  useEffect(() => { generateInsight(); }, []);

  return (
    <LinearGradient colors={['#1A1A2E', '#16213E']} style={{ flex: 1 }}>
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>

        <View style={st.header}>
          <LinearGradient colors={['#E94560', '#6C63FF']} style={st.headerIcon}>
            <Ionicons name="bar-chart" size={20} color="#FFF" />
          </LinearGradient>
          <View style={{ marginLeft: 12 }}>
            <Text style={st.title}>FOCO TOTAL</Text>
            <Text style={st.subtitle}>Análise de bem-estar</Text>
          </View>
        </View>

        {/* Insight IA */}
        <View style={st.card}>
          <View style={st.cardHeader}>
            <Ionicons name="sparkles" size={20} color="#E94560" />
            <Text style={st.cardTitle}>Insight personalizado</Text>
            <TouchableOpacity onPress={generateInsight} disabled={loadingInsight} style={{ padding: 6 }}>
              <Ionicons name="refresh" size={16} color="#6C63FF" />
            </TouchableOpacity>
          </View>
          {loadingInsight ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10 }}>
              <ActivityIndicator color="#6C63FF" />
              <Text style={{ color: '#888', fontSize: 13 }}>Analisando seus dados...</Text>
            </View>
          ) : insightError ? (
            <Text style={{ color: '#E94560', fontSize: 13, textAlign: 'center', padding: 10 }}>Não foi possível carregar. Tente novamente.</Text>
          ) : (
            <LinearGradient colors={['rgba(233,69,96,0.15)', 'rgba(108,99,255,0.15)']} style={st.insightBox}>
              <Text style={st.insightText}>{aiInsight || '...'}</Text>
            </LinearGradient>
          )}
        </View>

        {/* Resumo */}
        <View style={st.card}>
          <View style={st.cardHeader}>
            <Ionicons name="today-outline" size={20} color="#6C63FF" />
            <Text style={st.cardTitle}>Resumo de hoje</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <LinearGradient colors={['rgba(108,99,255,0.3)', 'rgba(108,99,255,0.1)']} style={st.summaryBox}>
              <Text style={st.summaryValue}>{completedFocusSessions}</Text>
              <Text style={st.summaryLabel}>sessões de foco</Text>
            </LinearGradient>
            <LinearGradient colors={socialUsageToday > totalMinutesLimit ? ['rgba(233,69,96,0.3)', 'rgba(233,69,96,0.1)'] : ['rgba(39,174,96,0.3)', 'rgba(39,174,96,0.1)']} style={st.summaryBox}>
              <Text style={st.summaryValue}>{Math.floor(socialUsageToday / 60)}h {socialUsageToday % 60}m</Text>
              <Text style={st.summaryLabel}>em redes sociais</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Apps */}
        <View style={st.card}>
          <View style={st.cardHeader}>
            <Ionicons name="phone-portrait-outline" size={20} color="#6C63FF" />
            <Text style={st.cardTitle}>Tempo por aplicativo</Text>
          </View>
          <View style={st.totalBox}>
            <Text style={st.totalTime}>{socialUsageToday} min</Text>
            <Text style={{ color: '#888', marginTop: 4, fontSize: 12 }}>de {totalMinutesLimit} min permitidos</Text>
          </View>
          {APP_USAGE.map((app, i) => {
            const over = app.current > app.limit;
            return (
              <View key={i} style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ fontWeight: '600', fontSize: 14, color: '#FFF' }}>{app.name}</Text>
                  <Text style={{ fontSize: 12, color: over ? '#E94560' : '#888' }}>{app.current}min / {app.limit}min</Text>
                </View>
                <Bar value={app.current} max={app.limit * 1.2} color={over ? '#E94560' : '#6C63FF'} />
              </View>
            );
          })}
        </View>

        {/* Gráficos */}
        <View style={st.card}>
          <View style={st.cardHeader}>
            <Ionicons name="bar-chart-outline" size={20} color="#6C63FF" />
            <Text style={st.cardTitle}>Semana — redes sociais (min)</Text>
          </View>
          <WeeklyChart data={WEEKLY_SOCIAL} max={160} colors={['#E94560', '#FF6B8A']} />
          <View style={{ height: 16 }} />
          <Text style={[st.cardTitle, { marginLeft: 0, fontSize: 14 }]}>Semana — sessões de foco</Text>
          <WeeklyChart data={WEEKLY_FOCUS} max={10} colors={['#6C63FF', '#9D97FF']} />
        </View>

        {/* Metas */}
        <View style={st.card}>
          <View style={st.cardHeader}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#27AE60" />
            <Text style={st.cardTitle}>Metas do dia</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#27AE60' }}>{completedGoals}/{goals.length}</Text>
          </View>
          <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
            <LinearGradient colors={['#27AE60', '#2ECC71']} style={{ height: 8, borderRadius: 4, width: `${(completedGoals / Math.max(goals.length, 1)) * 100}%` as any }} />
          </View>
          {goals.map(goal => (
            <View key={goal.id} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
              <Ionicons name={goal.completed ? 'checkmark-circle' : 'ellipse-outline'} size={20} color={goal.completed ? '#27AE60' : '#555'} />
              <Text style={{ marginLeft: 10, fontSize: 14, color: goal.completed ? '#666' : '#DDD', flex: 1, textDecorationLine: goal.completed ? 'line-through' : 'none' }}>{goal.text}</Text>
            </View>
          ))}
        </View>

        <Text style={{ textAlign: 'center', color: '#6C63FF', fontSize: 12, marginVertical: 10 }}>💙 Cuide do seu bem-estar digital.</Text>
        <View style={{ height: 40 }} />
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 8, flex: 1, color: '#FFF' },
  insightBox: { padding: 14, borderRadius: 12 },
  insightText: { color: '#DDD', fontSize: 14, lineHeight: 22 },
  summaryBox: { flex: 1, padding: 16, borderRadius: 14, alignItems: 'center' },
  summaryValue: { fontSize: 26, fontWeight: 'bold', color: '#FFF' },
  summaryLabel: { fontSize: 11, color: '#AAA', marginTop: 4, textAlign: 'center' },
  totalBox: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 14, alignItems: 'center', marginBottom: 18 },
  totalTime: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
});

export default AnalysisScreen;
