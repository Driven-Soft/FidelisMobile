import { api } from "../../services/api";
import type { TutorRequest, TutorResponse } from "../../models/tutor";

export async function buscarTutor(id: number, signal?: AbortSignal): Promise<TutorResponse> {
  return (await api.get<TutorResponse>(`/api/Tutor/${id}`, { signal })).data;
}

export async function criarTutor(request: TutorRequest): Promise<TutorResponse> {
  const { cpf, nome, email, senha, telefone, endereco } = request;
  return (await api.post<TutorResponse>("/api/Tutor", { cpf, nome, email, senha, telefone, endereco })).data;
}
