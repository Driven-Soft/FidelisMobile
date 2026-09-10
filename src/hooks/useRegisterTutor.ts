import { useMutation } from "@tanstack/react-query";
import { criarTutor } from "../repositories/tutor/tutorRepository";
import type { TutorRequest, TutorResponse } from "../models/tutor";

export function useRegisterTutor() {
  return useMutation<TutorResponse, Error, TutorRequest>({
    mutationFn: criarTutor,
    retry: false,
  });
}
