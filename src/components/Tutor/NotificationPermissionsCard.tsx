import { ActivityIndicator, Modal, Platform, Pressable, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNotificationPermissions } from '../../hooks/useNotificationPermissions';
import { useCareNotifications } from '../../context/CareNotificationsContext';
import { CARE_CATEGORIES } from '../../utils/careNotificationUtils';
import type { CareNotificationCategory } from '../../models/notification';

export default function NotificationPermissionsCard() {
  const { permissions, busy, error, request, requestExactAlarms, openSettings, refresh } = useNotificationPermissions();
  const schedule = useCareNotifications();
  const [editing, setEditing] = useState<CareNotificationCategory | null>(null);
  const [draftTime, setDraftTime] = useState(new Date());
  const refreshSchedule = schedule.refresh;
  const syncLocal = schedule.syncLocal;
  useEffect(() => { if (permissions) syncLocal(); }, [permissions, syncLocal]);
  const enabled = permissions?.granted && permissions.channelEnabled;
  const counts = schedule.scheduledCounts;
  const total = counts ? Object.values(counts).reduce((sum, count) => sum + count, 0) : null;
  const displayedError = error ?? schedule.error;
  const updating = busy || schedule.isUpdating;

  const selectCategory = (category: CareNotificationCategory) => {
    const date = new Date();
    date.setHours(schedule.times[category].hour, schedule.times[category].minute, 0, 0);
    setDraftTime(date);
    setEditing(category);
  };

  return <View className="gap-3 rounded-card border border-line bg-card p-[14px]">
    <View className="flex-row items-center justify-between gap-2">
      <View className="flex-row items-center gap-2">
        <Feather name="bell" size={22} color="#0E7A63" />
        <Text className="font-sans-semibold text-title text-ink">Notificações</Text>
      </View>
      {permissions?.supported && <View className="rounded-badge bg-clinic-50 px-3 py-1">
        <Text className="font-sans-medium text-label text-clinic-ink">{enabled ? 'Ativadas' : 'Desativadas'}</Text>
      </View>}
    </View>
    {!permissions && busy && <ActivityIndicator color="#0E7A63" />}
    {permissions && !permissions.supported && <Text className="font-sans text-body text-slate">Disponível no aplicativo Android ou iOS.</Text>}
    {permissions?.supported && <>
      <View className="flex-row items-center gap-3 rounded-control bg-clinic-50 px-3 py-3">
        {total === null && !displayedError ? <ActivityIndicator color="#0E7A63" />
          : <Text className="font-mono-medium text-title text-clinic-ink">{total ?? '—'}</Text>}
        <Text className="flex-1 font-sans-medium text-body text-clinic-ink">Notificações agendadas</Text>
      </View>
      <Text className="font-sans text-label text-slate">Na data de cada cuidado. Sem pendências, sem avisos.</Text>
      {CARE_CATEGORIES.map(category => {
        const time = schedule.times[category.key];
        const label = String(time.hour).padStart(2, '0') + ':' + String(time.minute).padStart(2, '0');
        return <Pressable key={category.key} accessibilityRole="button"
          accessibilityLabel={'Alterar horário de ' + category.label + ', atualmente ' + label}
          disabled={schedule.saving} onPress={() => selectCategory(category.key)}
          className="flex-row items-center gap-3 rounded-control border border-line px-3 py-3">
          <Feather name={category.icon} size={21} color="#0E7A63" />
          <View className="flex-1">
            <Text className="font-sans-medium text-body text-ink">{category.label}</Text>
            <Text className="font-sans text-label text-slate">{counts ? counts[category.key] + ' agendadas' : 'Aguardando atualização'}</Text>
          </View>
          <View className="flex-row items-center gap-1 rounded-badge bg-clinic-50 px-2 py-1">
            <Feather name="clock" size={14} color="#0E7A63" />
            <Text className="font-mono-medium text-body text-clinic-ink">{label}</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#0E7A63" />
        </Pressable>;
      })}
      {editing && Platform.OS === 'android' && <DateTimePicker mode="time" display="spinner" value={draftTime} is24Hour
        positiveButton={{ label: 'Salvar', textColor: '#0E7A63' }} negativeButton={{ label: 'Cancelar' }}
        onChange={(event, date) => {
          setEditing(null);
          if (event.type === 'set' && date) void schedule.changeTime(editing, { hour: date.getHours(), minute: date.getMinutes() });
        }} />}
      {Platform.OS === 'ios' && <Modal visible={editing !== null} transparent animationType="fade" onRequestClose={() => setEditing(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', padding: 24 }}>
          <View accessibilityViewIsModal className="gap-4 rounded-card bg-card p-5">
            <Text className="font-sans-semibold text-title text-ink">Horário de {CARE_CATEGORIES.find(category => category.key === editing)?.label.toLowerCase()}</Text>
            <DateTimePicker mode="time" display="spinner" themeVariant="light" textColor="#182D29" value={draftTime} is24Hour
              onChange={(_, date) => { if (date) setDraftTime(date); }} />
            <View className="flex-row gap-3">
              <Pressable accessibilityRole="button" onPress={() => setEditing(null)} className="flex-1 items-center rounded-control border border-line px-3 py-3">
                <Text className="font-sans-medium text-body text-ink">Cancelar</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => {
                if (editing) void schedule.changeTime(editing, { hour: draftTime.getHours(), minute: draftTime.getMinutes() });
                setEditing(null);
              }} className="flex-1 items-center rounded-control bg-clinic px-3 py-3">
                <Text className="font-sans-medium text-body text-white">Salvar horário</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>}
      {schedule.saving && <ActivityIndicator color="#0E7A63" />}
      {!enabled && <Pressable accessibilityRole="button" disabled={busy}
        onPress={!permissions.granted && permissions.canAskAgain ? request : openSettings}
        className="items-center rounded-control bg-clinic px-4 py-3">
        <Text className="font-sans-medium text-body text-white">Ativar notificações</Text>
      </Pressable>}
      {enabled && !permissions.exactAlarmGranted && <Pressable accessibilityRole="button" disabled={busy} onPress={requestExactAlarms}
        className="items-center rounded-control bg-clinic px-4 py-3">
        <Text className="font-sans-medium text-body text-white">Permitir horário exato</Text>
      </Pressable>}
      <View className="flex-row justify-between gap-3">
        <Pressable accessibilityRole="button" accessibilityState={{ busy: updating, disabled: updating || schedule.saving }}
          disabled={updating || schedule.saving} onPress={() => { void refresh(); void refreshSchedule(); }} className="flex-row items-center gap-2 py-2">
          {updating ? <ActivityIndicator size="small" color="#0E7A63" /> : <Feather name="refresh-cw" size={17} color="#0E7A63" />}
          <Text accessibilityLiveRegion="polite" className="font-sans-medium text-body text-clinic">{updating ? 'Atualizando...' : 'Atualizar'}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" disabled={busy} onPress={openSettings} className="flex-row items-center gap-2 py-2">
          <Feather name="settings" size={17} color="#0E7A63" /><Text className="font-sans-medium text-body text-clinic">Permissões</Text>
        </Pressable>
      </View>
    </>}
    {displayedError && <Text accessibilityRole="alert" className="font-sans text-body text-alert">{displayedError}</Text>}
  </View>;
}
