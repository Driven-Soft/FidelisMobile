import { useContext, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import type { AuthSession } from "../models/auth";
import { isValidSession } from "../services/authSession";
import { listarLembretes } from "../repositories/reminders/reminderRepository";
import { useClinicPets } from "./useClinicPets";
import { selectClinicAgenda } from "../utils/reminderUtils";
import { TutorDataError } from "../utils/tutorDataUtils";

export function useClinicAgenda(onlyPending = true) {
  const { session, authStatus } = useContext(UserContext) as { session: AuthSession | null; authStatus: string };
  const pets = useClinicPets();
  const client = useQueryClient();
  const active = authStatus === "authenticated" && isValidSession(session) && session.tipo === "VETERINARIO";
  const ready = active && pets.hasClinic && !pets.isPending && !pets.error;
  const links = pets.data.map((pet) => [pet.id, pet.tutorId]).sort((a, b) => a[0] - b[0]);
  const scope = JSON.stringify([session?.veterinarioId, session?.expiraEm, pets.clinicId, links]);
  const current = useRef({ session, scope, ready });
  current.current = { session, scope, ready };
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const requireScope = () => {
    if (!ready || !isValidSession(session) || current.current.session !== session ||
      current.current.scope !== scope || !current.current.ready || !mounted.current) throw new TutorDataError(401);
  };
  const query = useQuery({
    queryKey: ["clinic-agenda", session?.veterinarioId, session?.expiraEm, pets.clinicId, links, onlyPending],
    enabled: ready, retry: false,
    queryFn: async ({ signal }) => {
      requireScope();
      if (!pets.data.length) return [];
      const reminders = await listarLembretes(signal);
      requireScope();
      return selectClinicAgenda(reminders, pets.data, pets.clinicId, onlyPending);
    },
  });
  const error = pets.error ?? query.error;
  return {
    data: ready && !error ? query.data ?? [] : [],
    hasClinic: pets.hasClinic,
    clinicName: pets.clinicName,
    clinicId: pets.clinicId,
    error,
    isPending: pets.isPending || (ready && query.isPending),
    isFetching: pets.isFetching || query.isFetching,
    refetch: async () => {
      await pets.refetch();
      await client.invalidateQueries({ queryKey: ["clinic-agenda"] });
    },
  };
}
