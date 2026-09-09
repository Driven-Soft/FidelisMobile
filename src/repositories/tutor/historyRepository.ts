import { api } from "../../services/api";
import type { ConsultaResponse, VacinacaoResponse } from "../../models/clinicalHistory";

export async function listarConsultas(signal?: AbortSignal): Promise<ConsultaResponse[]> {
  return (await api.get<ConsultaResponse[]>("/api/Consulta", { signal })).data;
}

export async function listarVacinacoes(signal?: AbortSignal): Promise<VacinacaoResponse[]> {
  return (await api.get<VacinacaoResponse[]>("/api/Vacinacao", { signal })).data;
}
