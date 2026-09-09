import { api } from "../../services/api";
import type { LembreteRequest, LembretePatchRequest, LembreteResponse } from "../../models/reminder";

export async function listarLembretes(signal?: AbortSignal): Promise<LembreteResponse[]> {
  return (await api.get<LembreteResponse[]>("/api/Lembrete", { signal })).data;
}

export async function buscarLembrete(id: number, signal?: AbortSignal): Promise<LembreteResponse> {
  return (await api.get<LembreteResponse>(`/api/Lembrete/${id}`, { signal })).data;
}

export async function criarLembrete(body: LembreteRequest): Promise<LembreteResponse> {
  return (await api.post<LembreteResponse>("/api/Lembrete", body)).data;
}

export async function atualizarLembrete(id: number, body: LembreteRequest): Promise<LembreteResponse> {
  return (await api.put<LembreteResponse>(`/api/Lembrete/${id}`, body)).data;
}

export async function alterarLembrete(id: number, body: LembretePatchRequest): Promise<LembreteResponse> {
  return (await api.patch<LembreteResponse>(`/api/Lembrete/${id}`, body)).data;
}

export async function excluirLembrete(id: number): Promise<void> {
  await api.delete(`/api/Lembrete/${id}`);
}
