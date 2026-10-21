import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../context/UserContext";
import type { PetResponse } from "../models/pet";
import * as repository from "../repositories/pets/petRepository";
import { assertPetOwner, normalizePetId, PetFlowError } from "../utils/petUtils";

type PetScopeKey = readonly ["pets", number | null, string | null];

export const petKeys = {
  scope: (tutorId: number | null, expiration: string | null): PetScopeKey => ["pets", tutorId, expiration],
  list: (scope: PetScopeKey) => [...scope, "list"] as const,
  detail: (scope: PetScopeKey, id: number | null) => [...scope, "detail", id] as const,
};

function usePetScope() {
  const { session, authStatus } = useUserContext();
  const active = authStatus === "authenticated" && session?.tipo === "TUTOR";
  const scope = petKeys.scope(session?.tutorId ?? null, session?.expiraEm ?? null);
  const current = useRef(session);
  current.current = session;
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const requireTutor = (): number => {
    if (!active || !session || session.tipo !== "TUTOR" || session.tutorId === null || !mounted.current || current.current !== session) throw new PetFlowError(401);
    return session.tutorId;
  };
  return { active, scope, requireTutor };
}

export function usePets() {
  const { active, scope, requireTutor } = usePetScope();
  return useQuery<PetResponse[], Error>({
    queryKey: petKeys.list(scope), enabled: active, retry: false, refetchInterval: 30000,
    queryFn: async ({ signal }) => {
      const tutorId = requireTutor();
      const pets = await repository.listarPets(signal);
      requireTutor();
      // O endpoint retorna todos os pets; o filtro limita somente a interface.
      return pets.filter((pet) => pet.tutorId === tutorId);
    },
  });
}

export function usePet(value: unknown) {
  const id = normalizePetId(value);
  const { active, scope, requireTutor } = usePetScope();
  const query = useQuery<PetResponse | null, Error>({
    queryKey: petKeys.detail(scope, id), enabled: active && id !== null, retry: false, refetchInterval: 30000,
    queryFn: async ({ signal }) => {
      if (id === null) throw new PetFlowError(404);
      const tutorId = requireTutor();
      const pet = await repository.buscarPet(id, signal);
      requireTutor();
      return assertPetOwner(pet, tutorId, id);
    },
  });
  return { ...query, data: query.isError ? undefined : query.data,
    isPending: id !== null && query.isPending, error: id === null ? new PetFlowError(404) : query.error };
}
