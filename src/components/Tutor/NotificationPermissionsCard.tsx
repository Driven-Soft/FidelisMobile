import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useNotificationPermissions } from '../../hooks/useNotificationPermissions';
import { useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCareNotifications } from '../../context/CareNotificationsContext';

export default function NotificationPermissionsCard() {
  const { permissions, busy, error, request, requestExactAlarms, openSettings, refresh } = useNotificationPermissions();
  const schedule = useCareNotifications();
  const [showTime, setShowTime] = useState(false);
  const refreshSchedule = schedule.refresh;
  useEffect(() => { if (permissions) refreshSchedule(); }, [permissions, refreshSchedule]);
  const selectedTime = new Date();
  selectedTime.setHours(schedule.time.hour, schedule.time.minute, 0, 0);
  const timeLabel = `${String(schedule.time.hour).padStart(2, '0')}:${String(schedule.time.minute).padStart(2, '0')}`;
  return <View className="gap-3 rounded-card border border-line bg-card p-[14px]">
    <Text className="font-sans-semibold text-title text-ink">Notificações de cuidados</Text>
    <Text className="font-sans text-body text-slate">Permita avisos neste aparelho para os cuidados dos seus pets.</Text>
    {busy && <ActivityIndicator color="#0E7A63" />}
    {error && <>
      <Text accessibilityRole="alert" className="font-sans text-body text-alert">{error}</Text>
      <Pressable accessibilityRole="button" disabled={busy} onPress={refresh}><Text className="font-sans-medium text-body text-clinic">Tentar novamente</Text></Pressable>
    </>}
    {permissions && !permissions.supported && <Text className="font-sans text-body text-slate">Notificações locais estão disponíveis no aplicativo Android ou iOS.</Text>}
    {permissions?.supported && <>
      <Text className="font-sans text-body text-slate">Avisos na data prevista de cada cuidado pendente, às {timeLabel} (horário deste aparelho). Horários já passados não geram novos avisos.</Text>
      <Pressable accessibilityRole="button" disabled={schedule.saving} onPress={() => setShowTime(true)}>
        <Text className="font-sans-medium text-body text-clinic">Alterar horário dos avisos</Text>
      </Pressable>
      {showTime && <DateTimePicker mode="time" value={selectedTime} is24Hour onChange={(event, date) => {
        setShowTime(false);
        if (event.type === 'set' && date) void schedule.changeTime({ hour: date.getHours(), minute: date.getMinutes() });
      }} />}
      {schedule.saving && <ActivityIndicator color="#0E7A63" />}
      {schedule.error && <Text accessibilityRole="alert" className="font-sans text-body text-alert">{schedule.error}</Text>}
      {schedule.scheduledCount !== null && <Text className="font-sans text-body text-slate">{schedule.scheduledCount} aviso(s) futuro(s) agendado(s) neste aparelho (até 60 por vez).</Text>}
      <Pressable accessibilityRole="button" onPress={refreshSchedule}><Text className="font-sans-medium text-body text-clinic">Atualizar avisos</Text></Pressable>
      <Text className="font-sans text-body text-ink">{permissions.granted && permissions.channelEnabled ? 'Permissão de notificações concedida.' : 'Notificações desativadas neste aparelho.'}</Text>
      {!permissions.granted && permissions.canAskAgain && <Pressable accessibilityRole="button" disabled={busy} onPress={request} className="items-center rounded-control bg-clinic px-4 py-3">
        <Text className="font-sans-medium text-body text-white">Permitir notificações</Text>
      </Pressable>}
      {permissions.granted && permissions.channelEnabled && !permissions.exactAlarmGranted && <>
        <Text className="font-sans text-body text-slate">Para receber os cuidados no horário previsto, permita alarmes e lembretes nas configurações do Android.</Text>
        <Pressable accessibilityRole="button" disabled={busy} onPress={requestExactAlarms}><Text className="font-sans-medium text-body text-clinic">Permitir horário exato</Text></Pressable>
      </>}
      <Pressable accessibilityRole="button" disabled={busy} onPress={openSettings}><Text className="font-sans-medium text-body text-clinic">Abrir configurações do aplicativo</Text></Pressable>
    </>}
  </View>;
}
