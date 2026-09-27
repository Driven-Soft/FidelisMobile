import type { AuthSession } from "../models/auth";

// AuthService usa DateTime.UtcNow; System.Text.Json serializa UTC com sufixo Z.
export function getSessionExpiration(expiraEm: string): number {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,7})?Z$/.test(expiraEm)) {
    return NaN;
  }
  return Date.parse(expiraEm.replace(/(\.\d{3})\d+Z$/, "$1Z"));
}

export function isValidLoginResponse(value: unknown): value is AuthSession {
  if (!value || typeof value !== "object") return false;
  const session = value as Partial<AuthSession>;
  return (
    typeof session.token === "string" && !!session.token.trim() &&
    typeof session.nome === "string" && !!session.nome.trim() &&
    typeof session.email === "string" && !!session.email.trim() &&
    ((session.tipo === "TUTOR" && Number.isInteger(session.tutorId) && (session.tutorId ?? 0) > 0 && session.veterinarioId == null) ||
      (session.tipo === "VETERINARIO" && Number.isInteger(session.veterinarioId) && (session.veterinarioId ?? 0) > 0 && session.tutorId == null)) &&
    typeof session.expiraEm === "string" && getSessionExpiration(session.expiraEm) > Date.now()
  );
}

// A mesma validação serve para a resposta da API e para a sessão salva.
export const isValidSession = isValidLoginResponse;

export function copySession(session: AuthSession): AuthSession {
  const { token, expiraEm, tipo, tutorId, veterinarioId, nome, email } = session;
  return { token, expiraEm, tipo, tutorId: tutorId ?? null, veterinarioId: veterinarioId ?? null, nome, email };
}
