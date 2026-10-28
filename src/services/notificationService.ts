import { Linking, Platform } from 'react-native';
import type { NotificationPermissionState } from '../models/notification';

export const CARE_CHANNEL_ID = 'fidelis-cuidados';

const unsupported: NotificationPermissionState = {
  supported: false, granted: false, canAskAgain: false,
  exactAlarmGranted: false, channelEnabled: false,
};

export const supportsLocalNotifications = Platform.OS === 'android' || Platform.OS === 'ios';

// O módulo nativo não é carregado no navegador.
export async function getNotifications() {
  const notifications = await import('expo-notifications');
  if (Platform.OS === 'android') {
    await notifications.setNotificationChannelAsync(CARE_CHANNEL_ID, {
      name: 'Cuidados dos pets',
      description: 'Lembretes de cuidados cadastrados pela clínica.',
      importance: notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }
  return notifications;
}

export async function readNotificationPermissions(): Promise<NotificationPermissionState> {
  if (!supportsLocalNotifications) return unsupported;
  const notifications = await getNotifications();
  const permission = await notifications.getPermissionsAsync();
  const exact = Platform.OS === 'android' ? await notifications.getExactAlarmPermissionsAsync() : null;
  const channel = Platform.OS === 'android' ? await notifications.getNotificationChannelAsync(CARE_CHANNEL_ID) : null;
  return {
    supported: true,
    granted: permission.granted || permission.ios?.status === notifications.IosAuthorizationStatus.PROVISIONAL,
    canAskAgain: permission.canAskAgain,
    exactAlarmGranted: exact?.granted ?? true,
    channelEnabled: Platform.OS !== 'android' || (!!channel && channel.importance !== notifications.AndroidImportance.NONE),
  };
}

export async function requestNotificationPermissions(): Promise<NotificationPermissionState> {
  if (!supportsLocalNotifications) return unsupported;
  const notifications = await getNotifications();
  await notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowSound: true, allowBadge: false } });
  return readNotificationPermissions();
}

export async function requestExactCareAlarms(): Promise<NotificationPermissionState> {
  if (!supportsLocalNotifications) return unsupported;
  if (Platform.OS === 'android') {
    const notifications = await getNotifications();
    await notifications.requestExactAlarmPermissionsAsync();
  }
  return readNotificationPermissions();
}

export async function openNotificationSettings(): Promise<void> {
  if (supportsLocalNotifications) await Linking.openSettings();
}
