import React, { useContext, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { UserContext } from "../../context/UserContext";
import { MOCK_TUTOR_PROFILE, MOCK_VET_PROFILE } from "../../data/fidelisData";
import Input from "../../components/common/Input";

const STORAGE_KEY_CADASTRO_TUTOR = "@fidelis:cadastro_tutor";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ navigation }) {
  const { portalToggle, setPortalToggle, loginTutor, loginVet } =
    useContext(UserContext);
  const [portalType, setPortalType] = useState(portalToggle ?? "TUTOR");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isEmailValid = emailRegex.test(email.trim());
  const isPasswordValid = password.length >= 6;

  const errors = {
    email: touched.email && !isEmailValid ? "Informe um email válido." : null,
    password:
      touched.password && !isPasswordValid
        ? "A senha deve ter ao menos 6 caracteres."
        : null,
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    setPortalToggle(portalType);

    if (!trimmedEmail && !trimmedPassword) {
      if (portalType === "TUTOR") {
        loginTutor(MOCK_TUTOR_PROFILE);
      } else {
        loginVet(MOCK_VET_PROFILE);
      }

      navigation.reset({
        index: 0,
        routes: [{ name: "Tabs", params: { userType: portalType } }],
      });
      return;
    }

    setTouched({ email: true, password: true });

    if (!isEmailValid || !isPasswordValid) {
      Alert.alert(
        "Campos inválidos",
        "Informe email e senha válidos para entrar.",
      );
      return;
    }

    if (portalType === "VET") {
      const isVetEmail = trimmedEmail === MOCK_VET_PROFILE.email.toLowerCase();

      if (!isVetEmail) {
        Alert.alert(
          "Acesso restrito",
          "Use o email cadastrado pela clínica. O cadastro de veterinários não é feito pelo app.",
        );
        return;
      }

      loginVet(MOCK_VET_PROFILE);

      navigation.reset({
        index: 0,
        routes: [{ name: "Tabs", params: { userType: portalType } }],
      });
      return;
    }

    try {
      const savedCadastro = await AsyncStorage.getItem(
        STORAGE_KEY_CADASTRO_TUTOR,
      );

      if (!savedCadastro) {
        Alert.alert(
          "Cadastro nao encontrado",
          "Crie um cadastro antes de entrar.",
        );
        return;
      }

      const parsedCadastro = JSON.parse(savedCadastro);
      const validCredentials =
        parsedCadastro.email?.toLowerCase() === trimmedEmail &&
        parsedCadastro.password === trimmedPassword;

      if (!validCredentials) {
        Alert.alert("Dados invalidos", "Email ou senha nao conferem.");
        return;
      }

      loginTutor(parsedCadastro);

      navigation.reset({
        index: 0,
        routes: [{ name: "Tabs", params: { userType: portalType } }],
      });
    } catch (error) {
      Alert.alert("Erro", "Nao foi possivel validar o login.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-mist" edges={["top"]}>
      <ScrollView
        contentContainerClassName="flex-grow px-4 py-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 rounded-card border border-line bg-card p-[18px]">
          <View className="mb-4 flex-row items-center gap-3">
            <View className="h-14 w-14 items-center justify-center rounded-control bg-clinic-50">
              <Text className="text-[26px]">🐾</Text>
            </View>
            <View className="flex-1">
              <Text className="font-sans-semibold text-screen tracking-screen text-ink">
                Fidelis
              </Text>
              <Text className="mt-[2px] font-sans text-eyebrow text-slate">
                Portal {portalType === "TUTOR" ? "do Tutor" : "do Veterinário"}
              </Text>
            </View>
          </View>
          <Text className="font-sans text-body text-slate">
            {portalType === "TUTOR"
              ? "Cuide de quem você ama com informações claras, lembretes e histórico clínico sempre à mão."
              : "Gerencie seus pacientes, consultas e histórico clínico de forma simples e eficiente."}
          </Text>
        </View>

        <View className="mb-6">
          <View className="rounded-card border border-line bg-card p-[14px]">
            <View className="mb-5 flex-row rounded-control bg-hairline p-1">
              <TouchableOpacity
                className={`flex-1 items-center rounded-badge py-[9px] ${portalType === "TUTOR" ? "bg-clinic" : "bg-transparent"}`}
                onPress={() => {
                  setPortalType("TUTOR");
                  setPortalToggle("TUTOR");
                }}
              >
                <Text
                  className={`font-sans-semibold text-eyebrow ${portalType === "TUTOR" ? "text-white" : "text-slate"}`}
                >
                  Tutor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 items-center rounded-badge py-[9px] ${portalType === "VET" ? "bg-clinic" : "bg-transparent"}`}
                onPress={() => {
                  setPortalType("VET");
                  setPortalToggle("VET");
                }}
              >
                <Text
                  className={`font-sans-semibold text-eyebrow ${portalType === "VET" ? "text-white" : "text-slate"}`}
                >
                  Veterinário
                </Text>
              </TouchableOpacity>
            </View>

            <Input
              label="Email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChangeText={setEmail}
              onBlur={() => handleBlur("email")}
              error={errors.email}
              isValid={touched.email && isEmailValid}
              icon={<Feather name="mail" size={15} color="#5D706B" />}
            />

            <Input
              label="Senha"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              onBlur={() => handleBlur("password")}
              error={errors.password}
              isValid={touched.password && isPasswordValid}
              type="password"
              icon={<Feather name="lock" size={15} color="#5D706B" />}
            />

            <TouchableOpacity
              onPress={handleLogin}
              className="mt-1 items-center justify-center rounded-control bg-clinic px-5 py-3"
            >
              <Text className="font-sans-semibold text-title text-white">Entrar</Text>
            </TouchableOpacity>

            <Text className="mb-4 mt-4 text-center font-sans-medium text-eyebrow text-clinic">
              Esqueci minha senha
            </Text>

            <Text className="font-sans text-label text-slate">
              Acesso mockado para demonstração. Não há autenticação real.
            </Text>
          </View>
        </View>

        {portalType === "TUTOR" && (
          <View className="mt-4 flex-row justify-center gap-2">
            <Text className="font-sans text-body text-slate">Não tem conta?</Text>
            <Text
              className="font-sans-medium text-body text-clinic"
              onPress={() => navigation.navigate("CadastroTutor")}
            >
              Cadastre-se
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
