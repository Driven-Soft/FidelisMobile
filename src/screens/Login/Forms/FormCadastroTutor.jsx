import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Pressable, Text, View } from "react-native";
import Input from "../../../components/common/Input";
import { Masks } from "react-native-mask-input";

const STORAGE_KEY_CADASTRO_TUTOR = "@fidelis:cadastro_tutor";

export default function FormCadastroTutor({ onSuccess }) {
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

  const handleCadastro = async () => {
    setTouched({ nomeTutor: true, contato: true, senha: true });
    if (!isNomeValid || !isContatoValid || !isSenhaValid) {
      Alert.alert(
        "Campos incorretos",
        "Preencha todos os campos corretamente.",
      );
      return;
    }

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_CADASTRO_TUTOR,
        JSON.stringify({ nomeTutor, contato, senha }),
      );
      Alert.alert("Sucesso", "Cadastro de tutor realizado.");
      onSuccess();
    } catch (error) {
      Alert.alert("Erro", "Nao foi possivel salvar o cadastro.");
    }
  };

  return (
    <View className="gap-3 rounded-3xl bg-white p-5 shadow-sm">
      <Text className="mb-1 text-xl font-bold text-slate-900">
        Cadastro Tutor
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

      <Pressable
        className="items-center rounded-2xl bg-cyan-600 py-3 mt-2"
        onPress={handleCadastro}
      >
        <Text className="font-semibold text-white">Cadastrar tutor</Text>
      </Pressable>
    </View>
  );
}
