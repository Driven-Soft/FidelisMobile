import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useNotificationPermissions } from '../../hooks/useNotificationPermissions';

export default function NotificationPermissionsCard() {
  const { permissions, busy, error, request, requestExactAlarms, openSettings, refresh } = useNotificationPermissions();
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
