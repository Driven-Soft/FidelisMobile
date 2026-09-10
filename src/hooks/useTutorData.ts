import { useContext, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import type { AuthSession } from "../models/auth";
import { isValidSession } from "../services/authSession";
import { buscarTutor } from "../repositories/tutor/tutorRepository";
import { listarConsultas, listarVacinacoes } from "../repositories/tutor/historyRepository";
import { buildTutorHistory, TutorDataError } from "../utils/tutorDataUtils";
import { usePets } from "./usePets";

function useTutorScope() {
  const { session, authStatus } = useContext(UserContext) as { session: AuthSession | null; authStatus: string };
  const current = useRef(session);
  current.current = session;
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const active = authStatus === "authenticated" && isValidSession(session) && session.tipo === "TUTOR";
  const requireTutor = () => {
    if (!active || !isValidSession(session) || session.tipo !== "TUTOR" || session.tutorId === null || current.current !== session || !mounted.current) throw new TutorDataError(401);
    return session.tutorId;
  };
  return { active, requireTutor, scope: ["tutor-data", session?.tutorId ?? null, session?.expiraEm ?? null] as const };
}

export function useTutorProfile() {
  const { active, requireTutor, scope } = useTutorScope();
  const query = useQuery({
    queryKey: [...scope, "profile"], enabled: active, retry: false,
    queryFn: async ({ signal }) => {
      const id = requireTutor();
      const tutor = await buscarTutor(id, signal);
      requireTutor();
      if (!tutor) throw new TutorDataError(404);
      if (tutor.id !== id) throw new TutorDataError(403);
      return tutor;
    },
  });
  return { ...query, data: active && !query.isError ? query.data : undefined };
}

export function useTutorHistory() {
  const petsQuery = usePets();
  const { active, requireTutor, scope } = useTutorScope();
  const pets = petsQuery.isError ? [] : petsQuery.data ?? [];
  const ids = pets.map((pet) => pet.id).sort((a, b) => a - b);
  const query = useQuery({
    queryKey: [...scope, "history", ids], enabled: active && petsQuery.isSuccess, retry: false,
    queryFn: async ({ signal }) => {
      requireTutor();
      if (!ids.length) return { consultas: [], vacinacoes: [] };
      const [consultas, vacinacoes] = await Promise.all([listarConsultas(signal), listarVacinacoes(signal)]);
      requireTutor();
      // A API lista todos os registros; só os vínculos do tutor entram neste cache.
      return { consultas: consultas.filter((item) => ids.includes(item.petId)), vacinacoes: vacinacoes.filter((item) => ids.includes(item.petId)) };
    },
  });
  const error = petsQuery.error ?? query.error;
  return {
    data: active && !error && query.data ? buildTutorHistory(query.data.consultas, query.data.vacinacoes, pets) : [],
    error,
    isPending: petsQuery.isPending || (!petsQuery.isError && query.isPending),
    isFetching: petsQuery.isFetching || query.isFetching,
    refetch: async () => {
      const refreshed = await petsQuery.refetch();
      // Uma mudança de IDs inicia automaticamente a query correspondente.
      const nextIds = refreshed.data?.map((pet) => pet.id).sort((a, b) => a - b) ?? [];
      if (!refreshed.isError && nextIds.join(",") === ids.join(",")) await query.refetch();
    },
  };
}
