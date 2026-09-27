import { useState, useRef } from "react";
import { Platform } from "react-native";
import { useVeterinarianReminderActions } from "./useVeterinarianReminders";
import { getReminderErrorMessage, parseReminderDate, serializeReminderDate, validateReminderText } from "../utils/reminderUtils";
import type { PetResponse } from "../models/pet";
import type { LembreteResponse } from "../models/reminder";

export function useReminderForm(pets: PetResponse[], reminder: LembreteResponse | null, onSaved: () => void) {
  const { create, update } = useVeterinarianReminderActions();
  const mutation = reminder ? update : create;
  const submitting = useRef(false);
  const [type, setType] = useState(reminder?.tipo ?? "VACINA");
  const [petId, setPetId] = useState<number | null>(pets?.[0]?.id || null);
  const [description, setDescription] = useState(reminder?.descricao ?? "");
  const [date, setDate] = useState(new Date());
  const [dateText, setDateText] = useState(() => serializeReminderDate(new Date()).slice(0, 10));
  const selectedDate = Platform.OS === "web" ? parseReminderDate(dateText) : date;
  const [touched, setTouched] = useState(false);

  const selectedPet = pets.find((pet) => pet.id === petId) ?? (petId === null ? pets[0] : undefined);

  const isDescriptionValid = description.trim().length > 0;
  const error =
    touched && !isDescriptionValid ? "A descrição é obrigatória" : null;
  const dateError = !Number.isFinite(selectedDate.getTime()) ? "Informe uma data válida em AAAA-MM-DD." : undefined;

  const handleSave = async () => {
    setTouched(true);
    if (isSaveDisabled || submitting.current) return;
    submitting.current = true;
    try {
      if (reminder) await update.mutateAsync({ id: reminder.id, tipo: type, descricao: description });
      else {
        // A mesma condição já desabilita Salvar; explicita a nulidade neste ramo.
        if (!selectedPet) return;
        await create.mutateAsync({ tipo: type, descricao: description, date: selectedDate, petId: selectedPet.id });
      }
      onSaved();
    } catch {
      // A mutation mantém o formulário aberto e fornece o erro visual.
    } finally {
      submitting.current = false;
    }
  };

  const isSaveDisabled = mutation.isPending || !validateReminderText(type, description) || (!reminder && (!selectedPet || !Number.isFinite(selectedDate.getTime())));

  return {
    type, setType, setPetId, description, setDescription,
    date, setDate, dateText, setDateText, dateError, selectedPet,
    touched, setTouched, isDescriptionValid, error, isSaveDisabled, handleSave,
    isPending: mutation.isPending,
    errorMessage: mutation.error ? getReminderErrorMessage(mutation.error) : null,
  };
}
