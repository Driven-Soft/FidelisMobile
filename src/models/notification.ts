export interface NotificationPermissionState {
  supported: boolean;
  granted: boolean;
  canAskAgain: boolean;
  exactAlarmGranted: boolean;
  channelEnabled: boolean;
}

export interface CareNotificationTime { hour: number; minute: number }

export interface CareNotificationData {
  kind: 'fidelis-care';
  version: 1;
  apiUrl: string;
  tutorId: number;
  petId: number;
  reminderId: number;
  fireAt: number;
}

export interface CareNotificationPlan {
  identifier: string;
  title: string;
  body: string;
  data: CareNotificationData;
}
