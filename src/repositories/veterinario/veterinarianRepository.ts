import { getResource } from "../../services/api";
import type { VeterinarioResponse, ClinicaResponse } from "../../models/veterinarian";

export async function buscarVeterinario(id: number, signal?: AbortSignal): Promise<VeterinarioResponse> {
  return getResource<VeterinarioResponse>(`/api/Veterinario/${id}`, { signal });
}

export async function buscarClinica(id: number, signal?: AbortSignal): Promise<ClinicaResponse> {
  return getResource<ClinicaResponse>(`/api/Clinica/${id}`, { signal });
}
