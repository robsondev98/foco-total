import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';

const GoalsScreen = () => {
  const { goals, addGoal, toggleGoal, deleteGoal } = useApp();
  const [newGoalText, setNewGoalText] = useState('');
  const [adding, setAdding] = useState(false);

  const completed = goals.filter(g => g.completed);
  const pending = goals.filter(g => !g.completed);
  const progress = goals.length > 0 ? Math.round((completed.length / goals.length) * 100) : 0;

  const handleAdd = () => {
    const text = newGoalText.trim();
    if (!text) return;
    addGoal(text); setNewGoalText(''); setAdding(false); Keyboard.dismiss();
  };

  const confirmDelete = (id: string, text: string) => {
    Alert.alert('Remover meta', `Deseja remover "${text}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => deleteGoal(id) },
    ]);
  };

  return (
    <LinearGradient colors={['#1A1A2E', '#16213E']} style={{ flex: 1 }}>
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        <View style={st.header}>
          <LinearGradient colors={['#E94560', '#6C63FF']} style={st.headerIcon}>
            <Ionicons name="flag" size={20} color="#FFF" />
          </LinearGradient>
          <View style={{ marginLeft: 12 }}>
            <Text style={st.title}>FOCO TOTAL</Text>
            <Text style={st.subtitle}>Suas metas diárias</Text>
          </View>
        </View>

        {/* Progresso */}
        <LinearGradient colors={['#E94560', '#6C63FF']} style={st.progressCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#FFF' }}>Progresso de hoje</Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>{completed.length} de {goals.length} metas</Text>
            </View>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#FFF' }}>{progress}%</Text>
            </View>
          </View>
          <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, overflow: 'hidden' }}>
            <View style={{ height: 8, backgroundColor: '#FFF', borderRadius: 4, width: `${progress}%` as any }} />
          </View>
          {progress === 100 && (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: 10, marginTop: 14 }}>
              <Ionicons name="trophy" size={16} color="#FFF" />
              <Text style={{ color: '#FFF', fontWeight: '600', marginLeft: 8, fontSize: 13 }}>Parabéns! Todas as metas concluídas!</Text>
            </View>
          )}
        </LinearGradient>

        {/* Adicionar */}
        <View style={st.card}>
          {adding ? (
            <View>
              <TextInput style={st.input} placeholder="Descreva sua meta..." placeholderTextColor="#666"
                value={newGoalText} onChangeText={setNewGoalText} autoFocus multiline maxLength={120} />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
                <TouchableOpacity onPress={() => { setAdding(false); setNewGoalText(''); }} style={st.cancelBtn}>
                  <Text style={{ color: '#AAA', fontWeight: '600' }}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAdd} disabled={!newGoalText.trim()} activeOpacity={0.85}>
                  <LinearGradient colors={['#E94560', '#6C63FF']} style={st.saveBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text style={{ color: '#FFF', fontWeight: '600' }}>Salvar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setAdding(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="add-circle" size={22} color="#6C63FF" />
              <Text style={{ fontSize: 15, color: '#6C63FF', fontWeight: '600' }}>Adicionar nova meta</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Pendentes */}
        {pending.length > 0 && (
          <View style={st.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Ionicons name="ellipse-outline" size={18} color="#888" />
              <Text style={[st.sectionTitle, { marginLeft: 6 }]}>Pendentes ({pending.length})</Text>
            </View>
            {pending.map(goal => (
              <GoalItem key={goal.id} goal={goal} onToggle={() => toggleGoal(goal.id)} onDelete={() => confirmDelete(goal.id, goal.text)} />
            ))}
          </View>
        )}

        {/* Concluídas */}
        {completed.length > 0 && (
          <View style={st.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Ionicons name="checkmark-circle" size={18} color="#27AE60" />
              <Text style={[st.sectionTitle, { marginLeft: 6 }]}>Concluídas ({completed.length})</Text>
            </View>
            {completed.map(goal => (
              <GoalItem key={goal.id} goal={goal} onToggle={() => toggleGoal(goal.id)} onDelete={() => confirmDelete(goal.id, goal.text)} />
            ))}
          </View>
        )}

        {goals.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 50 }}>
            <Ionicons name="flag-outline" size={48} color="#444" />
            <Text style={{ fontSize: 16, color: '#555', marginTop: 12 }}>Nenhuma meta ainda.</Text>
            <Text style={{ fontSize: 13, color: '#444', marginTop: 4 }}>Adicione sua primeira meta acima!</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
};

const GoalItem = ({ goal, onToggle, onDelete }: { goal: { id: string; text: string; completed: boolean }; onToggle: () => void; onDelete: () => void }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' }, goal.completed && { opacity: 0.55 }]}>
    <TouchableOpacity onPress={onToggle} style={{ padding: 4 }}>
      <Ionicons name={goal.completed ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={goal.completed ? '#27AE60' : '#555'} />
    </TouchableOpacity>
    <TouchableOpacity onPress={onToggle} style={{ flex: 1, marginHorizontal: 10 }}>
      <Text style={{ fontSize: 14, color: goal.completed ? '#666' : '#DDD', lineHeight: 20, textDecorationLine: goal.completed ? 'line-through' : 'none' }}>{goal.text}</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onDelete} style={{ padding: 6 }}>
      <Ionicons name="trash-outline" size={18} color="#555" />
    </TouchableOpacity>
  </View>
);

const st = StyleSheet.create({
  scroll: { flex: 1, padding: 20 },
  header: { marginTop: 44, marginBottom: 20, flexDirection: 'row', alignItems: 'center' },
  headerIcon: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FFF', letterSpacing: 2 },
  subtitle: { fontSize: 12, color: '#AAA' },
  progressCard: { borderRadius: 20, padding: 20, marginBottom: 16 },
  card: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#888' },
  input: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 14, fontSize: 14, color: '#FFF', minHeight: 70, textAlignVertical: 'top', marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.05)' },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.08)' },
  saveBtn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
});

export default GoalsScreen;
