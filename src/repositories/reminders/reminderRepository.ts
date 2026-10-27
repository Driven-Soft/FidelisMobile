import { api, getAll, getResource } from "../../services/api";
import type { ResourceResponse } from "../../services/api";
import type { LembreteRequest, LembretePatchRequest, LembreteResponse } from "../../models/reminder";

export async function listarLembretes(signal?: AbortSignal): Promise<LembreteResponse[]> {
  return getAll<LembreteResponse>("/api/Lembrete", { signal });
}

export async function buscarLembrete(id: number, signal?: AbortSignal): Promise<LembreteResponse> {
  return getResource<LembreteResponse>(`/api/Lembrete/${id}`, { signal });
}

export async function criarLembrete(body: LembreteRequest): Promise<LembreteResponse> {
  return (await api.post<ResourceResponse<LembreteResponse>>("/api/Lembrete", body)).data.data;
}

export async function atualizarLembrete(id: number, body: LembreteRequest): Promise<LembreteResponse> {
  return (await api.put<ResourceResponse<LembreteResponse>>(`/api/Lembrete/${id}`, body)).data.data;
}

export async function alterarLembrete(id: number, body: LembretePatchRequest): Promise<LembreteResponse> {
  return (await api.patch<ResourceResponse<LembreteResponse>>(`/api/Lembrete/${id}`, body)).data.data;
}

export async function excluirLembrete(id: number): Promise<void> {
  await api.delete<void>(`/api/Lembrete/${id}`);
}
