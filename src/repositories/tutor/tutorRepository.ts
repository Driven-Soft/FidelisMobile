import { api } from "../../services/api";
import type { TutorResponse } from "../../models/tutor";

export async function buscarTutor(id: number, signal?: AbortSignal): Promise<TutorResponse> {
  return (await api.get<TutorResponse>(`/api/Tutor/${id}`, { signal })).data;
}
