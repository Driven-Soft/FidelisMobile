import { useContext, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import type { AuthSession } from "../models/auth";
import { isValidSession } from "../services/authSession";
import { buscarVeterinario, buscarClinica } from "../repositories/veterinario/veterinarianRepository";
import { TutorDataError } from "../utils/tutorDataUtils";

export function useVeterinarian() {
  const { session, authStatus } = useContext(UserContext) as { session: AuthSession | null; authStatus: string };
  const current = useRef(session);
  current.current = session;
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const active = authStatus === "authenticated" && isValidSession(session) && session.tipo === "VETERINARIO";
  const requireVeterinarian = () => {
    if (!active || !isValidSession(session) || session.tipo !== "VETERINARIO" || session.veterinarioId === null ||
      current.current !== session || !mounted.current) throw new TutorDataError(401);
    return session.veterinarioId;
  };
  const scope = ["veterinario", session?.veterinarioId, session?.expiraEm];
  const profile = useQuery({
    queryKey: [...scope, "profile"], enabled: active, retry: false,
    queryFn: async ({ signal }) => {
      const id = requireVeterinarian();
      const data = await buscarVeterinario(id, signal);
      requireVeterinarian();
      if (!data) throw new TutorDataError(404);
      if (data.id !== id) throw new TutorDataError(403);
      return data;
    },
  });
  const veterinarian = active && !profile.isError ? profile.data : undefined;
  const clinicId = veterinarian?.clinicaId;
  const clinic = useQuery({
    queryKey: [...scope, "clinic", clinicId],
    enabled: active && Number.isInteger(clinicId) && (clinicId ?? 0) > 0, retry: false,
    queryFn: async ({ signal }) => {
      requireVeterinarian();
      if (!clinicId) throw new TutorDataError(404);
      const data = await buscarClinica(clinicId, signal);
      requireVeterinarian();
      if (!data) throw new TutorDataError(404);
      if (data.id !== clinicId) throw new TutorDataError(403);
      return data;
    },
  });
  return {
    profile: { ...profile, data: veterinarian },
    clinic: { ...clinic, data: active && veterinarian && !clinic.isError ? clinic.data : undefined },
    hasClinic: Number.isInteger(clinicId) && (clinicId ?? 0) > 0,
  };
}
