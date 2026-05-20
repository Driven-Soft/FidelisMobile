import React, { useState } from "react";
import { Alert, ScrollView, Text, View, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import MaskInput, { Masks } from "react-native-mask-input";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Card from "../../components/common/Card";

const STORAGE_KEY_CADASTRO_TUTOR = "@fidelis:cadastro_tutor";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Função para validar CPF matematicamente
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
  const [emailTouched, setEmailTouched] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const isEmailValid = emailRegex.test(formData.email.trim());
  const showEmailError = emailTouched && !isEmailValid;

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
    const digitsOnly = (value) => value.replace(/\D/g, "");

    if (currentStep === 1) {
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.phone.trim()
      ) {
        Alert.alert("Campos obrigatórios", "Preencha nome, email e telefone.");
        return false;
      }

      // Valida se o usuário digitou nome E sobrenome
      if (formData.name.trim().split(" ").length < 2) {
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

      // Valida telefone (fixo 10 digitos ou celular 11 digitos)
      const phoneDigits = digitsOnly(formData.phone);
      if (phoneDigits.length < 10 || phoneDigits.length > 11) {
        Alert.alert("Telefone inválido", "Informe um telefone válido com DDD.");
        return false;
      }
    }

    if (currentStep === 2) {
      if (!validateCPF(formData.cpf)) {
        Alert.alert("CPF inválido", "Informe um CPF válido.");
        return false;
      }
    }

    if (currentStep === 3) {
      if (!formData.password || !formData.confirmPassword) {
        Alert.alert("Campos obrigatórios", "Preencha a senha e a confirmação.");
        return false;
      }
      if (formData.password.length < 6) {
        Alert.alert("Senha fraca", "A senha deve ter ao menos 6 caracteres.");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
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
    <SafeAreaView className="flex-1 bg-slate-100" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <View className="mb-6 flex-row items-center space-x-3">
            {[1, 2, 3].map((num) => (
              <View key={num} className="flex-1 items-center">
                <View
                  className={`h-10 w-10 items-center justify-center rounded-full ${num <= step ? "bg-cyan-600" : "bg-slate-200"}`}
                >
                  <Text
                    className={`text-sm font-bold ${num <= step ? "text-white" : "text-slate-500"}`}
                  >
                    {num}
                  </Text>
                </View>
                {num < 3 && (
                  <View
                    className={`h-0.5 w-full ${num < step ? "bg-cyan-600" : "bg-slate-200"}`}
                  />
                )}
              </View>
            ))}
          </View>

          <Text className="mb-2 text-2xl font-bold text-slate-900">
            {currentStep.title}
          </Text>
          <Text className="mb-4 text-sm text-slate-500">
            {currentStep.subtitle}
          </Text>

          <Card>
            {step === 1 && (
              <>
                <Input
                  label="Nome Completo"
                  placeholder="João Silva"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange("name", value)}
                  autoCapitalize="words"
                />

                <View className="mb-4">
                  <Text className="mb-1 text-sm font-medium text-slate-700">
                    Email
                  </Text>
                  <TextInput
                    value={formData.email}
                    onChangeText={(value) => handleInputChange("email", value)}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="joao@exemplo.com"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className={`rounded-2xl border px-4 py-3 text-slate-900 bg-white ${
                      showEmailError ? "border-red-400" : "border-slate-200"
                    }`}
                  />
                  {showEmailError && (
                    <Text className="mt-1 text-xs text-red-400">
                      Informe um email válido
                    </Text>
                  )}
                </View>

                <View className="mb-4">
                  <Text className="mb-1 text-sm font-medium text-slate-700">
                    Telefone
                  </Text>
                  <MaskInput
                    value={formData.phone}
                    onChangeText={(masked) =>
                      handleInputChange("phone", masked)
                    }
                    mask={Masks.BRL_PHONE}
                    placeholder="(11) 98765-4321"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                  />
                </View>
              </>
            )}

            {step === 2 && (
              <>
                <View className="mb-4">
                  <Text className="mb-1 text-sm font-medium text-slate-700">
                    CPF
                  </Text>
                  <MaskInput
                    value={formData.cpf}
                    onChangeText={(masked) => handleInputChange("cpf", masked)}
                    mask={Masks.BRL_CPF}
                    placeholder="123.456.789-10"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
                  />
                </View>
                <Text className="mt-2 text-xs text-slate-500">
                  Seu CPF será usado para verificação de identidade
                </Text>
              </>
            )}

            {step === 3 && (
              <>
                <Input
                  label="Senha"
                  placeholder="••••••••"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange("password", value)}
                  type="password"
                />
                <Input
                  label="Confirmar Senha"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  type="password"
                />
              </>
            )}
          </Card>

          <View className="mt-6 flex-row space-x-3 pb-6">
            {step > 1 && (
              <Button
                title="Voltar"
                variant="outline"
                onPress={handleBack}
                style={{ flex: 1 }}
              />
            )}
            <Button
              title={step === 3 ? "Cadastrar" : "Próximo"}
              variant="primary"
              onPress={handleNext}
              style={{ flex: 1 }}
            />
          </View>

          <View className="mt-4 items-center">
            <Text className="text-sm text-slate-500">
              Já tem conta?{" "}
              <Text
                className="font-bold text-cyan-600"
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
