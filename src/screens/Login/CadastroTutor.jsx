import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import MaskInput, { Masks } from "react-native-mask-input"
import Input from "../../components/common/Input";

const STORAGE_KEY_CADASTRO_TUTOR = "@fidelis:cadastro_tutor";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateCPF = (cpf) => {
  const cleanCPF = cpf.replace(/[^\d]+/g, "");
  if (
    cleanCPF === "" ||
    cleanCPF.length !== 11 ||
    /^(\d)\1{10}$/.test(cleanCPF)
  ) {
    return false;
  }
  let add = 0;
  for (let i = 0; i < 9; i++) add += parseInt(cleanCPF.charAt(i)) * (10 - i);
  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cleanCPF.charAt(9))) return false;
  add = 0;
  for (let i = 0; i < 10; i++) add += parseInt(cleanCPF.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cleanCPF.charAt(10))) return false;
  return true;
};

export default function CadastroTutor({ navigation }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    cpf: false,
    password: false,
    confirmPassword: false,
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isNameValid =
    formData.name.trim().length > 0 &&
    formData.name.trim().split(" ").length >= 2;
  const isEmailValid = emailRegex.test(formData.email.trim());
  const isPhoneValid = (() => {
    const phoneDigits = formData.phone.replace(/\D/g, "");
    return phoneDigits.length >= 10 && phoneDigits.length <= 11;
  })();
  const isCpfValid = validateCPF(formData.cpf);
  const isPasswordValid = formData.password.length >= 6;
  const isConfirmPasswordValid =
    formData.confirmPassword === formData.password &&
    formData.confirmPassword.length >= 6;

  const errors = {
    name:
      touched.name && !isNameValid
        ? "Por favor, informe seu nome e sobrenome."
        : null,
    email: touched.email && !isEmailValid ? "Informe um email válido." : null,
    phone:
      touched.phone && !isPhoneValid
        ? "Informe um telefone válido com DDD de 10 ou 11 dígitos."
        : null,
    cpf: touched.cpf && !isCpfValid ? "Informe um CPF válido." : null,
    password:
      touched.password && !isPasswordValid
        ? "A senha deve ter ao menos 6 caracteres."
        : null,
    confirmPassword:
      touched.confirmPassword && !isConfirmPasswordValid
        ? "As senhas não conferem."
        : null,
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    handleComplete();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_CADASTRO_TUTOR,
        JSON.stringify({
          userType: "TUTOR",
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          cpf: formData.cpf.trim(),
          password: formData.password,
        }),
      );
      Alert.alert("Sucesso", "Cadastro de tutor realizado.");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o cadastro.");
    }
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      setTouched({ ...touched, name: true, email: true, phone: true });
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.phone.trim()
      ) {
        Alert.alert("Campos obrigatórios", "Preencha nome, email e telefone.");
        return false;
      }

      if (!isNameValid) {
        Alert.alert(
          "Nome incompleto",
          "Por favor, informe seu nome e sobrenome.",
        );
        return false;
      }

      if (!isEmailValid) {
        Alert.alert("Email inválido", "Informe um email válido.");
        return false;
      }

      if (!isPhoneValid) {
        Alert.alert("Telefone inválido", "Informe um telefone válido com DDD.");
        return false;
      }
    }

    if (currentStep === 2) {
      setTouched({ ...touched, cpf: true });
      if (!isCpfValid) {
        Alert.alert("CPF inválido", "Informe um CPF válido.");
        return false;
      }
    }

    if (currentStep === 3) {
      setTouched({ ...touched, password: true, confirmPassword: true });
      if (!formData.password || !formData.confirmPassword) {
        Alert.alert("Campos obrigatórios", "Preencha a senha e a confirmação.");
        return false;
      }
      if (!isPasswordValid) {
        Alert.alert("Senha fraca", "A senha deve ter ao menos 6 caracteres.");
        return false;
      }
      if (!isConfirmPasswordValid) {
        Alert.alert("Senhas incompatíveis", "As senhas não conferem.");
        return false;
      }
    }

    return true;
  };

  const progressSteps = [
    {
      number: 1,
      title: "Informações Básicas",
      subtitle: "Nome, email e telefone",
    },
    { number: 2, title: "Dados Pessoais", subtitle: "CPF" },
    { number: 3, title: "Senha", subtitle: "Crie sua senha" },
  ];

  const currentStep = progressSteps[step - 1];

  return (
    <SafeAreaView className="flex-1 bg-mist" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <View className="mb-6 flex-row items-center">
            {[1, 2, 3].map((num) => (
              <React.Fragment key={num}>
                <View
                  className={`h-9 w-9 items-center justify-center rounded-full ${
                    num <= step ? "bg-clinic" : "bg-hairline"
                  }`}
                >
                  <Text
                    className={`font-mono-medium text-badge ${
                      num <= step ? "text-white" : "text-slate"
                    }`}
                  >
                    {num}
                  </Text>
                </View>

                {num < 3 && (
                  <View
                    className={`mx-2 h-px flex-1 ${
                      num < step ? "bg-clinic" : "bg-line"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </View>

          <Text className="mb-1 font-sans-semibold text-screen tracking-screen text-ink">
            {currentStep.title}
          </Text>
          <Text className="mb-4 font-sans text-body text-slate">
            {currentStep.subtitle}
          </Text>

          <View className="rounded-card border border-line bg-card p-[14px]">
            {step === 1 && (
              <>
                <Input
                  label="Nome Completo"
                  placeholder="João Silva"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange("name", value)}
                  onBlur={() => handleBlur("name")}
                  error={errors.name}
                  isValid={touched.name && isNameValid}
                  autoCapitalize="words"
                />

                <Input
                  label="Email"
                  placeholder="joao@exemplo.com"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange("email", value)}
                  onBlur={() => handleBlur("email")}
                  error={errors.email}
                  isValid={touched.email && isEmailValid}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View className="mb-3">
                  <Text className="mb-[6px] font-sans text-label text-slate">
                    Telefone
                  </Text>
                  <MaskInput
                    value={formData.phone}
                    onChangeText={(masked) => handleInputChange("phone", masked)}
                    onBlur={() => handleBlur("phone")}
                    mask={Masks.BRL_PHONE}
                    placeholder="(11) 98765-4321"
                    placeholderTextColor="#8A9A95"
                    keyboardType="phone-pad"
                    className={`rounded-control border bg-card px-3 py-[10px] font-mono text-body text-ink ${
                      errors.phone ? "border-alert" : "border-line-strong"
                    }`}
                  />
                  {errors.phone && (
                    <Text className="mt-1 font-sans text-label text-alert">{errors.phone}</Text>
                  )}
                </View>
              </>
            )}

            {step === 2 && (
              <>
                <View className="mb-3">
                  <Text className="mb-[6px] font-sans text-label text-slate">
                    CPF
                  </Text>
                  <MaskInput
                    value={formData.cpf}
                    onChangeText={(masked) => handleInputChange("cpf", masked)}
                    onBlur={() => handleBlur("cpf")}
                    mask={Masks.BRL_CPF}
                    placeholder="123.456.789-10"
                    placeholderTextColor="#8A9A95"
                    keyboardType="numeric"
                    className={`rounded-control border bg-card px-3 py-[10px] font-mono text-body text-ink ${
                      errors.cpf ? "border-alert" : "border-line-strong"
                    }`}
                  />
                  {errors.cpf && (
                    <Text className="mt-1 font-sans text-label text-alert">{errors.cpf}</Text>
                  )}
                  <Text className="mt-2 font-sans text-label text-slate">
                    Seu CPF será usado para verificação de identidade
                  </Text>
                </View>
              </>
            )}

            {step === 3 && (
              <>
                <Input
                  label="Senha"
                  placeholder="••••••••"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  onBlur={() => handleBlur("password")}
                  error={errors.password}
                  isValid={touched.password && isPasswordValid}
                  type="password"
                />
                <Input
                  label="Confirmar Senha"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  onBlur={() => handleBlur("confirmPassword")}
                  error={errors.confirmPassword}
                  isValid={touched.confirmPassword && isConfirmPasswordValid}
                  type="password"
                />
              </>
            )}
          </View>

          <View className="mt-6 flex-row gap-[10px] pb-6">
            {step > 1 && (
              <TouchableOpacity
                onPress={handleBack}
                className="flex-1 items-center justify-center rounded-control border border-line-strong bg-card px-[18px] py-[11px]"
              >
                <Text className="font-sans-medium text-xs text-ink">Voltar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleNext}
              className="flex-1 items-center justify-center rounded-control bg-clinic px-5 py-3"
            >
              <Text className="font-sans-semibold text-title text-white">
                {step === 3 ? "Cadastrar" : "Próximo"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4 items-center">
            <Text className="font-sans text-body text-slate">
              Já tem conta?{" "}
              <Text
                className="font-sans-medium text-body text-clinic"
                onPress={() => navigation.replace("Login")}
              >
                Faça login
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
