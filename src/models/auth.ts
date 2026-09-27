// Contratos de Fidelis.Application/DTOs/AuthDtos.cs, em formato JSON.
export type UserType = "TUTOR" | "VETERINARIO";
// O seletor da interface usa VET; a API usa VETERINARIO.
export type PortalType = "TUTOR" | "VET";
export type AuthStatus = "restoring" | "authenticated" | "unauthenticated";

export interface LoginRequest {
  email: string;
  senha: string;
  tipo: UserType;
}

export interface LoginResponse {
  token: string;
  expiraEm: string; // DateTime serializado pela API.
  tipo: UserType;
  tutorId: number | null;
  veterinarioId: number | null;
  email: string;
  nome: string;
}

export type AuthSession = LoginResponse;
