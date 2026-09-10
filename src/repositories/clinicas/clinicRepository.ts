import { api } from "../../services/api";
import type { ClinicaResponse } from "../../models/veterinarian";

export async function listarClinicas(signal?: AbortSignal): Promise<ClinicaResponse[]> {
  return (await api.get<ClinicaResponse[]>("/api/Clinica", { signal })).data;
}
