import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import type { AxiosResponse } from "axios";
import type { AuthSession, AuthStatus } from "../models/auth";
import { api } from "../services/api";
import { copySession, getSessionExpiration, isValidSession } from "../services/authSession";

const SESSION_STORAGE_KEY = "@fidelis:auth_session";

interface AuthSessionState {
  session: AuthSession | null;
  status: AuthStatus;
  sessionError: string | null;
  startSession: (result: AuthSession) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuthSession(): AuthSessionState {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  // Os interceptors precisam consultar a sessão atual sem esperar outro render.
  const currentSession = useRef<AuthSession | null>(null);
  const revision = useRef(0);
  const pendingStorage = useRef<Promise<void>>(Promise.resolve());

  // Salvar e remover usam a mesma chave, na ordem em que foram solicitados.
  // Assim, um logout durante uma gravação não deixa a sessão salva novamente.
  const persistSession = useCallback((value: AuthSession | null): Promise<void> => {
    const write = () => value === null
      ? AsyncStorage.removeItem(SESSION_STORAGE_KEY)
      : AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(value));
    const operation = pendingStorage.current.then(write, write);
    pendingStorage.current = operation;
    return operation;
  }, []);

  const updateSession = useCallback((value: AuthSession | null) => {
    currentSession.current = value;
    setSession(value);
  }, []);

  const logout = useCallback(async () => {
    const currentRevision = ++revision.current;
    updateSession(null);
    setIsRestoring(false);
    setSessionError(null);
    try {
      await persistSession(null);
    } catch {
      if (revision.current === currentRevision) {
        setSessionError("O acesso foi encerrado, mas não foi possível remover a sessão do dispositivo. Tente limpar a sessão local antes de fechar o aplicativo.");
      }
    }
  }, [persistSession, updateSession]);

  useEffect(() => {
    const requestId = api.interceptors.request.use((config) => {
      const saved = currentSession.current;
      if (saved && getSessionExpiration(saved.expiraEm) <= Date.now()) void logout();
      const token = currentSession.current?.token;
      if (token) config.headers.set("Authorization", `Bearer ${token}`);
      else config.headers.delete("Authorization");
      return config;
    });
    const responseId = api.interceptors.response.use(
      (response: AxiosResponse<unknown, unknown>) => response,
      (error: unknown) => {
        if (axios.isAxiosError<unknown, unknown>(error) && error.response?.status === 401) {
          const authorization = error.config?.headers?.get?.("Authorization");
          // Um 401 de uma sessão anterior não deve encerrar o login atual.
          if (currentSession.current && authorization === `Bearer ${currentSession.current.token}`) void logout();
        }
        return Promise.reject(error);
      },
    );
    return () => {
      api.interceptors.request.eject(requestId);
      api.interceptors.response.eject(responseId);
    };
  }, [logout]);

  useEffect(() => {
    let active = true;
    const currentRevision = revision.current;
    async function restore() {
      try {
        const saved = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        if (!active || revision.current !== currentRevision) return;
        if (saved === null) return;
        let value: unknown;
        try {
          value = JSON.parse(saved);
        } catch {
          await persistSession(null);
          return;
        }
        if (!isValidSession(value)) {
          await persistSession(null);
          return;
        }
        updateSession(copySession(value));
      } catch {
        if (active && revision.current === currentRevision) {
          updateSession(null);
          setSessionError("Não foi possível recuperar a sessão. Entre novamente.");
        }
      } finally {
        if (active && revision.current === currentRevision) setIsRestoring(false);
      }
    }
    void restore();
    return () => {
      active = false;
      revision.current += 1;
      currentSession.current = null;
    };
  }, [persistSession, updateSession]);

  const startSession = useCallback(async (result: AuthSession) => {
    if (!isValidSession(result)) throw new Error("Invalid auth session");
    const currentRevision = ++revision.current;
    setSessionError(null);
    const nextSession = copySession(result);
    try {
      await persistSession(nextSession);
    } catch {
      const error = new Error("Session persistence failed");
      error.name = "SessionStorageError";
      throw error;
    }
    if (revision.current !== currentRevision) throw new Error("Auth session interrupted");
    if (getSessionExpiration(nextSession.expiraEm) <= Date.now()) {
      await logout();
      throw new Error("Auth session expired");
    }
    updateSession(nextSession);
    setIsRestoring(false);
  }, [logout, persistSession, updateSession]);

  useEffect(() => {
    if (!session) return;
    let timer: ReturnType<typeof setTimeout>;
    const checkExpiration = () => {
      clearTimeout(timer);
      const remaining = getSessionExpiration(session.expiraEm) - Date.now();
      if (remaining <= 0 || !Number.isFinite(remaining)) {
        void logout();
        return;
      }
      // Prazo real da sessão, sem espera artificial para a inicialização.
      timer = setTimeout(checkExpiration, Math.min(remaining, 2147483647));
    };
    checkExpiration();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") checkExpiration();
    });
    return () => { clearTimeout(timer); subscription.remove(); };
  }, [session, logout]);

  return {
    session,
    status: isRestoring ? "restoring" : session ? "authenticated" : "unauthenticated",
    sessionError,
    startSession,
    logout,
  };
}
