import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { tutorDataErrorMessage } from "../../utils/tutorDataUtils";

interface Props {
  query: { isPending: boolean; isFetching: boolean; error: unknown; refetch: () => unknown };
  label: string;
  empty?: boolean;
}

export default function TutorDataStatus({ query, label, empty = false }: Props) {
  return <View className="gap-2 py-2">
    {(query.isPending || query.isFetching) && <ActivityIndicator color="#0E7A63" />}
    {query.isPending && <Text className="font-sans text-body text-slate">Carregando {label}...</Text>}
    {query.error ? <Text accessibilityRole="alert" className="font-sans text-body text-alert">{tutorDataErrorMessage(query.error)}</Text> :
      !query.isPending && empty ? <Text className="font-sans text-body text-slate">Nenhum registro encontrado.</Text> : null}
    <Pressable accessibilityRole="button" disabled={query.isFetching} onPress={() => query.refetch()}>
      <Text className="font-sans-medium text-body text-clinic">{query.isFetching ? "Atualizando..." : `Atualizar ${label}`}</Text>
    </Pressable>
  </View>;
}
