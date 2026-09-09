import { api } from "../../services/api";
import type { PetRequest, PetPatchRequest, PetResponse } from "../../models/pet";

export async function listarPets(signal?: AbortSignal): Promise<PetResponse[]> {
  const { data } = await api.get<PetResponse[]>("/api/Pet", { signal });
  return data;
}

export async function buscarPet(id: number, signal?: AbortSignal): Promise<PetResponse> {
  const { data } = await api.get<PetResponse>(`/api/Pet/${id}`, { signal });
  return data;
}

export async function criarPet(request: PetRequest): Promise<PetResponse> {
  const { data } = await api.post<PetResponse>("/api/Pet", request);
  return data;
}

export async function atualizarPet(id: number, request: PetPatchRequest): Promise<PetResponse> {
  const { data } = await api.patch<PetResponse>(`/api/Pet/${id}`, request);
  return data;
}

export async function excluirPet(id: number): Promise<void> {
  await api.delete(`/api/Pet/${id}`);
}
