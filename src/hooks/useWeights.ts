import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../context/UserContext";
import type { AuthSession } from "../models/auth";
import type { AvaliacaoPesoResponse, HistoricoPesoResponse } from "../models/weight";
import * as repository from "../repositories/weights/weightRepository";
import { WeightFlowError } from "../utils/weightUtils";

type WeightScopeKey = readonly ["weights", number | null, string | null];

export const weightKeys = {
  scope: (session: AuthSession | null): WeightScopeKey => ["weights", session?.tutorId ?? null, session?.expiraEm ?? null],
  list: (scope: WeightScopeKey, petId: number | null) => [...scope, "list", petId] as const,
  assessment: (scope: WeightScopeKey, petId: number | null, weightId: number | null) => [...scope, "assessment", petId, weightId] as const,
};

function useWeightScope() {
  const { session, authStatus } = useUserContext();
  const active = authStatus === "authenticated" && session?.tipo === "TUTOR";
  const current = useRef(session);
  current.current = session;
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const requireTutor = () => {
    if (!active || !session || session.tipo !== "TUTOR" || session.tutorId === null || !mounted.current || current.current !== session) throw new WeightFlowError(401);
    return session.tutorId;
  };
  return { active, scope: weightKeys.scope(session), requireTutor };
}

export function usePetWeights(petId: number | undefined) {
  const { active, scope, requireTutor } = useWeightScope();
  const id = petId ?? null;
  const query = useQuery<HistoricoPesoResponse[], Error>({
    queryKey: weightKeys.list(scope, id), enabled: active && id !== null, retry: false, refetchInterval: 30000,
    queryFn: async ({ signal }) => {
      requireTutor();
      const items = await repository.listarPesagens(id!, signal);
      requireTutor();
      return items;
    },
  });
  const data = query.isError ? [] : [...(query.data ?? [])]
    .sort((a, b) => a.dataMedicao.localeCompare(b.dataMedicao) || a.id - b.id);
  return { ...query, data };
}

export function usePetWeightAssessment(petId: number | undefined, weightId: number | undefined) {
  const { active, scope, requireTutor } = useWeightScope();
  const id = petId ?? null;
  return useQuery<AvaliacaoPesoResponse, Error>({
    queryKey: weightKeys.assessment(scope, id, weightId ?? null), enabled: active && id !== null && weightId !== undefined, retry: false,
    queryFn: async ({ signal }) => {
      requireTutor();
      const assessment = await repository.buscarAvaliacaoPeso(id!, signal);
      requireTutor();
      return assessment;
    },
  });
}
