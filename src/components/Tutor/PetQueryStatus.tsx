import { ActivityIndicator, View, Text, Pressable } from "react-native";
import { getPetErrorMessage } from "../../utils/petUtils";

export default function PetQueryStatus({ query, empty = false }) {
  if (query.isPending) return <View className="items-center gap-2 py-5"><ActivityIndicator color="#0E7A63" /><Text className="font-sans text-body text-slate">Carregando pets...</Text></View>;
  if (query.error) return (
    <View className="gap-2 py-3">
      <Text accessibilityRole="alert" className="font-sans text-body text-alert">{getPetErrorMessage(query.error)}</Text>
      <Pressable disabled={query.isFetching} onPress={() => query.refetch()} accessibilityRole="button">
        <Text className="font-sans-medium text-body text-clinic">{query.isFetching ? "Atualizando..." : "Tentar novamente"}</Text>
      </Pressable>
    </View>
  );
  if (empty) return <Text className="py-5 text-center font-sans text-body text-slate">Nenhum pet cadastrado.</Text>;
  return query.isFetching ? <ActivityIndicator color="#0E7A63" /> : null;
}
