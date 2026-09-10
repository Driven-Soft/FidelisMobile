import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AuthSession } from "../../models/auth";
import { isValidSession, copySession } from "../../services/authSession";

const SESSION_STORAGE_KEY = "@fidelis:auth_session";

// Mantém a ordem de gravação/remoção quando login e invalidação se sobrepõem.
let pending: Promise<unknown> = Promise.resolve();
function enqueue<T>(operation: () => Promise<T>): Promise<T> {
  const result = pending.then(operation, operation);
  pending = result.catch(() => undefined);
  return result;
}

export function saveSession(session: AuthSession): Promise<void> {
  return enqueue(async () => {
    if (!isValidSession(session)) throw new Error("Invalid auth session");
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(copySession(session)));
  });
}

export function loadSession(): Promise<AuthSession | null> {
  return enqueue(async () => {
    const saved = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
    if (saved === null) return null;
    let value: unknown;
    try {
      value = JSON.parse(saved);
    } catch {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    if (!isValidSession(value)) {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return copySession(value);
  });
}

export function removeSession(): Promise<void> {
  return enqueue(() => AsyncStorage.removeItem(SESSION_STORAGE_KEY));
}
