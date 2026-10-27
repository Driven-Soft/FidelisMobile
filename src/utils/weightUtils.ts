import type { RiscoPeso } from "../models/weight";

export class WeightFlowError extends Error {
  constructor(public readonly status: number) {
    super("Weight operation unavailable");
    this.name = "WeightFlowError";
  }
}

export function getWeightErrorMessage(error: unknown): string {
  let status: unknown;
  if (error instanceof WeightFlowError) status = error.status;
  else if (error && typeof error === "object" && "response" in error) {
    const response = error.response;
    if (response && typeof response === "object" && "status" in response) status = response.status;
  }
  if (status === 400) return "A avaliação de peso está disponível para cães e gatos.";
  if (status === 401) return "Sua sessão não está disponível. Entre novamente.";
  if (status === 404) return "Pesagem ou pet não encontrado. Atualize a tela.";
  if (typeof status === "number" && status >= 500) return "O serviço de avaliação de peso está indisponível. Tente novamente.";
  return "Não foi possível concluir a operação. Verifique sua conexão e tente novamente.";
}

export function formatWeight(value: number): string {
  return value.toFixed(1).replace(".", ",");
}

export function formatWeightDate(value: string): string {
  const [year, month, day] = value.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

export function weightRiskLabel(risco: RiscoPeso): string {
  if (risco === "VERMELHO") return "ALERTA";
  if (risco === "AMARELO") return "ATENÇÃO";
  return "PESO ADEQUADO";
}
