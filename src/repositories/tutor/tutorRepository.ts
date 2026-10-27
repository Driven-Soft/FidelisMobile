import { api, getAll, getResource } from "../../services/api";
import type { ResourceResponse } from "../../services/api";
import type { TutorRequest, TutorResponse } from "../../models/tutor";

export async function buscarTutor(id: number, signal?: AbortSignal): Promise<TutorResponse> {
  return getResource<TutorResponse>(`/api/Tutor/${id}`, { signal });
}

export async function criarTutor(request: TutorRequest): Promise<TutorResponse> {
  const { cpf, nome, email, senha, telefone, endereco } = request;
  return (await api.post<ResourceResponse<TutorResponse>>("/api/Tutor", { cpf, nome, email, senha, telefone, endereco })).data.data;
}

export async function listarTutores(signal?: AbortSignal): Promise<TutorResponse[]> {
  return getAll<TutorResponse>("/api/Tutor", { signal });
}
