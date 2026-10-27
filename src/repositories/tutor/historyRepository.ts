import { getAll } from "../../services/api";
import type { ConsultaResponse, VacinacaoResponse } from "../../models/clinicalHistory";

export async function listarConsultas(signal?: AbortSignal): Promise<ConsultaResponse[]> {
  return getAll<ConsultaResponse>("/api/Consulta", { signal });
}

export async function listarVacinacoes(signal?: AbortSignal): Promise<VacinacaoResponse[]> {
  return getAll<VacinacaoResponse>("/api/Vacinacao", { signal });
}
