import { api } from '../../services/api';
import type { ClinicaResponse } from '../../models/clinic';

export async function buscarClinica(id: number, signal?: AbortSignal): Promise<ClinicaResponse> {
  return (await api.get<ClinicaResponse>(`/api/Clinica/${id}`, { signal })).data;
}
