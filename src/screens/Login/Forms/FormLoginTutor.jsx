import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Text, View, Pressable, TextInput } from "react-native";

const STORAGE_KEY_CADASTRO_TUTOR = "@fidelis:cadastro_tutor";

export default function FormLoginTutor({ onContinue }) {
	const [nomeTutor, setNomeTutor] = useState("");
	const [contato, setContato] = useState("");
	const [senha, setSenha] = useState("");

	const handleLogin = async () => {
		if (!nomeTutor || !contato || !senha) {
			Alert.alert("Campos obrigatorios", "Preencha todos os campos para entrar.");
			return;
		}

		try {
			const savedCadastro = await AsyncStorage.getItem(STORAGE_KEY_CADASTRO_TUTOR);
			if (!savedCadastro) {
				Alert.alert("Cadastro nao encontrado", "Crie um novo perfil de tutor antes de entrar.");
				return;
			}

			const parsedCadastro = JSON.parse(savedCadastro);
			const validCredentials =
				parsedCadastro.nomeTutor === nomeTutor &&
				parsedCadastro.contato === contato &&
				parsedCadastro.senha === senha;

			if (!validCredentials) {
				Alert.alert("Dados invalidos", "Os dados inseridos nao conferem com o cadastro.");
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
	};

	return (
		<View className="gap-3 rounded-3xl bg-white p-5 shadow-sm">
			<Text className="text-lg font-bold text-slate-900">Login Tutor</Text>
			<Text className="text-slate-500">
				Entre com os mesmos dados cadastrados no perfil.
			</Text>

			<TextInput
				value={nomeTutor}
				onChangeText={setNomeTutor}
				placeholder="Nome do tutor"
				className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
				placeholderTextColor="#94a3b8"
			/>
			<TextInput
				value={contato}
				onChangeText={setContato}
				placeholder="Contato"
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
				<Text className="text-slate-600">Tutor: {nomeTutor || "-"}</Text>
				<Text className="text-slate-600">Contato: {contato || "-"}</Text>
				<Text className="text-slate-600">Senha: {senha ? "••••••" : "-"}</Text>
			</View>

			<Pressable className="items-center rounded-2xl bg-slate-700 py-3" onPress={handleClear}>
				<Text className="font-semibold text-white">Limpar campos</Text>
			</Pressable>

			<Pressable className="items-center rounded-2xl bg-cyan-600 py-3" onPress={handleLogin}>
				<Text className="font-semibold text-white">Entrar como tutor</Text>
			</Pressable>
		</View>
	);
}
