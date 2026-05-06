import { StyleSheet, View } from "react-native";
import FormCadastroTutor from "./Forms/FormCadastroTutor";

export default function CadastroTutor({ navigation }) {
  const handleSuccess = () => {
    navigation.replace("LoginTutor");
  };

  return (
    <View style={styles.container}>
      <FormCadastroTutor onSuccess={handleSuccess} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#f5f7fa",
  },
});
