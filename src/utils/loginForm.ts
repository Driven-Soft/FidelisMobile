import type { LoginRequest, PortalType } from '../models/auth';

export function validateLoginFields(email: string, password: string) {
  return {
    isEmailValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
    isPasswordValid: password.length >= 6,
  };
}

export function loginRequest(email: string, password: string, portal: PortalType): LoginRequest {
  return { email: email.trim().toLowerCase(), senha: password, tipo: portal === 'VET' ? 'VETERINARIO' : 'TUTOR' };
}
