import { ActivityIndicator, View, Text, Pressable } from "react-native";
import { getWeightErrorMessage } from "../../utils/weightUtils";

interface Props {
  query: { isPending: boolean; isFetching: boolean; error: unknown; refetch: () => unknown };
  label: string;
}

export default function WeightQueryStatus({ query, label }: Props) {
  if (query.isPending) return <View className="items-center gap-2 py-5"><ActivityIndicator color="#0E7A63" /><Text className="font-sans text-body text-slate">Carregando {label}...</Text></View>;
  if (query.error) return (
    <View className="gap-2 py-3">
      <Text accessibilityRole="alert" className="font-sans text-body text-alert">{getWeightErrorMessage(query.error)}</Text>
      <Pressable disabled={query.isFetching} onPress={() => query.refetch()} accessibilityRole="button">
        <Text className="font-sans-medium text-body text-clinic">{query.isFetching ? "Atualizando..." : "Tentar novamente"}</Text>
      </Pressable>
    </View>
  );
  return query.isFetching ? <ActivityIndicator color="#0E7A63" /> : null;
}
