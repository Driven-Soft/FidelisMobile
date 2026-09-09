import type { ConsultaResponse, VacinacaoResponse } from "../models/clinicalHistory";
import type { PetResponse } from "../models/pet";

export class TutorDataError extends Error {
  constructor(public readonly status: number) {
    super("Tutor data unavailable");
  }
}

export function tutorDataErrorMessage(error: unknown): string {
  let status: unknown;
  if (error instanceof TutorDataError) status = error.status;
  else if (error && typeof error === "object" && "response" in error) {
    const response = error.response;
    if (response && typeof response === "object" && "status" in response) status = response.status;
  }
  if (status === 404) return "Dados não encontrados para o usuário autenticado.";
  if (status === 401) return "Sessão indisponível. Entre novamente.";
  if (status === 403) return "Esses dados não estão disponíveis para seu usuário.";
  if (status === 400) return "Não foi possível consultar os dados solicitados.";
  if (typeof status === "number" && status >= 500) return "Serviço indisponível. Tente novamente em instantes.";
  return "Não foi possível carregar os dados. Verifique sua conexão e tente novamente.";
}

export function nameInitials(name: string): string {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

// Modelo de apresentação derivado, não um DTO ou endpoint adicional.
export function buildTutorHistory(consultas: ConsultaResponse[], vacinacoes: VacinacaoResponse[], pets: PetResponse[]) {
  const names = new Map(pets.map((pet) => [pet.id, pet.nome]));
  const events = [
    ...consultas.filter((item) => names.has(item.petId)).map((item) => ({
      id: `consulta-${item.id}`, petId: item.petId, petName: names.get(item.petId),
      title: item.tipo, date: item.dataHora, type: "CONSULTA", note: item.observacoes ?? item.diagnostico,
    })),
    ...vacinacoes.filter((item) => names.has(item.petId)).map((item) => ({
      id: `vacinacao-${item.id}`, petId: item.petId, petName: names.get(item.petId),
      title: item.vacinaAplicada, date: item.dataAplicacao, type: "VACINA", note: item.observacao,
    })),
  ];
  // Não apresentar agendamentos futuros como histórico. Sem inferir consulta concluída.
  return events.filter((event) => Number.isFinite(Date.parse(event.date)) && Date.parse(event.date) <= Date.now())
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date)).slice(0, 3);
}
