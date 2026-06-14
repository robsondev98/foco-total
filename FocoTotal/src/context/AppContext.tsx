import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  durationMinutes: number;
  completedAt: string;
}

interface AppContextData {
  // Configurações
  socialLimit: number;
  focusGoal: number;
  setSocialLimit: (val: number) => void;
  setFocusGoal: (val: number) => void;

  // Sessões de foco
  completedFocusSessions: number;
  sessionHistory: FocusSession[];
  addFocusSession: (durationMinutes: number) => void;

  // Metas diárias
  goals: Goal[];
  addGoal: (text: string) => void;
  toggleGoal: (id: string) => void;
  deleteGoal: (id: string) => void;

  // Uso de redes sociais (simulado)
  socialUsageToday: number;
  addSocialUsage: (minutes: number) => void;

  isLoading: boolean;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socialLimit, setSocialLimitState] = useState(2);
  const [focusGoal, setFocusGoalState] = useState(6);
  const [completedFocusSessions, setCompletedFocusSessions] = useState(0);
  const [sessionHistory, setSessionHistory] = useState<FocusSession[]>([]);
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', text: 'Passar menos de 2h em redes sociais', completed: false, createdAt: new Date().toISOString() },
    { id: '2', text: 'Completar 4 sessões de foco', completed: false, createdAt: new Date().toISOString() },
    { id: '3', text: 'Não verificar o celular antes das 8h', completed: true, createdAt: new Date().toISOString() },
    { id: '4', text: 'Fazer uma pausa a cada hora', completed: true, createdAt: new Date().toISOString() },
  ]);
  const [socialUsageToday, setSocialUsageToday] = useState(87);
  const [isLoading, setIsLoading] = useState(true);

  // ─── Carregar dados persistidos ──────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      try {
        const [sl, fg, sessions, hist, savedGoals, social] = await Promise.all([
          AsyncStorage.getItem('@FocoTotal:socialLimit'),
          AsyncStorage.getItem('@FocoTotal:focusGoal'),
          AsyncStorage.getItem('@FocoTotal:sessions'),
          AsyncStorage.getItem('@FocoTotal:sessionHistory'),
          AsyncStorage.getItem('@FocoTotal:goals'),
          AsyncStorage.getItem('@FocoTotal:socialUsage'),
        ]);
        if (sl) setSocialLimitState(Number(sl));
        if (fg) setFocusGoalState(Number(fg));
        if (sessions) setCompletedFocusSessions(Number(sessions));
        if (hist) setSessionHistory(JSON.parse(hist));
        if (savedGoals) setGoals(JSON.parse(savedGoals));
        if (social) setSocialUsageToday(Number(social));
      } catch (e) {
        console.error('Erro ao carregar dados', e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // ─── Persistência de metas ────────────────────────────────────────────────────
  async function saveGoals(updated: Goal[]) {
    setGoals(updated);
    await AsyncStorage.setItem('@FocoTotal:goals', JSON.stringify(updated));
  }

  // ─── Funções públicas ─────────────────────────────────────────────────────────
  const setSocialLimit = async (val: number) => {
    setSocialLimitState(val);
    await AsyncStorage.setItem('@FocoTotal:socialLimit', val.toString());
  };

  const setFocusGoal = async (val: number) => {
    setFocusGoalState(val);
    await AsyncStorage.setItem('@FocoTotal:focusGoal', val.toString());
  };

  const addFocusSession = async (durationMinutes: number) => {
    const newSession: FocusSession = {
      id: generateId(),
      durationMinutes,
      completedAt: new Date().toISOString(),
    };
    const newCount = completedFocusSessions + 1;
    const newHistory = [newSession, ...sessionHistory].slice(0, 50);

    setCompletedFocusSessions(newCount);
    setSessionHistory(newHistory);

    await Promise.all([
      AsyncStorage.setItem('@FocoTotal:sessions', newCount.toString()),
      AsyncStorage.setItem('@FocoTotal:sessionHistory', JSON.stringify(newHistory)),
    ]);
  };

  const addGoal = (text: string) => {
    const newGoal: Goal = {
      id: generateId(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    saveGoals([...goals, newGoal]);
  };

  const toggleGoal = (id: string) => {
    saveGoals(goals.map(g => (g.id === id ? { ...g, completed: !g.completed } : g)));
  };

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter(g => g.id !== id));
  };

  const addSocialUsage = async (minutes: number) => {
    const updated = socialUsageToday + minutes;
    setSocialUsageToday(updated);
    await AsyncStorage.setItem('@FocoTotal:socialUsage', updated.toString());
  };

  return (
    <AppContext.Provider
      value={{
        socialLimit,
        focusGoal,
        setSocialLimit,
        setFocusGoal,
        completedFocusSessions,
        sessionHistory,
        addFocusSession,
        goals,
        addGoal,
        toggleGoal,
        deleteGoal,
        socialUsageToday,
        addSocialUsage,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
