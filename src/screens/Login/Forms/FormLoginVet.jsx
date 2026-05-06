import { Text, StyleSheet, View, Pressable } from "react-native";

export default function FormLoginVet({ onContinue }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login Veterinário</Text>
            <Text style={styles.description}>
                Autenticação simplificada para testes.
            </Text>

            <Pressable style={styles.button} onPress={() => onContinue("VET")}>
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
    button: {
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