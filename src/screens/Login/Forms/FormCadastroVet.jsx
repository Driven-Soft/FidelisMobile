import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

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
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro Veterinario</Text>
      <TextInput
        value={nome}
        onChangeText={setNome}
        placeholder="Nome do veterinario"
        style={styles.input}
      />
      <TextInput
        value={crmv}
        onChangeText={setCrmv}
        placeholder="CRMV"
        style={styles.input}
      />
      <TextInput
        value={clinica}
        onChangeText={setClinica}
        placeholder="Nome da clinica"
        style={styles.input}
      />
      <TextInput
        value={senha}
        onChangeText={setSenha}
        placeholder="Senha"
        secureTextEntry
        style={styles.input}
      />

      <Pressable style={styles.buttonPrimary} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar veterinario</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#233955",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cdd5e1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  buttonPrimary: {
    marginTop: 8,
    backgroundColor: "#2f8f83",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
