import { Text, View, Pressable } from "react-native";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { MOCK_VETERINARIAN } from "../../data/mockData";

export default function FormLoginVet({ onContinue }) {
  const { loginVet } = useContext(UserContext);

  const handleLogin = () => {
    loginVet(MOCK_VETERINARIAN);
    onContinue("VET");
  };

  return (
    <View className="gap-3 rounded-3xl bg-white p-5 shadow-sm">
      <Text className="text-lg font-bold text-slate-900">Login Veterinário</Text>
      <Text className="text-slate-500">
        Acesso de demonstração com perfil mockado.
      </Text>

      <View className="mt-1 gap-1 rounded-2xl bg-slate-100 p-4">
        <Text className="font-bold text-slate-900">Perfil de demonstração</Text>
        <Text className="text-slate-600">Nome: {MOCK_VETERINARIAN.name}</Text>
        <Text className="text-slate-600">CRMV: {MOCK_VETERINARIAN.crmv}</Text>
        <Text className="text-slate-600">Especialidade: {MOCK_VETERINARIAN.specialty}</Text>
        <Text className="text-slate-600">Clínica: {MOCK_VETERINARIAN.clinic.name}</Text>
      </View>

      <Pressable className="items-center rounded-2xl bg-cyan-600 py-3" onPress={handleLogin}>
        <Text className="font-semibold text-white">Entrar como veterinário</Text>
      </Pressable>
    </View>
  );
}