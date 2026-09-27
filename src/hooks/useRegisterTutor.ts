import { useRef, useState } from "react";
import { validateTutorRegistration, tutorRegistrationRequest, getRegistrationErrorMessage } from "../utils/tutorRegistration";
import type { TutorRegistrationForm } from "../utils/tutorRegistration";
import { useMutation } from "@tanstack/react-query";
import { criarTutor } from "../repositories/tutor/tutorRepository";
import type { TutorRequest, TutorResponse } from "../models/tutor";

type RegistrationField = keyof TutorRegistrationForm;

export function useRegisterTutor() {
  const registration = useMutation<TutorResponse, Error, TutorRequest>({
    mutationFn: criarTutor,
    retry: false,
  });
  const submitting = useRef(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TutorRegistrationForm>({
    name: "", email: "", phone: "", cpf: "", address: "", password: "", confirmPassword: "",
  });
  const [touched, setTouched] = useState<Partial<Record<RegistrationField, boolean>>>({});
  const stepFields: RegistrationField[][] = [["name", "email", "phone"], ["cpf", "address"], ["password", "confirmPassword"]];
  const validation = validateTutorRegistration(formData);
  const errors: Partial<Record<RegistrationField, string>> = {};
  for (const field of stepFields.flat()) {
    if (touched[field]) errors[field] = validation[field];
  }

  const handleInputChange = (field: RegistrationField, value: string) => {
    if (!submitting.current) setFormData((current) => ({ ...current, [field]: value }));
  };
  const handleBlur = (field: RegistrationField) => setTouched((current) => ({ ...current, [field]: true }));

  const handleNext = async () => {
    if (registration.isPending || submitting.current || registration.isSuccess) return;
    const fields = step === 3 ? stepFields.flat() : stepFields[step - 1];
    setTouched((current) => ({ ...current, ...Object.fromEntries(fields.map((field) => [field, true])) }));
    if (fields.some((field) => validation[field])) return;
    if (step < 3) { setStep(step + 1); return; }
    submitting.current = true;
    try {
      await registration.mutateAsync(tutorRegistrationRequest(formData));
      setFormData((current) => ({ ...current, password: "", confirmPassword: "" }));
    } catch {
      // A mutation mantém o formulário e expõe o erro para a interface.
    } finally {
      submitting.current = false;
    }
  };
  const handleBack = () => {
    if (!registration.isPending && !submitting.current && step > 1) setStep(step - 1);
  };

  return {
    step, formData, touched, validation, errors,
    handleInputChange, handleBlur, handleNext, handleBack,
    isPending: registration.isPending,
    isSuccess: registration.isSuccess,
    errorMessage: registration.error ? getRegistrationErrorMessage(registration.error) : null,
    canLeave: () => !submitting.current,
  };
}
