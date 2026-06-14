import { AppState, AppStateStatus, BackHandler, Platform } from 'react-native';

export type ReturnCallback = (secondsAway: number) => void;

/**
 * FocusLockService — Nível 1 (JS puro, funciona no Expo)
 *
 * Responsabilidades:
 * - Saber se uma sessão de foco está ativa
 * - Detectar quando o usuário sai do app durante uma sessão
 * - Notificar a UI ao retornar (para mostrar FocusLockScreen)
 * - Bloquear o botão Voltar no Android durante o foco
 */
class FocusLockServiceClass {
  private _isSessionActive = false;
  private _blockedApps: string[] = [];
  private _departedAt: number | null = null;
  private _listeners: Set<ReturnCallback> = new Set();
  private _appStateSub: ReturnType<typeof AppState.addEventListener> | null = null;
  private _backHandlerSub: ReturnType<typeof BackHandler.addEventListener> | null = null;

  // ─── API pública ──────────────────────────────────────────────────────────────

  get isActive(): boolean {
    return this._isSessionActive;
  }

  get blockedApps(): string[] {
    return [...this._blockedApps];
  }

  get secondsAway(): number {
    if (!this._departedAt) return 0;
    return Math.floor((Date.now() - this._departedAt) / 1000);
  }

  /** Inicia uma sessão de foco e começa a monitorar saídas. */
  startSession(blockedApps: string[]) {
    this._isSessionActive = true;
    this._blockedApps = [...blockedApps];
    this._departedAt = null;
    this._registerAppState();
    this._registerBackHandler();
    console.log('[FocusLock] Sessão iniciada. Apps bloqueados:', blockedApps);
  }

  /** Encerra a sessão e remove todos os listeners. */
  endSession() {
    this._isSessionActive = false;
    this._blockedApps = [];
    this._departedAt = null;
    this._unregisterAppState();
    this._unregisterBackHandler();
    console.log('[FocusLock] Sessão encerrada.');
  }

  /**
   * Registra um callback que será chamado quando o usuário RETORNAR
   * ao app depois de ter saído durante uma sessão ativa.
   * Retorna uma função de cleanup.
   */
  onReturn(callback: ReturnCallback): () => void {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }

  // ─── Internos ─────────────────────────────────────────────────────────────────

  private _handleAppStateChange = (next: AppStateStatus) => {
    if (!this._isSessionActive) return;

    if (next === 'background' || next === 'inactive') {
      // Usuário saiu do app
      this._departedAt = Date.now();
      console.log('[FocusLock] Usuário saiu do app.');
    } else if (next === 'active' && this._departedAt !== null) {
      // Usuário voltou
      const away = Math.floor((Date.now() - this._departedAt) / 1000);
      console.log(`[FocusLock] Usuário voltou após ${away}s.`);
      this._listeners.forEach(cb => cb(away));
      this._departedAt = null;
    }
  };

  private _handleBackPress = (): boolean => {
    // Retorna true = consome o evento (não deixa sair)
    if (this._isSessionActive && Platform.OS === 'android') {
      console.log('[FocusLock] Botão voltar bloqueado durante sessão.');
      return true;
    }
    return false;
  };

  private _registerAppState() {
    this._unregisterAppState();
    this._appStateSub = AppState.addEventListener('change', this._handleAppStateChange);
  }

  private _unregisterAppState() {
    this._appStateSub?.remove();
    this._appStateSub = null;
  }

  private _registerBackHandler() {
    this._unregisterBackHandler();
    if (Platform.OS === 'android') {
      this._backHandlerSub = BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
    }
  }

  private _unregisterBackHandler() {
    this._backHandlerSub?.remove();
    this._backHandlerSub = null;
  }
}

// Singleton
const FocusLockService = new FocusLockServiceClass();
export default FocusLockService;
