import { ActivityIndicator, View, Text, Pressable } from "react-native";
import { getReminderErrorMessage } from "../../utils/reminderUtils";

interface Props {
  query: { isPending: boolean; isFetching: boolean; error: unknown; refetch: () => unknown };
  empty?: boolean;
}

export default function ReminderQueryStatus({ query, empty = false }: Props) {
  if (query.isPending) return <View><ActivityIndicator color="#0E7A63" /><Text>Carregando lembretes...</Text></View>;
  if (query.error) return <View className="gap-2 py-3">
    <Text accessibilityRole="alert" className="font-sans text-body text-alert">{getReminderErrorMessage(query.error)}</Text>
    <Pressable disabled={query.isFetching} onPress={() => query.refetch()} accessibilityRole="button">
      <Text className="font-sans-medium text-body text-clinic">{query.isFetching ? "Atualizando..." : "Tentar novamente"}</Text>
    </Pressable>
  </View>;
  return <View>
    {query.isFetching && <ActivityIndicator color="#0E7A63" />}
    {empty && <Text className="py-5 text-center font-sans text-body text-slate">Nenhum lembrete encontrado.</Text>}
  </View>;
}
