// Contratos de Fidelis.Application/DTOs/TutorDtos.cs.
// O backend utiliza TutorRequest tanto na criação quanto no PUT.
export interface TutorRequest {
  cpf: string;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  endereco: string;
}

export interface TutorPatchRequest {
  cpf?: string | null;
  nome?: string | null;
  email?: string | null;
  telefone?: string | null;
  endereco?: string | null;
}

export interface TutorResponse {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  dataCriacao: string; // DateTime serializado pela API.
}
