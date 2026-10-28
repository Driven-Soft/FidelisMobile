import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import type { NotificationPermissionState } from '../models/notification';
import { openNotificationSettings, readNotificationPermissions, requestExactCareAlarms, requestNotificationPermissions } from '../services/notificationService';

export function useNotificationPermissions() {
  const [permissions, setPermissions] = useState<NotificationPermissionState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);
  const running = useRef(false);

  const run = useCallback(async (action: () => Promise<NotificationPermissionState>) => {
    if (!mounted.current || running.current) return;
    running.current = true;
    setBusy(true);
    setError(null);
    try {
      const result = await action();
      if (mounted.current) setPermissions(result);
    } catch {
      if (mounted.current) setError('Não foi possível acessar as permissões. Confirme que instalou o APK atualizado e tente novamente.');
    } finally {
      running.current = false;
      if (mounted.current) setBusy(false);
    }
  }, []);

  const refresh = useCallback(() => run(readNotificationPermissions), [run]);
  useEffect(() => {
    mounted.current = true;
    void refresh();
    const listener = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refresh();
    });
    return () => { mounted.current = false; listener.remove(); };
  }, [refresh]);

  return {
    permissions, busy, error, refresh,
    request: () => run(requestNotificationPermissions),
    requestExactAlarms: () => run(requestExactCareAlarms),
    openSettings: () => run(async () => { await openNotificationSettings(); return readNotificationPermissions(); }),
  };
}
