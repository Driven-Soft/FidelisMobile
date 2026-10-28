import type { NotificationResponse } from 'expo-notifications';
import type { CareNotificationData } from '../models/notification';
import { CARE_NOTIFICATION_PREFIX, readCareNotificationData } from '../utils/careNotificationUtils';
import { getNotifications, supportsLocalNotifications } from './notificationService';

export async function listenToCareNotificationResponses(onOpen: (data: CareNotificationData) => void): Promise<() => void> {
  if (!supportsLocalNotifications) return () => undefined;
  const notifications = await getNotifications();
  const handled = new Set<string>();
  const receive = (response: NotificationResponse) => {
    if (response.actionIdentifier !== notifications.DEFAULT_ACTION_IDENTIFIER) return;
    const request = response.notification.request;
    if (!request.identifier.startsWith(CARE_NOTIFICATION_PREFIX)) return;
    const key = `${request.identifier}:${response.notification.date}`;
    if (handled.has(key)) return;
    handled.add(key);
    const data = readCareNotificationData(request.content.data);
    if (data) onOpen(data);
    // O destino fica pendente em memória durante a restauração/login, sem repetir a abertura.
    notifications.clearLastNotificationResponse();
  };
  const subscription = notifications.addNotificationResponseReceivedListener(receive);
  try {
    const initialResponse = notifications.getLastNotificationResponse();
    if (initialResponse) receive(initialResponse);
  } catch (error) { subscription.remove(); throw error; }
  return () => subscription.remove();
}
