import { useContext, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import type { AuthSession } from "../models/auth";
import type { PetRequest, PetPatchRequest, PetResponse } from "../models/pet";
import * as repository from "../repositories/pets/petRepository";
import { assertPetOwner, normalizePetId, PetFlowError } from "../utils/petUtils";

export const petKeys = {
  scope: (tutorId: number | null, expiration: string | null) => ["pets", tutorId, expiration] as const,
  list: (scope: readonly unknown[]) => [...scope, "list"] as const,
  detail: (scope: readonly unknown[], id: number | null) => [...scope, "detail", id] as const,
};

function usePetScope() {
  const { session, authStatus } = useContext(UserContext) as { session: AuthSession | null; authStatus: string };
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
    queryKey: petKeys.list(scope), enabled: active, retry: false,
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
    queryKey: petKeys.detail(scope, id), enabled: active && id !== null, retry: false,
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

export function useCreatePet() {
  const { scope, requireTutor } = usePetScope();
  const client = useQueryClient();
  return useMutation<PetResponse, Error, Omit<PetRequest, "tutorId">>({
    mutationFn: async (fields) => {
      const tutorId = requireTutor();
      const { nome, especie, raca, sexo, dataNascimento, fotoUrl, clinicaId } = fields;
      const pet = await repository.criarPet({ nome, especie, raca, sexo, dataNascimento, fotoUrl, clinicaId, tutorId });
      requireTutor();
      return assertPetOwner(pet, tutorId);
    },
    onSuccess: async (pet) => {
      client.setQueryData(petKeys.detail(scope, pet.id), pet);
      await client.invalidateQueries({ queryKey: petKeys.list(scope) });
    },
  });
}

export function useUpdatePet() {
  const { scope, requireTutor } = usePetScope();
  const client = useQueryClient();
  return useMutation<PetResponse, Error, { id: number; changes: Omit<PetPatchRequest, "clinicaId"> }>({
    mutationFn: async ({ id, changes }) => {
      if (normalizePetId(id) === null) throw new PetFlowError(404);
      const tutorId = requireTutor();
      assertPetOwner(await repository.buscarPet(id), tutorId, id);
      requireTutor();
      const { nome, especie, raca, sexo, dataNascimento, fotoUrl } = changes;
      const pet = await repository.atualizarPet(id, { nome, especie, raca, sexo, dataNascimento, fotoUrl });
      requireTutor();
      return assertPetOwner(pet, tutorId, id);
    },
    onSuccess: async (pet) => {
      await client.cancelQueries({ queryKey: petKeys.detail(scope, pet.id) });
      client.setQueryData(petKeys.detail(scope, pet.id), pet);
      await client.invalidateQueries({ queryKey: scope });
    },
  });
}

export function useDeletePet() {
  const { scope, requireTutor } = usePetScope();
  const client = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      if (normalizePetId(id) === null) throw new PetFlowError(404);
      const tutorId = requireTutor();
      assertPetOwner(await repository.buscarPet(id), tutorId, id);
      requireTutor();
      await repository.excluirPet(id);
    },
    onSuccess: async (_, id) => {
      await client.cancelQueries({ queryKey: petKeys.detail(scope, id) });
      client.setQueryData(petKeys.detail(scope, id), null);
      await client.invalidateQueries({ queryKey: petKeys.list(scope) });
    },
  });
}
