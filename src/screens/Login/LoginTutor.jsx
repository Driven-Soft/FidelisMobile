import { Pressable, Text, View } from "react-native";
import FormLoginTutor from "./Forms/FormLoginTutor";

export default function LoginTutor({ navigation }) {
  const handleEnter = () => {
    navigation.navigate("Tabs", { userType: "TUTOR" });
  };

  return (
    <View className="flex-1 justify-center gap-3 bg-slate-100 px-4">
      <FormLoginTutor onContinue={handleEnter} />
      <Pressable className="mt-2 items-center" onPress={() => navigation.navigate("CadastroTutor")}>
        <Text className="font-semibold text-slate-700">Criar novo perfil de tutor</Text>
      </Pressable>
    </View>
  );
}
