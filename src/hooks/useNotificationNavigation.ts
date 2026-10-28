import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUserContext } from '../context/UserContext';
import type { CareNotificationData } from '../models/notification';
import { listenToCareNotificationResponses } from '../services/notificationResponseService';
import { navigationRef } from '../routes/navigationRef';
import { petKeys } from './usePets';
import { reminderKeys } from './useReminders';

export function useNotificationNavigation() {
  const { session, authStatus } = useUserContext();
  const queryClient = useQueryClient();
  const [pending, setPending] = useState<CareNotificationData | null>(null);
  const [navigationRevision, setNavigationRevision] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const previousSession = useRef(session);
  const consumed = useRef<CareNotificationData | null>(null);
  const onNavigationReady = useCallback(() => setNavigationRevision(value => value + 1), []);

  useEffect(() => {
    let active = true;
    let dispose: (() => void) | undefined;
    void listenToCareNotificationResponses(data => { if (active) setPending(data); }).then(cleanup => {
      if (active) dispose = cleanup; else cleanup();
    }).catch(() => { if (active) setError('Não foi possível abrir avisos automaticamente. Reinicie o aplicativo ou consulte Meus Pets.'); });
    return () => { active = false; dispose?.(); };
  }, []);

  useEffect(() => {
    if (previousSession.current && !session) setPending(null);
    previousSession.current = session;
  }, [session]);

  useEffect(() => {
    if (!pending || consumed.current === pending || authStatus !== 'authenticated' || !session) return;
    if (session.tipo !== 'TUTOR' || session.tutorId !== pending.tutorId) {
      consumed.current = pending;
      setPending(null);
      return;
    }
    if (Date.parse(session.expiraEm) <= Date.now() || !navigationRef.isReady()
      || !navigationRef.getRootState()?.routeNames.includes('Tabs')) return;
    consumed.current = pending;
    setPending(null);
    void queryClient.invalidateQueries({ queryKey: petKeys.scope(session.tutorId, session.expiraEm) });
    void queryClient.invalidateQueries({ queryKey: reminderKeys.scope(session) });
    navigationRef.navigate('Tabs', {
      screen: 'Pets', params: { screen: 'PetProfile', params: { petId: pending.petId, reminderId: pending.reminderId }, initial: false },
    });
  }, [pending, authStatus, session, navigationRevision, queryClient]);

  return { onNavigationReady, error };
}
