import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Text, View, Pressable } from "react-native";
import Input from "../../../components/common/Input";
import { Masks } from "react-native-mask-input";

const STORAGE_KEY_CADASTRO_TUTOR = "@fidelis:cadastro_tutor";

export default function FormLoginTutor({ onContinue }) {
  const [nomeTutor, setNomeTutor] = useState("");
  const [contato, setContato] = useState("");
  const [senha, setSenha] = useState("");
  const [touched, setTouched] = useState({
    nomeTutor: false,
    contato: false,
    senha: false,
  });

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isNomeValid =
    nomeTutor.trim().length > 0 && nomeTutor.trim().split(" ").length >= 2;
  const isContatoValid = (() => {
    const digits = contato.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 11;
  })();
  const isSenhaValid = senha.length >= 6;

  const errors = {
    nomeTutor:
      touched.nomeTutor && !isNomeValid ? "Informe seu nome e sobrenome" : null,
    contato:
      touched.contato && !isContatoValid
        ? "Informe um contato válido com DDD"
        : null,
    senha:
      touched.senha && !isSenhaValid
        ? "A senha deve ter ao menos 6 caracteres"
        : null,
  };

  const handleLogin = async () => {
    setTouched({ nomeTutor: true, contato: true, senha: true });
    if (!isNomeValid || !isContatoValid || !isSenhaValid) {
      Alert.alert(
        "Campos incorretos",
        "Preencha todos os campos corretamente.",
      );
      return;
    }

    try {
      const savedCadastro = await AsyncStorage.getItem(
        STORAGE_KEY_CADASTRO_TUTOR,
      );
      if (!savedCadastro) {
        Alert.alert(
          "Cadastro nao encontrado",
          "Crie um novo perfil de tutor antes de entrar.",
        );
        return;
      }

      const parsedCadastro = JSON.parse(savedCadastro);
      const validCredentials =
        parsedCadastro.nomeTutor === nomeTutor &&
        parsedCadastro.contato === contato &&
        parsedCadastro.senha === senha;

      if (!validCredentials) {
        Alert.alert(
          "Dados invalidos",
          "Os dados inseridos nao conferem com o cadastro.",
        );
        return;
      }

      onContinue("TUTOR");
    } catch (error) {
      Alert.alert("Erro", "Nao foi possivel validar o login.");
    }
  };

  const handleClear = () => {
    setNomeTutor("");
    setContato("");
    setSenha("");
    setTouched({ nomeTutor: false, contato: false, senha: false });
  };

  return (
    <View className="gap-3 rounded-3xl bg-white p-5 shadow-sm">
      <Text className="text-lg font-bold text-slate-900">Login Tutor</Text>
      <Text className="text-slate-500 mb-2">
        Entre com os mesmos dados cadastrados no perfil.
      </Text>

      <Input
        label="Nome do tutor"
        value={nomeTutor}
        onChangeText={setNomeTutor}
        onBlur={() => handleBlur("nomeTutor")}
        error={errors.nomeTutor}
        isValid={touched.nomeTutor && isNomeValid}
        placeholder="Nome do tutor"
      />
      <Input
        label="Contato"
        value={contato}
        onChangeText={setContato}
        onBlur={() => handleBlur("contato")}
        error={errors.contato}
        isValid={touched.contato && isContatoValid}
        placeholder="Telefone de contato"
        mask={Masks.BRL_PHONE}
        keyboardType="phone-pad"
      />
      <Input
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        onBlur={() => handleBlur("senha")}
        error={errors.senha}
        isValid={touched.senha && isSenhaValid}
        placeholder="Senha"
        type="password"
      />

      <View className="mt-2 gap-1 rounded-2xl bg-slate-100 p-4">
        <Text className="font-bold text-slate-900">Pré-visualização</Text>
        <Text className="text-slate-600">Tutor: {nomeTutor || "-"}</Text>
        <Text className="text-slate-600">Contato: {contato || "-"}</Text>
        <Text className="text-slate-600">Senha: {senha ? "••••••" : "-"}</Text>
      </View>

      <Pressable
        className="items-center rounded-2xl bg-slate-700 py-3 mt-2"
        onPress={handleClear}
      >
        <Text className="font-semibold text-white">Limpar campos</Text>
      </Pressable>

      <Pressable
        className="items-center rounded-2xl bg-cyan-600 py-3"
        onPress={handleLogin}
      >
        <Text className="font-semibold text-white">Entrar como tutor</Text>
      </Pressable>
    </View>
  );
}
