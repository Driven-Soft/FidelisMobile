import { useState, useRef } from "react";
import { useVeterinarianPetActions, usePetTutors, usePetTutor } from "./useVeterinarianPets";
import { useVeterinarian } from "./useVeterinarian";
import { emptyPetForm, petToForm, validatePetForm, petFormFields, petFormPatch, getPetErrorMessage } from "../utils/petUtils";
import type { PetFormValues } from "../utils/petUtils";
import type { PetResponse } from "../models/pet";

type PetFormField = keyof PetFormValues | "tutorId";
type PetFormErrors = Partial<Record<PetFormField, string>>;

export function usePetForm(pet: PetResponse | null, onSaved: () => void) {
  const { create, update, remove } = useVeterinarianPetActions();
  const submitting = useRef(false);
  const mutation = pet ? update : create;
  const tutors = usePetTutors(!pet);
  const tutor = usePetTutor(pet?.id);
  const { profile, clinic } = useVeterinarian();
  const [tutorId, setTutorId] = useState<number | null>(pet?.tutorId ?? null);
  const tutorAvailable = !tutors.isError && tutors.data?.some((tutor) => tutor.id === tutorId);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => pet ? petToForm(pet) : { ...emptyPetForm });
  const [touched, setTouched] = useState<Partial<Record<PetFormField, boolean>>>({});
  const validation: PetFormErrors = validatePetForm(form);
  if (!pet && !tutorAvailable) validation.tutorId = "Selecione um tutor cadastrado.";
  const handleBlur = (field: PetFormField) => setTouched((current) => ({ ...current, [field]: true }));
  const setField = (field: keyof PetFormValues, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const stepFields: PetFormField[][] = [["name", "species", "breed"], ["sex", "birthDate"], pet ? ["fotoUrl"] : ["fotoUrl", "tutorId"]];
  const fieldErrors: PetFormErrors = {};
  for (const field of stepFields.flat()) {
    if (touched[field]) fieldErrors[field] = validation[field];
  }

  const handleNext = async () => {
    if (submitting.current || mutation.isPending || remove.isPending || (!pet && step === 3 && tutors.isFetching)) return;
    const fields = step === 3 ? stepFields.flat() : stepFields[step - 1];
    setTouched((current) => ({ ...current, ...Object.fromEntries(fields.map((field) => [field, true])) }));
    if (fields.some((field) => validation[field])) return;
    if (step < 3) { setStep(step + 1); return; }
    submitting.current = true;
    try {
      if (pet) {
        const changes = petFormPatch(form, pet);
        if (Object.keys(changes).length === 0) { onSaved(); return; }
        await update.mutateAsync({ id: pet.id, changes });
      } else {
        await create.mutateAsync({ ...petFormFields(form), tutorId: tutorId! });
      }
      onSaved();
    } catch {
      // O erro da mutation é apresentado no formulário.
    } finally {
      submitting.current = false;
    }
  };

  return {
    tutors, tutor, tutorId, setTutorId, profile, clinic, step, form, touched, validation, fieldErrors,
    confirmDelete, setConfirmDelete,
    handleDelete: async () => {
      if (!pet || submitting.current) return;
      submitting.current = true;
      try { await remove.mutateAsync(pet.id); onSaved(); }
      catch { /* A mutation apresenta o erro. */ }
      finally { submitting.current = false; }
    },
    setField, handleBlur, handleNext,
    handleBack: () => setStep((current) => current - 1),
    isPending: mutation.isPending || remove.isPending,
    errorMessage: mutation.error || remove.error ? getPetErrorMessage(mutation.error ?? remove.error) : null,
  };
}
