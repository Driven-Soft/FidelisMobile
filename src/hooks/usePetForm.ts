import { useState } from "react";
import { useCreatePet, useUpdatePet } from "./usePets";
import { useClinics } from "./useClinics";
import { emptyPetForm, petToForm, validatePetForm, petFormFields, petFormPatch, getPetErrorMessage } from "../utils/petUtils";
import type { PetFormValues } from "../utils/petUtils";
import type { PetResponse } from "../models/pet";

type PetFormField = keyof PetFormValues | "clinicaId";
type PetFormErrors = Partial<Record<PetFormField, string>>;

export function usePetForm(pet: PetResponse | null, onSaved: () => void) {
  const create = useCreatePet();
  const update = useUpdatePet();
  const mutation = pet ? update : create;
  const clinics = useClinics(!pet);
  const [clinicId, setClinicId] = useState<number | null>(null);
  const clinicAvailable = !clinics.isError && clinics.data?.some((clinic) => clinic.id === clinicId);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => pet ? petToForm(pet) : { ...emptyPetForm });
  const [touched, setTouched] = useState<Partial<Record<PetFormField, boolean>>>({});
  const validation: PetFormErrors = validatePetForm(form);
  if (!pet && !clinicAvailable) validation.clinicaId = "Selecione uma clínica disponível e confirme o aviso.";
  const handleBlur = (field: PetFormField) => setTouched((current) => ({ ...current, [field]: true }));
  const setField = (field: keyof PetFormValues, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const stepFields: PetFormField[][] = [["name", "species", "breed"], ["sex", "birthDate"], pet ? ["fotoUrl"] : ["fotoUrl", "clinicaId"]];
  const fieldErrors: PetFormErrors = {};
  for (const field of stepFields.flat()) {
    if (touched[field]) fieldErrors[field] = validation[field];
  }

  const handleNext = async () => {
    if (mutation.isPending || (!pet && step === 3 && clinics.isFetching)) return;
    const fields = step === 3 ? stepFields.flat() : stepFields[step - 1];
    setTouched((current) => ({ ...current, ...Object.fromEntries(fields.map((field) => [field, true])) }));
    if (fields.some((field) => validation[field])) return;
    if (step < 3) { setStep(step + 1); return; }
    try {
      if (pet) {
        const changes = petFormPatch(form, pet);
        if (Object.keys(changes).length === 0) { onSaved(); return; }
        await update.mutateAsync({ id: pet.id, changes });
      } else {
        await create.mutateAsync({ ...petFormFields(form), clinicaId: clinicId });
      }
      onSaved();
    } catch {
      // O erro da mutation é apresentado no formulário.
    }
  };

  return {
    clinics, clinicId, setClinicId, step, form, touched, validation, fieldErrors,
    setField, handleBlur, handleNext,
    handleBack: () => setStep((current) => current - 1),
    isPending: mutation.isPending,
    errorMessage: mutation.error ? getPetErrorMessage(mutation.error) : null,
  };
}
