import { StyleSheet, Text, View } from "react-native";

export default function ConsultasTutor() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consultas do tutor</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef3f8",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#233955",
  },
});
