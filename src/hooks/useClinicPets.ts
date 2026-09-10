import { useContext, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import type { AuthSession } from "../models/auth";
import { isValidSession } from "../services/authSession";
import { listarPets } from "../repositories/pets/petRepository";
import { useVeterinarian } from "./useVeterinarian";
import { TutorDataError } from "../utils/tutorDataUtils";

export function useClinicPets() {
  const { session, authStatus } = useContext(UserContext) as { session: AuthSession | null; authStatus: string };
  const { profile, clinic, hasClinic } = useVeterinarian();
  const clinicId = profile.data?.clinicaId;
  const active = authStatus === "authenticated" && isValidSession(session) && session.tipo === "VETERINARIO";
  const current = useRef({ session, clinicId });
  current.current = { session, clinicId };
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const requireScope = () => {
    if (!active || !isValidSession(session) || !hasClinic || profile.isError ||
      current.current.session !== session || current.current.clinicId !== clinicId || !mounted.current) {
      throw new TutorDataError(401);
    }
  };
  const query = useQuery({
    queryKey: ["clinic-pets", session?.veterinarioId, session?.expiraEm, clinicId],
    enabled: active && hasClinic && profile.isSuccess,
    retry: false,
    queryFn: async ({ signal }) => {
      requireScope();
      const pets = await listarPets(signal);
      requireScope();
      // Restrição de interface: a API ainda precisa autorizar o acesso por clínica.
      return pets.filter((pet) => pet.clinicaId === clinicId);
    },
  });
  const error = profile.error ?? query.error;
  return {
    data: active && hasClinic && !error ? query.data ?? [] : [],
    clinicName: clinic.data?.nome,
    clinicId,
    hasClinic,
    error,
    isPending: active && (profile.isPending || (hasClinic && !profile.isError && query.isPending)),
    isFetching: profile.isFetching || query.isFetching,
    refetch: async () => {
      const updated = await profile.refetch();
      // Outro vínculo inicia uma nova query; nunca reutilizar os pets da clínica anterior.
      if (!updated.isError && updated.data?.clinicaId === clinicId && hasClinic) await query.refetch();
    },
  };
}
