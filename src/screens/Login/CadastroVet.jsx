import { StyleSheet, View } from "react-native";
import FormCadastroVet from "./Forms/FormCadastroVet";

export default function CadastroVet({ navigation }) {
  const handleSuccess = () => {
    navigation.replace("LoginVet");
  };

  return (
    <View style={styles.container}>
      <FormCadastroVet onSuccess={handleSuccess} />
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
