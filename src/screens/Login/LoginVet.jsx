import { Pressable, Text, View } from "react-native";
import FormLoginVet from "./Forms/FormLoginVet";

export default function LoginVet({ navigation }) {
  const handleEnter = () => {
    navigation.navigate("Tabs", { userType: "VET" });
  };

  return (
    <View className="flex-1 justify-center gap-3 bg-slate-100 px-4">
      <FormLoginVet onContinue={handleEnter} />
      <Pressable className="mt-2 items-center" onPress={() => navigation.navigate("CadastroVet")}>
        <Text className="font-semibold text-slate-700">Criar novo perfil de veterinario</Text>
      </Pressable>
    </View>
  );
}
