import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CareNotificationCounts, CareNotificationPlan, CareNotificationTimes } from '../models/notification';
import { CARE_NOTIFICATION_PREFIX, defaultCareTimes, emptyCareCounts, isCareTime, isCareTimes, readCareNotificationData } from '../utils/careNotificationUtils';
import { CARE_CHANNEL_ID, getNotifications, supportsLocalNotifications } from './notificationService';

const TIME_KEY = '@fidelis:care_notification_time';
// Reserva margem para o limite de notificações pendentes no iOS.
const MAX_SCHEDULED_CARES = 60;
let queue: Promise<unknown> = Promise.resolve();

export async function loadCareNotificationTime(): Promise<CareNotificationTimes> {
  const stored = await AsyncStorage.getItem(TIME_KEY);
  if (!stored) return defaultCareTimes();
  try {
    const time: unknown = JSON.parse(stored);
    // Preserva o horário único escolhido na versão anterior para todas as categorias.
    return isCareTimes(time) ? time : isCareTime(time) ? defaultCareTimes(time) : defaultCareTimes();
  } catch { return defaultCareTimes(); }
}

export async function saveCareNotificationTime(time: CareNotificationTimes): Promise<void> {
  if (!isCareTimes(time)) throw new Error('Horário inválido.');
  await AsyncStorage.setItem(TIME_KEY, JSON.stringify(time));
}

function matches(content: { title?: string | null; body?: string | null; data?: Record<string, unknown> }, plan: CareNotificationPlan): boolean {
  const data = readCareNotificationData(content.data);
  return !!data && data.tutorId === plan.data.tutorId && data.petId === plan.data.petId
    && data.reminderId === plan.data.reminderId && data.fireAt === plan.data.fireAt
    && content.title === plan.title && content.body === plan.body;
}

// Serializa cancelamento/agendamento para impedir que uma resposta antiga recrie avisos após logout.
export function syncCareNotifications(plans: CareNotificationPlan[], isCurrent: () => boolean): Promise<CareNotificationCounts> {
  const operation = queue.catch(() => undefined).then(async () => {
    if (!supportsLocalNotifications || !isCurrent()) return emptyCareCounts();
    const notifications = await getNotifications();
    const pending = await notifications.getAllScheduledNotificationsAsync();
    const future = plans.filter(plan => plan.data.fireAt > Date.now()).slice(0, MAX_SCHEDULED_CARES);
    const desired = new Map(future.map(plan => [plan.identifier, plan]));
    const existing = new Set<string>();
    for (const item of pending) {
      if (!isCurrent()) return emptyCareCounts();
      if (!item.identifier.startsWith(CARE_NOTIFICATION_PREFIX)) continue;
      const plan = desired.get(item.identifier);
      if (plan && matches(item.content, plan)) existing.add(item.identifier);
      else await notifications.cancelScheduledNotificationAsync(item.identifier);
    }
    const valid = new Map(plans.map(plan => [plan.identifier, plan]));
    const presented = await notifications.getPresentedNotificationsAsync();
    for (const item of presented) {
      if (!isCurrent()) return emptyCareCounts();
      if (!item.request.identifier.startsWith(CARE_NOTIFICATION_PREFIX)) continue;
      const plan = valid.get(item.request.identifier);
      if (!plan || !matches(item.request.content, plan)) await notifications.dismissNotificationAsync(item.request.identifier);
    }
    for (const plan of future) {
      if (!isCurrent()) return emptyCareCounts();
      if (existing.has(plan.identifier) || plan.data.fireAt <= Date.now()) continue;
      const id = await notifications.scheduleNotificationAsync({
        identifier: plan.identifier,
        content: { title: plan.title, body: plan.body, sound: 'default', data: { ...plan.data } },
        trigger: { type: notifications.SchedulableTriggerInputTypes.DATE, date: new Date(plan.data.fireAt), channelId: CARE_CHANNEL_ID },
      });
      if (!isCurrent()) { await notifications.cancelScheduledNotificationAsync(id); return emptyCareCounts(); }
    }
    // Conta o que o sistema confirmou, não apenas o que pretendemos agendar.
    const counts = emptyCareCounts();
    for (const item of await notifications.getAllScheduledNotificationsAsync()) {
      const plan = desired.get(item.identifier);
      if (plan && plan.data.fireAt > Date.now() && matches(item.content, plan)) counts[plan.category]++;
    }
    return counts;
  });
  queue = operation;
  return operation;
}

export async function installCareNotificationHandler(currentTutor: () => number | null): Promise<() => void> {
  if (!supportsLocalNotifications) return () => undefined;
  const notifications = await getNotifications();
  notifications.setNotificationHandler({ handleNotification: async notification => {
    const data = readCareNotificationData(notification.request.content.data);
    const visible = !!data && data.tutorId === currentTutor();
    return { shouldShowBanner: visible, shouldShowList: visible, shouldPlaySound: visible, shouldSetBadge: false };
  } });
  return () => notifications.setNotificationHandler(null);
}

export function removeOtherAccountsCareNotifications(tutorId: number | null, isCurrent: () => boolean): Promise<void> {
  const operation = queue.catch(() => undefined).then(async () => {
    if (!supportsLocalNotifications || !isCurrent()) return;
    const notifications = await getNotifications();
    const pending = await notifications.getAllScheduledNotificationsAsync();
    for (const item of pending) {
      if (!isCurrent()) return;
      if (item.identifier.startsWith(CARE_NOTIFICATION_PREFIX)
        && (tutorId === null || readCareNotificationData(item.content.data)?.tutorId !== tutorId)) {
        await notifications.cancelScheduledNotificationAsync(item.identifier);
      }
    }
    const presented = await notifications.getPresentedNotificationsAsync();
    for (const item of presented) {
      if (!isCurrent()) return;
      if (item.request.identifier.startsWith(CARE_NOTIFICATION_PREFIX)
        && (tutorId === null || readCareNotificationData(item.request.content.data)?.tutorId !== tutorId)) {
        await notifications.dismissNotificationAsync(item.request.identifier);
      }
    }
  });
  queue = operation;
  return operation;
}
