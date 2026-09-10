// Contratos de Fidelis.Application/DTOs/AuthDtos.cs, em formato JSON.
export interface LoginRequest {
  email: string;
  senha: string;
  tipo: "TUTOR" | "VETERINARIO";
}

export interface LoginResponse {
  token: string;
  expiraEm: string; // DateTime serializado pela API.
  tutorId: number;
  nome: string;
}

export type AuthSession = LoginResponse;
