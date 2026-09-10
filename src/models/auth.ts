// Contratos de Fidelis.Application/DTOs/AuthDtos.cs, em formato JSON.
export interface LoginRequest {
  email: string;
  senha: string;
  tipo: "TUTOR" | "VETERINARIO";
}

export interface LoginResponse {
  token: string;
  expiraEm: string; // DateTime serializado pela API.
  tipo: "TUTOR" | "VETERINARIO";
  tutorId: number | null;
  veterinarioId: number | null;
  email: string;
  nome: string;
}

export type AuthSession = LoginResponse;
