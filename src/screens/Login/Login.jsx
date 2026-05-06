import { Text, StyleSheet, View, Pressable } from "react-native";

export default function Login({ navigation }) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Acesso Fidelis</Text>

			<View style={styles.buttonRow}>
				<Pressable
					style={styles.selectButton}
					onPress={() => navigation.navigate("LoginVet")}
				>
					<Text style={styles.selectButtonText}>Sou veterinário</Text>
				</Pressable>

				<Pressable
					style={styles.selectButton}
					onPress={() => navigation.navigate("LoginTutor")}
				>
					<Text style={styles.selectButtonText}>Sou tutor</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 16,
		backgroundColor: "#f5f7fa",
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
		marginBottom: 18,
		color: "#22324a",
	},
	buttonRow: {
		width: "100%",
		maxWidth: 360,
		gap: 10,
	},
	selectButton: {
		paddingVertical: 12,
		borderRadius: 10,
		backgroundColor: "#4a6fa5",
		alignItems: "center",
	},
	selectButtonText: {
		color: "#fff",
		fontWeight: "600",
		fontSize: 16,
	},
});
