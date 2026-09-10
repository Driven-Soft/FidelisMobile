import { useContext, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../context/UserContext";
import type { AuthSession } from "../models/auth";
import { isValidSession } from "../services/authSession";
import { listarClinicas } from "../repositories/clinicas/clinicRepository";
import { TutorDataError } from "../utils/tutorDataUtils";

export function useClinics(enabled = true) {
  const { session, authStatus } = useContext(UserContext) as { session: AuthSession | null; authStatus: string };
  const current = useRef(session);
  current.current = session;
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const active = enabled && authStatus === "authenticated" && isValidSession(session) && session.tipo === "TUTOR";
  const requireSession = () => {
    if (!active || !isValidSession(session) || current.current !== session || !mounted.current) throw new TutorDataError(401);
  };
  return useQuery({
    queryKey: ["clinicas", session?.tipo, session?.tutorId, session?.expiraEm],
    enabled: active,
    retry: false,
    queryFn: async ({ signal }) => {
      requireSession();
      const clinics = await listarClinicas(signal);
      requireSession();
      return clinics;
    },
  });
}
