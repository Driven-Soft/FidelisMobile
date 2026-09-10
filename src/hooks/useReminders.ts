import { useContext, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import type { AuthSession } from "../models/auth";
import type { LembreteResponse } from "../models/reminder";
import * as repository from "../repositories/reminders/reminderRepository";
import { ReminderFlowError } from "../utils/reminderUtils";

export const reminderKeys = {
  scope: (session: AuthSession | null) => ["reminders", session?.tutorId ?? null, session?.expiraEm ?? null] as const,
  list: (scope: readonly unknown[]) => [...scope, "list"] as const,
};

function useReminderScope() {
  const { session, authStatus } = useContext(UserContext) as { session: AuthSession | null; authStatus: string };
  const active = authStatus === "authenticated" && session?.tipo === "TUTOR";
  const current = useRef(session);
  current.current = session;
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const requireTutor = () => {
    if (!active || !session || session.tipo !== "TUTOR" || session.tutorId === null || !mounted.current || current.current !== session) throw new ReminderFlowError(401);
    return session.tutorId;
  };
  return { active, scope: reminderKeys.scope(session), requireTutor };
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

export function usePetReminders(petId: number | undefined) {
  const query = useReminders();
  const validId = typeof petId === "number" && Number.isInteger(petId) && petId > 0;
  const data = validId && !query.isError
    ? (query.data ?? []).filter((item) => item.petId === petId)
      .sort((a, b) => a.dataPrevista.localeCompare(b.dataPrevista))
    : [];
  return { ...query, data, types: [...new Set(data.map((item) => item.tipo))] };
}
