import { Pressable, StyleSheet, Text, View } from "react-native";
import FormLoginTutor from "./Forms/FormLoginTutor";

export default function LoginTutor({ navigation }) {
  const handleEnter = () => {
    navigation.navigate("Tabs", { userType: "TUTOR" });
  };

  return (
    <View style={styles.container}>
      <FormLoginTutor onContinue={handleEnter} />
      <Pressable
        style={styles.registerButton}
        onPress={() => navigation.navigate("CadastroTutor")}
      >
        <Text style={styles.registerButtonText}>Criar novo perfil de tutor</Text>
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
