import { api, getAll, getResource } from "../../services/api";
import type { ResourceResponse } from "../../services/api";
import type { PetRequest, PetPatchRequest, PetResponse } from "../../models/pet";

export async function listarPets(signal?: AbortSignal): Promise<PetResponse[]> {
  return getAll<PetResponse>("/api/Pet", { signal });
}

export async function buscarPet(id: number, signal?: AbortSignal): Promise<PetResponse> {
  return getResource<PetResponse>(`/api/Pet/${id}`, { signal });
}

export async function criarPet(request: PetRequest): Promise<PetResponse> {
  const { data } = await api.post<ResourceResponse<PetResponse>>("/api/Pet", request);
  return data.data;
}

export async function atualizarPet(id: number, request: PetPatchRequest): Promise<PetResponse> {
  const { data } = await api.patch<ResourceResponse<PetResponse>>(`/api/Pet/${id}`, request);
  return data.data;
}

export async function excluirPet(id: number): Promise<void> {
  await api.delete<void>(`/api/Pet/${id}`);
}
