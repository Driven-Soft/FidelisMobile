export interface VeterinarioResponse {
  id: number;
  crmv: string;
  nome: string;
  email: string;
  especialidade: string;
  clinicaId: number;
  dataCriacao: string;
}

export interface ClinicaResponse {
  id: number;
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
}
