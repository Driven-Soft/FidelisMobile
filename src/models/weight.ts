export interface HistoricoPesoResponse {
  id: number;
  pesoKg: number;
  dataMedicao: string;
  observacao: string | null;
  petId: number;
}

export type RiscoPeso = "VERDE" | "AMARELO" | "VERMELHO";

export interface FaixaPeso {
  min: number;
  max: number;
}

export interface AcaoSugerida {
  registro: "RECOMENDACAO" | "LEMBRETE";
  tipo: string;
  descricao: string;
  prazoDias: number | null;
}

export interface AvaliacaoPeso {
  risco: RiscoPeso;
  tipoRecomendacao: string;
  faixaEsperadaKg: FaixaPeso;
  pesoInformadoKg: number;
  desvioAlemDaFaixa: number;
  justificativa: string;
  acoes: AcaoSugerida[];
}

export interface PerfilAnalisado {
  especie: string;
  raca: string | null;
  sexo: string;
  idadeAnos: number;
  racaNaBaseDeReferencia: boolean;
}

export interface AvaliacaoPesoResponse {
  petId: number;
  historicoPesoId: number;
  dataMedicao: string;
  perfil: PerfilAnalisado;
  avaliacao: AvaliacaoPeso;
}
