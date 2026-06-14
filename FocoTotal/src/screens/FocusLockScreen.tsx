import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  secondsAway: number;
  /** Nome do app bloqueado (se identificado via NativeModule) */
  appName?: string;
  onResume: () => void;
  onAbandon: () => void;
}

const FocusLockScreen: React.FC<Props> = ({
  visible,
  secondsAway,
  appName,
  onResume,
  onAbandon,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: height, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const formatAway = (s: number): string => {
    if (s < 60) return `${s} segundo${s !== 1 ? 's' : ''}`;
    const m = Math.floor(s / 60);
    const rest = s % 60;
    if (rest === 0) return `${m} minuto${m !== 1 ? 's' : ''}`;
    return `${m}min ${rest}s`;
  };

  const getMessage = (): string => {
    if (secondsAway < 30) return 'Você saiu rapidinho. Ótimo autocontrole!';
    if (secondsAway < 120) return 'Você ficou distraído por um momento. Respira fundo e volta ao foco.';
    if (secondsAway < 300) return 'Alguns minutos se passaram. Cada sessão de foco conta — vamos retomar.';
    return 'Você ficou um bom tempo fora. Ainda dá tempo de resgatar essa sessão!';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => {/* impede fechar com botão voltar */}}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          {/* Ícone de alerta */}
          <View style={styles.iconWrapper}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-half-outline" size={44} color="#6C63FF" />
            </View>
          </View>

          {/* Título */}
          <Text style={styles.title}>Sessão de foco ativa</Text>

          {/* Tempo fora */}
          <View style={styles.awayBadge}>
            <Ionicons name="time-outline" size={16} color="#C0392B" />
            <Text style={styles.awayText}>
              Você ficou fora por{' '}
              <Text style={styles.awayHighlight}>{formatAway(secondsAway)}</Text>
            </Text>
          </View>

          {/* App detectado (se disponível) */}
          {appName && (
            <View style={styles.appBadge}>
              <Ionicons name="phone-portrait-outline" size={15} color="#666" />
              <Text style={styles.appBadgeText}>
                Detectado: <Text style={{ fontWeight: 'bold' }}>{appName}</Text>
              </Text>
            </View>
          )}

          {/* Mensagem motivacional */}
          <Text style={styles.message}>{getMessage()}</Text>

          {/* Estatísticas da sessão atual */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="flame-outline" size={20} color="#6C63FF" />
              <Text style={styles.statLabel}>Foco interrompido</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="trending-up-outline" size={20} color="#27AE60" />
              <Text style={styles.statLabel}>Você pode continuar</Text>
            </View>
          </View>

          {/* Botões de ação */}
          <TouchableOpacity style={styles.resumeBtn} onPress={onResume} activeOpacity={0.85}>
            <Ionicons name="play" size={20} color="#FFF" />
            <Text style={styles.resumeBtnText}>Voltar ao foco</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.abandonBtn} onPress={onAbandon} activeOpacity={0.7}>
            <Text style={styles.abandonBtnText}>Abandonar esta sessão</Text>
          </TouchableOpacity>

          {/* Dica de bloqueio real */}
          <View style={styles.tipRow}>
            <Ionicons name="information-circle-outline" size={14} color="#AAA" />
            <Text style={styles.tipText}>
              Para bloqueio total, ative o Bem-estar Digital nas configurações do seu celular.
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 48,
  },
  // Handle bar
  iconWrapper: { alignItems: 'center', marginBottom: 20, marginTop: 10 },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0EEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 16,
  },
  awayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: 'center',
    marginBottom: 10,
    gap: 6,
  },
  awayText: { color: '#555', fontSize: 14 },
  awayHighlight: { color: '#C0392B', fontWeight: 'bold' },

  appBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
    gap: 6,
  },
  appBadgeText: { color: '#555', fontSize: 13 },

  message: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 22,
    paddingHorizontal: 8,
  },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 6 },
  statDivider: { width: 1, backgroundColor: '#E0E0E0' },
  statLabel: { fontSize: 12, color: '#666', textAlign: 'center' },

  resumeBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  resumeBtnText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },

  abandonBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  abandonBtnText: { color: '#AAA', fontSize: 14 },

  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    paddingHorizontal: 4,
  },
  tipText: { flex: 1, fontSize: 11, color: '#BBB', lineHeight: 16 },
});

export default FocusLockScreen;
