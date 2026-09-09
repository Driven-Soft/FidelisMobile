// Contratos de Fidelis.Application/DTOs/AuthDtos.cs, em formato JSON.
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  expiraEm: string; // DateTime serializado pela API.
  tutorId: number;
  nome: string;
}

export type AuthSession = LoginResponse;
