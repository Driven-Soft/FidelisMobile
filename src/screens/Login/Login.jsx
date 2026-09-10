import React, { useContext, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { UserContext } from "../../context/UserContext";
import { useLogin, getLoginErrorMessage } from "../../hooks/useLogin";
import Input from "../../components/common/Input";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ navigation }) {
  const { portalToggle, setPortalToggle, sessionError, logout } =
    useContext(UserContext);
  const { mutateAsync, isPending, error: loginError } = useLogin();
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
    if (isPending) return;
    const trimmedEmail = email.trim().toLowerCase();

    setPortalToggle(portalType);

    // A API atual autentica somente tutores; não simular login veterinário.
    if (portalType === "VET") {
      Alert.alert("Acesso indisponível", "A autenticação de veterinários ainda não está disponível.");
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

    try {
      await mutateAsync({ email: trimmedEmail, senha: password, tipo: "TUTOR" });
      setPassword("");
      // O Stack troca o fluxo automaticamente após a sessão ser salva.
    } catch (error) {
      Alert.alert("Não foi possível entrar", getLoginErrorMessage(error));
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
                disabled={isPending}
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
                disabled={isPending}
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
              editable={!isPending}
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
              editable={!isPending}
              onChangeText={setPassword}
              onBlur={() => handleBlur("password")}
              error={errors.password}
              isValid={touched.password && isPasswordValid}
              type="password"
              icon={<Feather name="lock" size={15} color="#5D706B" />}
            />

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isPending}
              accessibilityState={{ disabled: isPending, busy: isPending }}
              className="mt-1 items-center justify-center rounded-control bg-clinic px-5 py-3"
            >
              <Text className="font-sans-semibold text-title text-white">
                {isPending ? "Entrando..." : "Entrar"}
              </Text>
            </TouchableOpacity>

            {portalType === "TUTOR" && loginError && (
              <Text accessibilityRole="alert" accessibilityLiveRegion="polite" className="mt-2 font-sans text-label text-alert">
                {getLoginErrorMessage(loginError)}
              </Text>
            )}

            {sessionError && (
              <View className="mt-2">
                <Text accessibilityRole="alert" className="font-sans text-label text-alert">{sessionError}</Text>
                <Text onPress={() => { if (!isPending) void logout(); }} className="mt-1 font-sans-medium text-label text-clinic">
                  Tentar limpar sessão local
                </Text>
              </View>
            )}

            <Text className="mb-4 mt-4 text-center font-sans-medium text-eyebrow text-clinic">
              Esqueci minha senha
            </Text>

            <Text className="font-sans text-label text-slate">
              {portalType === "TUTOR"
                ? "Entre com seu email e senha ou crie sua conta em Cadastre-se."
                : "A autenticação de veterinários ainda não está disponível."}
            </Text>
          </View>
        </View>

        {portalType === "TUTOR" && (
          <View className="mt-4 flex-row justify-center gap-2">
            <Text className="font-sans text-body text-slate">Não tem conta?</Text>
            <Text
              className="font-sans-medium text-body text-clinic"
              onPress={() => { if (!isPending) navigation.navigate("CadastroTutor"); }}
            >
              Cadastre-se
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
