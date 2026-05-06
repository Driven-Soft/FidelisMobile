import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const STORAGE_KEY_CADASTRO_TUTOR = "@fidelis:cadastro_tutor";

export default function FormCadastroTutor({ onSuccess }) {
  const [nomeTutor, setNomeTutor] = useState("");
  const [contato, setContato] = useState("");
  const [senha, setSenha] = useState("");

  const handleCadastro = async () => {
    if (!nomeTutor || !contato || !senha) {
      Alert.alert("Campos obrigatorios", "Preencha todos os campos para cadastrar.");
      return;
    }

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_CADASTRO_TUTOR,
        JSON.stringify({ nomeTutor, contato, senha })
      );
      Alert.alert("Sucesso", "Cadastro de tutor realizado.");
      onSuccess();
    } catch (error) {
      Alert.alert("Erro", "Nao foi possivel salvar o cadastro.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro Tutor</Text>
      <TextInput
        value={nomeTutor}
        onChangeText={setNomeTutor}
        placeholder="Nome do tutor"
        style={styles.input}
      />
      <TextInput
        value={contato}
        onChangeText={setContato}
        placeholder="Contato"
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
        <Text style={styles.buttonText}>Cadastrar tutor</Text>
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
