import { Pressable, StyleSheet, Text, View } from "react-native";
import FormLoginVet from "./Forms/FormLoginVet";

export default function LoginVet({ navigation }) {
  const handleEnter = () => {
    navigation.navigate("Tabs", { userType: "VET" });
  };

  return (
    <View style={styles.container}>
      <FormLoginVet onContinue={handleEnter} />
      <Pressable
        style={styles.registerButton}
        onPress={() => navigation.navigate("CadastroVet")}
      >
        <Text style={styles.registerButtonText}>Criar novo perfil de veterinario</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#f5f7fa",
    gap: 12,
  },
  registerButton: {
    marginTop: 8,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#35557f",
    fontWeight: "600",
  },
});
