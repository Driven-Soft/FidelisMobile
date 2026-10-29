import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useUserContext } from '../context/UserContext';
import { usePets } from './usePets';
import { useReminders } from './useReminders';
import type { CareNotificationCategory, CareNotificationCounts, CareNotificationTime } from '../models/notification';
import { defaultCareTimes, planCareNotifications } from '../utils/careNotificationUtils';
import { readNotificationPermissions, supportsLocalNotifications } from '../services/notificationService';
import { installCareNotificationHandler, loadCareNotificationTime, removeOtherAccountsCareNotifications, saveCareNotificationTime, syncCareNotifications } from '../services/careNotificationService';

export function useCareNotificationSchedule() {
  const { session, authStatus } = useUserContext();
  const pets = usePets();
  const reminders = useReminders();
  const tutorId = authStatus === 'authenticated' && session?.tipo === 'TUTOR' ? session.tutorId : null;
  const currentTutor = useRef(tutorId);
  currentTutor.current = tutorId;
  const [times, setTimes] = useState(defaultCareTimes);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const refreshingRef = useRef(false);
  const [scheduledCounts, setScheduledCounts] = useState<CareNotificationCounts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision(value => value + 1), []);
  const savingRef = useRef(false);

  // Troca de conta invalida a contagem; durante a atualização mantém a última confirmada.
  useEffect(() => { setScheduledCounts(null); }, [tutorId]);

  useEffect(() => {
    if (!supportsLocalNotifications || loaded) return;
    let active = true;
    void loadCareNotificationTime().then(value => {
      if (active) { setTimes(value); setLoaded(true); }
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
    return () => { active = false; dispose?.(); listener.remove(); };
  }, [refresh]);

  useEffect(() => {
    if (!supportsLocalNotifications || authStatus === 'restoring') return;
    let active = true;
    const isCurrent = () => active && currentTutor.current === tutorId;
    void removeOtherAccountsCareNotifications(tutorId, isCurrent).catch(() => {
      if (isCurrent()) setError('Não foi possível limpar avisos da sessão anterior. Tente novamente.');
    });
    return () => { active = false; };
  }, [tutorId, authStatus, revision]);

  useEffect(() => {
    if (!supportsLocalNotifications || !loaded || tutorId === null || !pets.isSuccess || !reminders.isSuccess) return;
    let active = true;
    const isCurrent = () => active && currentTutor.current === tutorId;
    setSyncing(true);
    void (async () => {
      const permission = await readNotificationPermissions();
      if (!isCurrent()) return;
      const plans = permission.granted && permission.channelEnabled
        ? planCareNotifications(tutorId, pets.data, reminders.data, times) : [];
      const count = await syncCareNotifications(plans, isCurrent);
      if (isCurrent()) { setScheduledCounts(count); setError(null); }
    })().catch(() => { if (isCurrent()) setError('Não foi possível atualizar os avisos neste aparelho. Tente novamente.'); })
      .finally(() => { if (active) setSyncing(false); });
    return () => { active = false; setSyncing(false); };
  }, [tutorId, loaded, pets.data, pets.isSuccess, reminders.data, reminders.isSuccess, times, revision]);

  const changeTime = async (category: CareNotificationCategory, next: CareNotificationTime) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    const updated = { ...times, [category]: next };
    try { await saveCareNotificationTime(updated); setTimes(updated); setLoaded(true); setError(null); refresh(); }
    catch { setError('Não foi possível salvar o horário. Tente novamente.'); }
    finally { savingRef.current = false; setSaving(false); }
  };

  const refetchPets = pets.refetch;
  const refetchReminders = reminders.refetch;
  const retry = useCallback(async () => {
    if (!supportsLocalNotifications || tutorId === null || refreshingRef.current) return;
    refreshingRef.current = true;
    setRefreshing(true);
    try {
      await Promise.all([refetchPets(), refetchReminders()]);
      refresh();
    } finally {
      refreshingRef.current = false;
      setRefreshing(false);
    }
  }, [refresh, tutorId, refetchPets, refetchReminders]);

  return { times, saving, scheduledCounts: error || pets.isError || reminders.isError ? null : scheduledCounts,
    changeTime, refresh: retry, syncLocal: refresh,
    isUpdating: refreshing || syncing || pets.isFetching || reminders.isFetching,
    error: error ?? (tutorId !== null && (pets.isError || reminders.isError)
      ? 'Não foi possível consultar os cuidados na API. Os avisos anteriores podem estar desatualizados.' : null) };
}
