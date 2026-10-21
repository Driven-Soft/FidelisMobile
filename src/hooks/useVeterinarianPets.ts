import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserContext } from "../context/UserContext";
import { isValidSession } from "../services/authSession";
import { buscarVeterinario } from "../repositories/veterinario/veterinarianRepository";
import { buscarTutor, listarTutores } from "../repositories/tutor/tutorRepository";
import * as repository from "../repositories/pets/petRepository";
import type { PetRequest, PetPatchRequest, PetResponse } from "../models/pet";
import { normalizePetId, PetFlowError } from "../utils/petUtils";

function useScope() {
  const { session, authStatus } = useUserContext();
  const current = useRef(session);
  current.current = session;
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const active = authStatus === "authenticated" && isValidSession(session) && session.tipo === "VETERINARIO";
  const requireSession = () => {
    if (!active || !isValidSession(session) || session.tipo !== "VETERINARIO" ||
      !session.veterinarioId || current.current !== session || !mounted.current) throw new PetFlowError(401);
    return session.veterinarioId;
  };
  const requireClinic = async (signal?: AbortSignal) => {
    const id = requireSession();
    const vet = await buscarVeterinario(id, signal);
    requireSession();
    if (vet.id !== id || !normalizePetId(vet.clinicaId)) throw new PetFlowError(403);
    return vet.clinicaId;
  };
  const requirePet = async (id: number, signal?: AbortSignal) => {
    if (!normalizePetId(id)) throw new PetFlowError(404);
    const clinicId = await requireClinic(signal);
    const pet = await repository.buscarPet(id, signal);
    requireSession();
    if (pet.id !== id || pet.clinicaId !== clinicId) throw new PetFlowError(403);
    return pet;
  };
  return { active, requireSession, requireClinic, requirePet,
    key: ["veterinarian-pet", session?.veterinarioId, session?.expiraEm] };
}

export function usePetTutors(enabled = true) {
  const scope = useScope();
  return useQuery({
    queryKey: [...scope.key, "tutors"], enabled: scope.active && enabled, retry: false,
    queryFn: async ({ signal }) => {
      await scope.requireClinic(signal);
      const tutors = await listarTutores(signal);
      scope.requireSession();
      // O contrato não vincula tutores a clínicas; a escolha cria o vínculo do pet.
      return tutors.map(({ id, nome, email }) => ({ id, nome, email }));
    },
  });
}

export function useVeterinarianPet(value: unknown) {
  const scope = useScope();
  const id = normalizePetId(value);
  const query = useQuery({
    queryKey: [...scope.key, id], enabled: scope.active && id !== null, retry: false,
    queryFn: ({ signal }) => scope.requirePet(id!, signal),
  });
  return { ...query, data: scope.active && !query.isError && !query.isFetching ? query.data : undefined,
    isPending: id !== null && (query.isPending || query.isFetching),
    error: value !== undefined && id === null ? new PetFlowError(404) : query.error };
}

export function usePetTutor(petId?: number) {
  const scope = useScope();
  return useQuery({
    queryKey: [...scope.key, "tutor", petId],
    enabled: scope.active && petId !== undefined, retry: false,
    queryFn: async ({ signal }) => {
      const pet = await scope.requirePet(petId!, signal);
      const tutor = await buscarTutor(pet.tutorId, signal);
      scope.requireSession();
      if (tutor.id !== pet.tutorId) throw new PetFlowError(403);
      return { id: tutor.id, nome: tutor.nome };
    },
  });
}

export function useVeterinarianPetActions() {
  const scope = useScope();
  const client = useQueryClient();
  const refresh = async () => {
    await Promise.all(["pets", "clinic-pets", "clinic-agenda", "reminders", "veterinarian-pet", "veterinarian-reminder"]
      .map((key) => client.invalidateQueries({ queryKey: [key] })));
  };
  const assertResponse = (pet: PetResponse, tutorId: number, clinicId: number | null, id?: number) => {
    scope.requireSession();
    if (pet.tutorId !== tutorId || pet.clinicaId !== clinicId || (id !== undefined && pet.id !== id)) throw new PetFlowError(403);
    return pet;
  };
  const create = useMutation({
    mutationFn: async (fields: Omit<PetRequest, "clinicaId">) => {
      scope.requireSession();
      if (!normalizePetId(fields.tutorId)) throw new PetFlowError(400);
      const tutor = await buscarTutor(fields.tutorId);
      scope.requireSession();
      if (tutor.id !== fields.tutorId) throw new PetFlowError(403);
      const clinicaId = await scope.requireClinic();
      const { nome, especie, raca, sexo, dataNascimento, fotoUrl, tutorId } = fields;
      return assertResponse(await repository.criarPet({ nome, especie, raca, sexo, dataNascimento, fotoUrl, tutorId, clinicaId }), tutorId, clinicaId);
    }, onSuccess: refresh,
  });
  const update = useMutation({
    mutationFn: async ({ id, changes }: { id: number; changes: Omit<PetPatchRequest, "clinicaId"> }) => {
      const original = await scope.requirePet(id);
      const { nome, especie, raca, sexo, dataNascimento, fotoUrl } = changes;
      return assertResponse(await repository.atualizarPet(id, { nome, especie, raca, sexo, dataNascimento, fotoUrl }), original.tutorId, original.clinicaId, id);
    }, onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: async (id: number) => {
      await scope.requirePet(id);
      await repository.excluirPet(id);
      scope.requireSession();
    }, onSuccess: refresh,
  });
  return { create, update, remove };
}
