import type { CareNotificationCategory, CareNotificationCounts, CareNotificationData, CareNotificationPlan, CareNotificationTime, CareNotificationTimes } from '../models/notification';
import type { PetResponse } from '../models/pet';
import type { LembreteResponse } from '../models/reminder';
import { parseReminderDate } from './reminderUtils';

export const CARE_NOTIFICATION_PREFIX = 'fidelis-care-v1:';
export const notificationApiScope = (process.env.EXPO_PUBLIC_API_URL ?? '').trim().replace(/\/+$/, '');
export const DEFAULT_CARE_TIME: CareNotificationTime = { hour: 9, minute: 0 };

export const CARE_CATEGORIES: { key: CareNotificationCategory; label: string; icon: 'shield' | 'heart' | 'corner-up-left' | 'activity' | 'sun' | 'bell' }[] = [
  { key: 'vaccines', label: 'Vacinas', icon: 'shield' },
  { key: 'medicines', label: 'Medicamentos', icon: 'heart' },
  { key: 'returns', label: 'Retornos', icon: 'corner-up-left' },
  { key: 'checkups', label: 'Checkups', icon: 'activity' },
  { key: 'deworming', label: 'Vermífugos', icon: 'sun' },
  { key: 'other', label: 'Outros lembretes', icon: 'bell' },
];

export function careCategory(tipo: string): CareNotificationCategory {
  const type = tipo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toUpperCase();
  const categories: Record<string, CareNotificationCategory> = {
    VACINA: 'vaccines', MEDICAMENTO: 'medicines', RETORNO: 'returns', CHECKUP: 'checkups', VERMIFUGO: 'deworming',
  };
  return categories[type] ?? 'other';
}

export function defaultCareTimes(time = DEFAULT_CARE_TIME): CareNotificationTimes {
  return Object.fromEntries(CARE_CATEGORIES.map(({ key }) => [key, { ...time }])) as CareNotificationTimes;
}

export function emptyCareCounts(): CareNotificationCounts {
  return Object.fromEntries(CARE_CATEGORIES.map(({ key }) => [key, 0])) as CareNotificationCounts;
}

export function isCareTimes(value: unknown): value is CareNotificationTimes {
  return !!value && typeof value === 'object'
    && CARE_CATEGORIES.every(({ key }) => isCareTime((value as CareNotificationTimes)[key]));
}

export function isCareTime(value: unknown): value is CareNotificationTime {
  if (!value || typeof value !== 'object') return false;
  const time = value as CareNotificationTime;
  return Number.isInteger(time.hour) && time.hour >= 0 && time.hour < 24
    && Number.isInteger(time.minute) && time.minute >= 0 && time.minute < 60;
}

export function readCareNotificationData(value: unknown): CareNotificationData | null {
  if (!value || typeof value !== 'object') return null;
  const data = value as CareNotificationData;
  return data.kind === 'fidelis-care' && data.version === 1 && data.apiUrl === notificationApiScope
    && notificationApiScope !== '' && [data.tutorId, data.petId, data.reminderId].every(id => Number.isInteger(id) && id > 0)
    && Number.isFinite(data.fireAt) ? data : null;
}

// A data do cuidado é um dia civil no app; o horário é uma preferência local do tutor.
export function planCareNotifications(tutorId: number, pets: PetResponse[], reminders: LembreteResponse[], times: CareNotificationTimes): CareNotificationPlan[] {
  if (!notificationApiScope || !isCareTimes(times)) return [];
  const ownedPets = new Map(pets.filter(pet => pet.tutorId === tutorId).map(pet => [pet.id, pet]));
  return reminders.flatMap(reminder => {
    const pet = ownedPets.get(reminder.petId);
    if (!pet || reminder.tutorId !== tutorId || reminder.status !== 'P' || !Number.isInteger(reminder.id) || reminder.id <= 0) return [];
    const category = careCategory(reminder.tipo);
    const time = times[category];
    const date = parseReminderDate(reminder.dataPrevista);
    date.setHours(time.hour, time.minute, 0, 0);
    if (!Number.isFinite(date.getTime())) return [];
    return [{
      category,
      identifier: `${CARE_NOTIFICATION_PREFIX}${tutorId}:${reminder.id}`,
      title: `${pet.nome}: ${reminder.tipo}`.slice(0, 100),
      body: reminder.descricao.slice(0, 200),
      data: { kind: 'fidelis-care' as const, version: 1 as const, apiUrl: notificationApiScope,
        tutorId, petId: pet.id, reminderId: reminder.id, fireAt: date.getTime() },
    }];
  }).sort((a, b) => a.data.fireAt - b.data.fireAt || a.data.reminderId - b.data.reminderId);
}
