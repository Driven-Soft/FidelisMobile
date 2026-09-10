import { useContext, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import type { AuthSession } from "../models/auth";
import type { LembreteResponse } from "../models/reminder";
import { isValidSession } from "../services/authSession";
import { buscarVeterinario } from "../repositories/veterinario/veterinarianRepository";
import { buscarPet } from "../repositories/pets/petRepository";
import * as repository from "../repositories/reminders/reminderRepository";
import { ReminderFlowError, requireReminderId, serializeReminderDate, validateReminderText } from "../utils/reminderUtils";

function useVeterinarianReminderScope() {
  const { session, authStatus } = useContext(UserContext) as { session: AuthSession | null; authStatus: string };
  const current = useRef(session);
  current.current = session;
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const active = authStatus === "authenticated" && isValidSession(session) && session.tipo === "VETERINARIO";
  const requireSession = () => {
    if (!active || !isValidSession(session) || session.tipo !== "VETERINARIO" || session.veterinarioId === null ||
      current.current !== session || !mounted.current) throw new ReminderFlowError(401);
    return session.veterinarioId;
  };
  const requirePet = async (petId: number, signal?: AbortSignal) => {
    const vetId = requireSession();
    requireReminderId(petId);
    const vet = await buscarVeterinario(vetId, signal);
    requireSession();
    if (!vet || vet.id !== vetId || !Number.isInteger(vet.clinicaId) || vet.clinicaId <= 0) throw new ReminderFlowError(403);
    const pet = await buscarPet(petId, signal);
    requireSession();
    if (!pet || pet.id !== petId || pet.clinicaId !== vet.clinicaId || !Number.isInteger(pet.tutorId) || pet.tutorId <= 0) throw new ReminderFlowError(403);
    return pet;
  };
  const requireReminder = async (id: number, signal?: AbortSignal) => {
    requireSession();
    requireReminderId(id);
    const item = await repository.buscarLembrete(id, signal);
    requireSession();
    if (!item || item.id !== id) throw new ReminderFlowError(404);
    const pet = await requirePet(item.petId, signal);
    if (item.tutorId !== pet.tutorId) throw new ReminderFlowError(403);
    return item;
  };
  return { active, requireSession, requirePet, requireReminder,
    key: ["veterinarian-reminder", session?.veterinarioId, session?.expiraEm] };
}

function assertResponse(item: LembreteResponse, petId: number, tutorId: number, id?: number) {
  if (!item || item.petId !== petId || item.tutorId !== tutorId || (id !== undefined && item.id !== id)) throw new ReminderFlowError(403);
  return item;
}

export function useVeterinarianReminder(id: number) {
  const scope = useVeterinarianReminderScope();
  const query = useQuery({
    queryKey: [...scope.key, id], enabled: scope.active, retry: false,
    queryFn: ({ signal }) => scope.requireReminder(id, signal),
  });
  // A edição só recebe o registro após a verificação atual dos vínculos.
  return { ...query, data: scope.active && !query.isError && !query.isFetching ? query.data : undefined };
}

export function useVeterinarianReminderActions() {
  const scope = useVeterinarianReminderScope();
  const client = useQueryClient();
  const refresh = async () => {
    await Promise.all([
      client.invalidateQueries({ queryKey: ["clinic-agenda"] }),
      client.invalidateQueries({ queryKey: ["reminders"] }),
      client.invalidateQueries({ queryKey: ["veterinarian-reminder"] }),
    ]);
  };
  const create = useMutation({
    mutationFn: async ({ tipo, descricao, date, petId }: { tipo: string; descricao: string; date: Date; petId: number }) => {
      if (!validateReminderText(tipo, descricao)) throw new ReminderFlowError(400);
      const dataPrevista = serializeReminderDate(date);
      const pet = await scope.requirePet(petId);
      const item = await repository.criarLembrete({ tipo: tipo.trim(), descricao: descricao.trim(), dataPrevista, petId: pet.id, tutorId: pet.tutorId });
      scope.requireSession();
      return assertResponse(item, pet.id, pet.tutorId);
    },
    onSuccess: refresh,
  });
  const update = useMutation({
    mutationFn: async ({ id, tipo, descricao }: { id: number; tipo: string; descricao: string }) => {
      if (!validateReminderText(tipo, descricao)) throw new ReminderFlowError(400);
      const original = await scope.requireReminder(id);
      const item = await repository.atualizarLembrete(id, { tipo: tipo.trim(), descricao: descricao.trim(),
        dataPrevista: original.dataPrevista, petId: original.petId, tutorId: original.tutorId });
      scope.requireSession();
      return assertResponse(item, original.petId, original.tutorId, id);
    },
    onSuccess: refresh,
  });
  const status = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: "C" | "X" }) => {
      if (status !== "C" && status !== "X") throw new ReminderFlowError(400);
      const original = await scope.requireReminder(id);
      const item = await repository.alterarLembrete(id, { status });
      scope.requireSession();
      return assertResponse(item, original.petId, original.tutorId, id);
    },
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: async (id: number) => {
      await scope.requireReminder(id);
      await repository.excluirLembrete(id);
      scope.requireSession();
    },
    onSuccess: refresh,
  });
  return { create, update, status, remove };
}
