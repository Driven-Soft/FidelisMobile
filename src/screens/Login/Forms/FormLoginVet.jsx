import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Text, View, Pressable, TextInput } from "react-native";

const STORAGE_KEY_CADASTRO_VET = "@fidelis:cadastro_vet";

export default function FormLoginVet({ onContinue }) {
    const [nome, setNome] = useState("");
    const [crmv, setCrmv] = useState("");
    const [clinica, setClinica] = useState("");
    const [senha, setSenha] = useState("");

    const handleLogin = async () => {
        if (!nome || !crmv || !clinica || !senha) {
            Alert.alert("Campos obrigatorios", "Preencha todos os campos para entrar.");
            return;
        }

        try {
            const savedCadastro = await AsyncStorage.getItem(STORAGE_KEY_CADASTRO_VET);
            if (!savedCadastro) {
                Alert.alert("Cadastro nao encontrado", "Crie um novo perfil de veterinario antes de entrar.");
                return;
            }

            const parsedCadastro = JSON.parse(savedCadastro);
            const validCredentials =
                parsedCadastro.nome === nome &&
                parsedCadastro.crmv === crmv &&
                parsedCadastro.clinica === clinica &&
                parsedCadastro.senha === senha;

            if (!validCredentials) {
                Alert.alert("Dados invalidos", "Os dados inseridos nao conferem com o cadastro.");
                return;
            }

            onContinue("VET");
        } catch (error) {
            Alert.alert("Erro", "Nao foi possivel validar o login.");
        }
    };

    const handleClear = () => {
        setNome("");
        setCrmv("");
        setClinica("");
        setSenha("");
    };

    return (
        <View className="gap-3 rounded-3xl bg-white p-5 shadow-sm">
            <Text className="text-lg font-bold text-slate-900">Login Veterinário</Text>
            <Text className="text-slate-500">
                Entre com os mesmos dados cadastrados no perfil.
            </Text>

            <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Nome do veterinário"
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
                placeholder="Nome da clínica"
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

            <View className="mt-1 gap-1 rounded-2xl bg-slate-100 p-4">
                <Text className="font-bold text-slate-900">Pré-visualização</Text>
                <Text className="text-slate-600">Nome: {nome || "-"}</Text>
                <Text className="text-slate-600">CRMV: {crmv || "-"}</Text>
                <Text className="text-slate-600">Clínica: {clinica || "-"}</Text>
                <Text className="text-slate-600">Senha: {senha ? "••••••" : "-"}</Text>
            </View>

            <Pressable className="items-center rounded-2xl bg-slate-700 py-3" onPress={handleClear}>
                <Text className="font-semibold text-white">Limpar campos</Text>
            </Pressable>

            <Pressable className="items-center rounded-2xl bg-cyan-600 py-3" onPress={handleLogin}>
                <Text className="font-semibold text-white">Entrar como veterinário</Text>
            </Pressable>
        </View>
    );
}
