// Contratos de Fidelis.Application/DTOs/LembreteDtos.cs.
// O backend utiliza LembreteRequest tanto na criação quanto no PUT.
// Status é char no backend; dataPrevista é DateTime serializado como string.
export interface LembreteRequest {
  tipo: string;
  descricao: string;
  dataPrevista: string;
  tutorId: number;
  petId: number;
}

export interface LembretePatchRequest {
  tipo?: string | null;
  descricao?: string | null;
  status?: string | null;
}

export interface LembreteResponse {
  id: number;
  tipo: string;
  descricao: string;
  dataPrevista: string;
  status: string;
  tutorId: number;
  petId: number;
}
