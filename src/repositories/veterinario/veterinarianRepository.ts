import { api } from "../../services/api";
import type { VeterinarioResponse, ClinicaResponse } from "../../models/veterinarian";

export async function buscarVeterinario(id: number, signal?: AbortSignal): Promise<VeterinarioResponse> {
  return (await api.get<VeterinarioResponse>(`/api/Veterinario/${id}`, { signal })).data;
}

export async function buscarClinica(id: number, signal?: AbortSignal): Promise<ClinicaResponse> {
  return (await api.get<ClinicaResponse>(`/api/Clinica/${id}`, { signal })).data;
}
