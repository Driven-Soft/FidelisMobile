import { useContext, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import type { AuthSession } from "../models/auth";
import type { LembreteResponse } from "../models/reminder";
import * as repository from "../repositories/reminders/reminderRepository";
import { buscarPet } from "../repositories/pets/petRepository";
import { assertReminderOwner, ReminderFlowError, requireReminderId, serializeReminderDate, validateReminderText } from "../utils/reminderUtils";

export const reminderKeys = {
  scope: (session: AuthSession | null) => ["reminders", session?.tutorId ?? null, session?.expiraEm ?? null] as const,
  list: (scope: readonly unknown[]) => [...scope, "list"] as const,
  detail: (scope: readonly unknown[], id: number) => [...scope, "detail", id] as const,
};

function useReminderScope() {
  const { session, authStatus } = useContext(UserContext) as { session: AuthSession | null; authStatus: string };
  const active = authStatus === "authenticated" && !!session;
  const current = useRef(session);
  current.current = session;
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const requireTutor = () => {
    if (!active || !session || !mounted.current || current.current !== session) throw new ReminderFlowError(401);
    return session.tutorId;
  };
  const requireOwned = async (id: number, signal?: AbortSignal) => {
    requireReminderId(id);
    const tutorId = requireTutor();
    const item = await repository.buscarLembrete(id, signal);
    requireTutor();
    return assertReminderOwner(item, tutorId, id);
  };
  return { active, scope: reminderKeys.scope(session), requireTutor, requireOwned };
}

export function useReminders() {
  const { active, scope, requireTutor } = useReminderScope();
  return useQuery<LembreteResponse[], Error>({
    queryKey: reminderKeys.list(scope), enabled: active, retry: false,
    queryFn: async ({ signal }) => {
      const tutorId = requireTutor();
      const items = await repository.listarLembretes(signal);
      requireTutor();
      return items.filter((item) => item.tutorId === tutorId);
    },
  });
}

export function useReminder(id: number) {
  const { active, scope, requireOwned } = useReminderScope();
  const query = useQuery<LembreteResponse | null, Error>({
    queryKey: reminderKeys.detail(scope, id), enabled: active, retry: false,
    queryFn: ({ signal }) => requireOwned(id, signal),
  });
  return { ...query, data: query.isError ? undefined : query.data };
}

function useReminderCache() {
  const client = useQueryClient();
  const context = useReminderScope();
  const refresh = async (item: LembreteResponse | null, id: number) => {
    await client.cancelQueries({ queryKey: reminderKeys.detail(context.scope, id) });
    client.setQueryData(reminderKeys.detail(context.scope, id), item);
    await client.invalidateQueries({ queryKey: reminderKeys.list(context.scope) });
  };
  return { ...context, refresh };
}

export function useCreateReminder() {
  const { requireTutor, refresh } = useReminderCache();
  return useMutation<LembreteResponse, Error, { tipo: string; descricao: string; date: Date; petId: number }>({
    mutationFn: async ({ tipo, descricao, date, petId }) => {
      const tutorId = requireTutor();
      requireReminderId(petId);
      if (!validateReminderText(tipo, descricao)) throw new ReminderFlowError(400);
      const dataPrevista = serializeReminderDate(date);
      const pet = await buscarPet(petId);
      requireTutor();
      if (pet.id !== petId || pet.tutorId !== tutorId) throw new ReminderFlowError(403);
      const item = await repository.criarLembrete({ tipo: tipo.trim(), descricao: descricao.trim(), dataPrevista, petId, tutorId });
      requireTutor();
      return assertReminderOwner(item, tutorId);
    },
    onSuccess: (item) => refresh(item, item.id),
  });
}

export function useUpdateReminder() {
  const { requireOwned, requireTutor, refresh } = useReminderCache();
  return useMutation<LembreteResponse, Error, { id: number; tipo: string; descricao: string }>({
    mutationFn: async ({ id, tipo, descricao }) => {
      if (!validateReminderText(tipo, descricao)) throw new ReminderFlowError(400);
      const original = await requireOwned(id);
      const tutorId = requireTutor();
      // PUT exige todos os campos, mas só altera tipo/descricao. Preservar os demais.
      const item = await repository.atualizarLembrete(id, {
        tipo: tipo.trim(), descricao: descricao.trim(), dataPrevista: original.dataPrevista,
        tutorId: original.tutorId, petId: original.petId,
      });
      requireTutor();
      return assertReminderOwner(item, tutorId, id);
    },
    onSuccess: (item) => refresh(item, item.id),
  });
}

export function useReminderStatus() {
  const { requireOwned, requireTutor, refresh } = useReminderCache();
  return useMutation<LembreteResponse, Error, { id: number; status: "C" | "X" }>({
    mutationFn: async ({ id, status }) => {
      if (status !== "C" && status !== "X") throw new ReminderFlowError(400);
      await requireOwned(id);
      const tutorId = requireTutor();
      const item = await repository.alterarLembrete(id, { status });
      requireTutor();
      return assertReminderOwner(item, tutorId, id);
    },
    onSuccess: (item) => refresh(item, item.id),
  });
}

export function useDeleteReminder() {
  const { requireOwned, requireTutor, refresh } = useReminderCache();
  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      await requireOwned(id);
      requireTutor();
      await repository.excluirLembrete(id);
    },
    onSuccess: (_, id) => refresh(null, id),
  });
}
