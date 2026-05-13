import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

const STORAGE_KEY_CADASTRO_VET = "@fidelis:cadastro_vet";

export default function FormCadastroVet({ onSuccess }) {
  const [nome, setNome] = useState("");
  const [crmv, setCrmv] = useState("");
  const [clinica, setClinica] = useState("");
  const [senha, setSenha] = useState("");

  const handleCadastro = async () => {
    if (!nome || !crmv || !clinica || !senha) {
      Alert.alert("Campos obrigatorios", "Preencha todos os campos para cadastrar.");
      return;
    }

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_CADASTRO_VET,
        JSON.stringify({ nome, crmv, clinica, senha })
      );
      Alert.alert("Sucesso", "Cadastro de veterinario realizado.");
      onSuccess();
    } catch (error) {
      Alert.alert("Erro", "Nao foi possivel salvar o cadastro.");
    }
  };

    return (
    <View className="gap-3 rounded-3xl bg-white p-5 shadow-sm">
      <Text className="mb-1 text-xl font-bold text-slate-900">Cadastro Veterinario</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        placeholder="Nome do veterinario"
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
        placeholderTextColor="#94a3b8"
      />
      <TextInput
        value={crmv}
        onChangeText={setCrmv}
        placeholder="CRMV"
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
        placeholderTextColor="#94a3b8"
      />
      <TextInput
        value={clinica}
        onChangeText={setClinica}
        placeholder="Nome da clinica"
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
        placeholderTextColor="#94a3b8"
      />
      <TextInput
        value={senha}
        onChangeText={setSenha}
        placeholder="Senha"
        secureTextEntry
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
        placeholderTextColor="#94a3b8"
      />

      <Pressable className="items-center rounded-2xl bg-cyan-600 py-3" onPress={handleCadastro}>
        <Text className="font-semibold text-white">Cadastrar veterinario</Text>
      </Pressable>
    </View>
  );
}
