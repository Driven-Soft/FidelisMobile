// Respostas confirmadas em ConsultaDtos.cs e VacinacaoDtos.cs.
export interface ConsultaResponse {
  id: number;
  dataHora: string;
  tipo: string;
  diagnostico: string | null;
  observacoes: string | null;
  dataRetorno: string | null;
  veterinarioId: number;
  petId: number;
}

export interface VacinacaoResponse {
  id: number;
  dataAplicacao: string;
  dataProxima: string;
  vacinaAplicada: string;
  observacao: string | null;
  petId: number;
  veterinarioId: number;
}
