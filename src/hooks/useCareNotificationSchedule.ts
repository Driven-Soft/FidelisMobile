import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useUserContext } from '../context/UserContext';
import { usePets } from './usePets';
import { useReminders } from './useReminders';
import type { CareNotificationTime } from '../models/notification';
import { DEFAULT_CARE_TIME, planCareNotifications } from '../utils/careNotificationUtils';
import { readNotificationPermissions, supportsLocalNotifications } from '../services/notificationService';
import { installCareNotificationHandler, loadCareNotificationTime, removeOtherAccountsCareNotifications, saveCareNotificationTime, syncCareNotifications } from '../services/careNotificationService';

export function useCareNotificationSchedule() {
  const { session, authStatus } = useUserContext();
  const pets = usePets();
  const reminders = useReminders();
  const tutorId = authStatus === 'authenticated' && session?.tipo === 'TUTOR' ? session.tutorId : null;
  const currentTutor = useRef(tutorId);
  currentTutor.current = tutorId;
  const [time, setTime] = useState(DEFAULT_CARE_TIME);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scheduledCount, setScheduledCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision(value => value + 1), []);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!supportsLocalNotifications || loaded) return;
    let active = true;
    void loadCareNotificationTime().then(value => {
      if (active) { setTime(value); setLoaded(true); }
    }).catch(() => { if (active) setError('Não foi possível ler o horário dos avisos. Tente novamente.'); });
    return () => { active = false; };
  }, [loaded, revision]);

  useEffect(() => {
    if (!supportsLocalNotifications) return;
    let active = true;
    let dispose: (() => void) | undefined;
    void installCareNotificationHandler(() => currentTutor.current).then(cleanup => {
      if (active) dispose = cleanup; else cleanup();
    }).catch(() => { if (active) setError('Não foi possível preparar o recebimento das notificações. Reinicie o app.'); });
    const listener = AppState.addEventListener('change', state => { if (state === 'active') refresh(); });
    const interval = setInterval(refresh, 30000);
    return () => { active = false; dispose?.(); listener.remove(); clearInterval(interval); };
  }, [refresh]);

  useEffect(() => {
    if (!supportsLocalNotifications || authStatus === 'restoring') return;
    let active = true;
    const isCurrent = () => active && currentTutor.current === tutorId;
    setScheduledCount(null);
    void removeOtherAccountsCareNotifications(tutorId, isCurrent).catch(() => {
      if (isCurrent()) setError('Não foi possível limpar avisos da sessão anterior. Tente novamente.');
    });
    return () => { active = false; };
  }, [tutorId, authStatus, revision]);

  useEffect(() => {
    if (!supportsLocalNotifications || !loaded || tutorId === null || !pets.isSuccess || !reminders.isSuccess) return;
    let active = true;
    const isCurrent = () => active && currentTutor.current === tutorId;
    void (async () => {
      const permission = await readNotificationPermissions();
      if (!isCurrent()) return;
      const plans = permission.granted && permission.channelEnabled
        ? planCareNotifications(tutorId, pets.data, reminders.data, time) : [];
      const count = await syncCareNotifications(plans, isCurrent);
      if (isCurrent()) { setScheduledCount(count); setError(null); }
    })().catch(() => { if (isCurrent()) setError('Não foi possível atualizar os avisos neste aparelho. Tente novamente.'); });
    return () => { active = false; };
  }, [tutorId, loaded, pets.data, pets.isSuccess, reminders.data, reminders.isSuccess, time, revision]);

  const changeTime = async (next: CareNotificationTime) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    try { await saveCareNotificationTime(next); setTime(next); setLoaded(true); setError(null); refresh(); }
    catch { setError('Não foi possível salvar o horário. Tente novamente.'); }
    finally { savingRef.current = false; setSaving(false); }
  };

  const refetchPets = pets.refetch;
  const refetchReminders = reminders.refetch;
  const retry = useCallback(() => {
    refresh();
    if (supportsLocalNotifications && tutorId !== null) {
      void refetchPets();
      void refetchReminders();
    }
  }, [refresh, tutorId, refetchPets, refetchReminders]);

  return { time, saving, scheduledCount, changeTime, refresh: retry,
    error: error ?? (tutorId !== null && (pets.isError || reminders.isError)
      ? 'Não foi possível consultar os cuidados na API. Os avisos anteriores podem estar desatualizados.' : null) };
}
