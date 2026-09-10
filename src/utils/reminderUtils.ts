import type { LembreteResponse } from "../models/reminder";
import type { PetResponse } from "../models/pet";

export function selectClinicAgenda(reminders: LembreteResponse[], pets: PetResponse[], clinicId: number | undefined, onlyPending = true) {
  if (!Number.isInteger(clinicId) || (clinicId ?? 0) <= 0) return [];
  const clinicPets = new Map(pets.filter((pet) => pet.clinicaId === clinicId).map((pet) => [pet.id, pet]));
  return reminders.flatMap((reminder) => {
    const pet = clinicPets.get(reminder.petId);
    return (!onlyPending || reminder.status === "P") && pet && reminder.tutorId === pet.tutorId ? [{ reminder, pet }] : [];
  }).sort((a, b) => a.reminder.dataPrevista.localeCompare(b.reminder.dataPrevista) || a.reminder.id - b.reminder.id);
}

export class ReminderFlowError extends Error {
  constructor(public readonly status: number) {
    super("Reminder operation unavailable");
    this.name = "ReminderFlowError";
  }
}

export function requireReminderId(id: unknown): asserts id is number {
  if (typeof id !== "number" || !Number.isInteger(id) || id <= 0 || id > 2147483647) throw new ReminderFlowError(400);
}

export function validateReminderText(tipo: string, descricao: string): boolean {
  return !!tipo.trim() && tipo.trim().length <= 50 && !!descricao.trim();
}

// O seletor trabalha com dia civil local, sem conversão UTC que desloque o dia.
export function serializeReminderDate(date: Date): string {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) throw new ReminderFlowError(400);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${String(date.getFullYear()).padStart(4, "0")}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00:00`;
}

export function parseReminderDate(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value)) return new Date(NaN);
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  if (year < 1 || date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return new Date(NaN);
  return date;
}

export function formatReminderDate(value: string): string {
  return parseReminderDate(value).toLocaleDateString("pt-BR");
}

export function reminderStatusLabel(item: LembreteResponse): string {
  if (item.status === "C") return "CONCLUÍDO";
  if (item.status === "X") return "CANCELADO";
  if (item.status !== "P") return "STATUS NÃO RECONHECIDO";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parseReminderDate(item.dataPrevista) < today ? "ATRASADO" : "PENDENTE";
}

export function groupReminders(items: LembreteResponse[], filter: string) {
  const filtered = items.filter((item) => filter === "Todos" || item.tipo === filter);
  return ["ATRASADO", "PENDENTE", "CONCLUÍDO", "CANCELADO", "STATUS NÃO RECONHECIDO"].map((status) => ({
    status, items: filtered.filter((item) => reminderStatusLabel(item) === status),
  }));
}

export function upcomingReminders(items: LembreteResponse[]): LembreteResponse[] {
  return items.filter((item) => item.status === "P")
    .sort((a, b) => a.dataPrevista.localeCompare(b.dataPrevista)).slice(0, 3);
}

export function isReminderUrgent(item: LembreteResponse): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((parseReminderDate(item.dataPrevista).getTime() - today.getTime()) / 86400000) <= 3;
}

export function getReminderErrorMessage(error: unknown): string {
  let status: unknown;
  if (error instanceof ReminderFlowError) status = error.status;
  else if (error && typeof error === "object" && "response" in error) {
    const response = error.response;
    if (response && typeof response === "object" && "status" in response) status = response.status;
  }
  if (status === 400) return "Confira o tipo, a descrição, a data e o pet informados.";
  if (status === 401) return "Sua sessão não está disponível. Entre novamente.";
  if (status === 403) return "O lembrete ou pet não está disponível para seu usuário.";
  if (status === 404) return "Lembrete ou pet não encontrado. Atualize a lista.";
  if (typeof status === "number" && status >= 500) return "O serviço de lembretes está indisponível. Tente novamente.";
  return "Não foi possível concluir a operação. Verifique sua conexão e tente novamente.";
}
