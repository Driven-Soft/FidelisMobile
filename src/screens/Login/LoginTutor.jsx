import { StyleSheet, View } from "react-native";
import FormLoginTutor from "./Forms/FormLoginTutor";

export default function LoginTutor({ navigation }) {
  const handleEnter = () => {
    navigation.navigate("Tabs", { userType: "TUTOR" });
  };

  return (
    <View style={styles.container}>
      <FormLoginTutor onContinue={handleEnter} />
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
