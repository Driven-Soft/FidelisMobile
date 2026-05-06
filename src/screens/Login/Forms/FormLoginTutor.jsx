import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Text, StyleSheet, View, Pressable, TextInput } from "react-native";

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
		<View style={styles.container}>
			<Text style={styles.title}>Login Tutor</Text>
			<Text style={styles.description}>
				Entre com os mesmos dados cadastrados no perfil.
			</Text>

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

			<View style={styles.previewBox}>
				<Text style={styles.previewTitle}>Pré-visualização</Text>
				<Text style={styles.previewText}>Tutor: {nomeTutor || "-"}</Text>
				<Text style={styles.previewText}>Contato: {contato || "-"}</Text>
				<Text style={styles.previewText}>Senha: {senha ? "••••••" : "-"}</Text>
			</View>

			<Pressable style={styles.buttonSecondary} onPress={handleClear}>
				<Text style={styles.buttonText}>Limpar campos</Text>
			</Pressable>

			<Pressable style={styles.buttonPrimary} onPress={handleLogin}>
				<Text style={styles.buttonText}>Entrar como tutor</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 10,
	},
	title: {
		fontSize: 18,
		fontWeight: "700",
		color: "#233955",
	},
	description: {
		color: "#57667f",
	},
	input: {
		borderWidth: 1,
		borderColor: "#cdd5e1",
		borderRadius: 8,
		paddingHorizontal: 10,
		paddingVertical: 8,
		backgroundColor: "#fff",
	},
	previewBox: {
		marginTop: 6,
		padding: 10,
		borderRadius: 8,
		backgroundColor: "#edf2f7",
		gap: 2,
	},
	previewTitle: {
		fontWeight: "700",
		color: "#233955",
	},
	previewText: {
		color: "#44526b",
	},
	buttonPrimary: {
		marginTop: 8,
		backgroundColor: "#2f8f83",
		paddingVertical: 10,
		borderRadius: 8,
		alignItems: "center",
	},
	buttonSecondary: {
		backgroundColor: "#4a6fa5",
		paddingVertical: 10,
		borderRadius: 8,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "600",
	},
});
