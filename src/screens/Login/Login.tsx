import type { LoginScreenProps } from '../../routes/types';
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useLoginForm } from "../../hooks/useLoginForm";
import Input from "../../components/common/Input";

export default function Login({ navigation }: LoginScreenProps) {
  const {
    portalType, selectPortal, email, setEmail, password, setPassword,
    touched, errors, isEmailValid, isPasswordValid, handleBlur,
    submit, isPending, errorMessage, sessionError, clearSession,
  } = useLoginForm();

  const handleLogin = async () => {
    const feedback = await submit();
    if (feedback) Alert.alert(feedback.title, feedback.message);
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
                onPress={() => selectPortal("TUTOR")}
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
                onPress={() => selectPortal("VET")}
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

            {errorMessage && (
              <Text accessibilityRole="alert" accessibilityLiveRegion="polite" className="mt-2 font-sans text-label text-alert">
                {errorMessage}
              </Text>
            )}

            {sessionError && (
              <View className="mt-2">
                <Text accessibilityRole="alert" className="font-sans text-label text-alert">{sessionError}</Text>
                <Text onPress={() => { void clearSession(); }} className="mt-1 font-sans-medium text-label text-clinic">
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
                : "Entre com o email e a senha da sua conta de veterinário."}
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
