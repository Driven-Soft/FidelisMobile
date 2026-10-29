import { api } from "../../services/api";
import type { VeterinarioResponse } from "../../models/veterinarian";

export async function buscarVeterinario(id: number, signal?: AbortSignal): Promise<VeterinarioResponse> {
  return (await api.get<VeterinarioResponse>(`/api/Veterinario/${id}`, { signal })).data;
}
