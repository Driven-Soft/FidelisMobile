import { getAll, getResource } from "../../services/api";
import type { AvaliacaoPesoResponse, HistoricoPesoResponse } from "../../models/weight";

export async function listarPesagens(petId: number, signal?: AbortSignal): Promise<HistoricoPesoResponse[]> {
  return getAll<HistoricoPesoResponse>("/api/HistoricoPeso", {
    signal,
    params: { petId, sortBy: "DataMedicao", sortDirection: "asc" },
  });
}

export async function buscarAvaliacaoPeso(petId: number, signal?: AbortSignal): Promise<AvaliacaoPesoResponse> {
  return getResource<AvaliacaoPesoResponse>(`/api/HistoricoPeso/pet/${petId}/avaliacao`, { signal });
}
