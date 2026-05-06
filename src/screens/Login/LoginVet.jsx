import { StyleSheet, View } from "react-native";
import FormLoginVet from "./Forms/FormLoginVet";

export default function LoginVet({ navigation }) {
  const handleEnter = () => {
    navigation.navigate("Tabs", { userType: "VET" });
  };

  return (
    <View style={styles.container}>
      <FormLoginVet onContinue={handleEnter} />
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
