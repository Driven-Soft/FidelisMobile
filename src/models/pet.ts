// Contratos de Fidelis.Application/DTOs/PetDtos.cs.
// O backend utiliza PetRequest tanto na criação quanto no PUT.
// Campos char trafegam como strings de um caractere; DateTime como string.
export interface PetRequest {
  nome: string;
  especie: string;
  raca: string;
  sexo: string;
  dataNascimento: string;
  fotoUrl: string;
  tutorId: number;
  clinicaId?: number | null;
}

export interface PetPatchRequest {
  nome?: string | null;
  especie?: string | null;
  raca?: string | null;
  sexo?: string | null;
  dataNascimento?: string | null;
  fotoUrl?: string | null;
  clinicaId?: number | null;
}

export interface PetResponse {
  id: number;
  nome: string;
  especie: string;
  raca: string;
  sexo: string;
  dataNascimento: string;
  status: string;
  fotoUrl: string;
  tutorId: number;
  clinicaId: number | null;
}
