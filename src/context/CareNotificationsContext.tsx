import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useCareNotificationSchedule } from '../hooks/useCareNotificationSchedule';

// Compartilha somente controles locais; dados de servidor continuam no TanStack Query.
const Context = createContext<ReturnType<typeof useCareNotificationSchedule> | null>(null);

export function CareNotificationsProvider({ children }: { children: ReactNode }) {
  const value = useCareNotificationSchedule();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useCareNotifications() {
  const value = useContext(Context);
  if (!value) throw new Error('CareNotificationsProvider não disponível.');
  return value;
}
