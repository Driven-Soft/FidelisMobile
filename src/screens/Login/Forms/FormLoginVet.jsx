import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, Text, StyleSheet, View, Pressable, TextInput } from "react-native";

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
        <View style={styles.container}>
            <Text style={styles.title}>Login Veterinário</Text>
            <Text style={styles.description}>
                Entre com os mesmos dados cadastrados no perfil.
            </Text>

            <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Nome do veterinário"
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
                placeholder="Nome da clínica"
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
                <Text style={styles.previewText}>Nome: {nome || "-"}</Text>
                <Text style={styles.previewText}>CRMV: {crmv || "-"}</Text>
                <Text style={styles.previewText}>Clínica: {clinica || "-"}</Text>
                <Text style={styles.previewText}>Senha: {senha ? "••••••" : "-"}</Text>
            </View>

            <Pressable style={styles.buttonSecondary} onPress={handleClear}>
                <Text style={styles.buttonText}>Limpar campos</Text>
            </Pressable>

            <Pressable style={styles.buttonPrimary} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar como veterinário</Text>
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