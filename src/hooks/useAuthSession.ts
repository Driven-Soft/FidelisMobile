import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import type { AuthSession } from "../models/auth";
import { loadSession, removeSession, saveSession } from "../repositories/auth/sessionStorage";
import { getSessionExpiration, isValidSession, setSessionToken, subscribeSessionInvalidation } from "../services/authSession";

export function useAuthSession() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const revision = useRef(0);

  const logout = useCallback(async () => {
    const currentRevision = ++revision.current;
    setSessionToken(null);
    setSession(null);
    setIsRestoring(false);
    setSessionError(null);
    try {
      await removeSession();
    } catch {
      if (revision.current === currentRevision) {
        setSessionError("O acesso foi encerrado, mas não foi possível remover a sessão do dispositivo. Tente limpar a sessão local antes de fechar o aplicativo.");
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    const currentRevision = revision.current;
    const unsubscribe = subscribeSessionInvalidation(() => { void logout(); });
    async function restore() {
      try {
        const saved = await loadSession();
        if (!active || revision.current !== currentRevision) return;
        if (saved && !isValidSession(saved)) {
          await removeSession();
          return;
        }
        setSessionToken(saved);
        setSession(saved);
      } catch {
        if (active && revision.current === currentRevision) {
          setSessionToken(null);
          setSession(null);
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
      unsubscribe();
      setSessionToken(null);
    };
  }, [logout]);

  const startSession = useCallback(async (result: AuthSession) => {
    if (!isValidSession(result)) throw new Error("Invalid auth session");
    const currentRevision = ++revision.current;
    setSessionError(null);
    const { token, expiraEm, tutorId, nome } = result;
    const nextSession = { token, expiraEm, tutorId, nome };
    try {
      await saveSession(nextSession);
    } catch {
      const error = new Error("Session persistence failed");
      error.name = "SessionStorageError";
      throw error;
    }
    if (revision.current !== currentRevision) throw new Error("Auth session interrupted");
    if (!isValidSession(nextSession)) {
      await logout();
      throw new Error("Auth session expired");
    }
    setSessionToken(nextSession);
    setSession(nextSession);
    setIsRestoring(false);
  }, [logout]);

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
