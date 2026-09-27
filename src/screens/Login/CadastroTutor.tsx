import type { CadastroTutorScreenProps } from '../../routes/types';
import React from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaskInput, { Masks } from "react-native-mask-input";
import Input from "../../components/common/Input";
import { useRegisterTutor } from "../../hooks/useRegisterTutor";

export default function CadastroTutor({ navigation }: CadastroTutorScreenProps) {
  const {
    step, formData, touched, validation, errors,
    handleInputChange, handleBlur, handleNext, handleBack,
    isPending, isSuccess, errorMessage, canLeave,
  } = useRegisterTutor();

  if (isSuccess) return (
    <SafeAreaView className="flex-1 items-center justify-center gap-4 bg-mist px-4" edges={["top"]}>
      <Text accessibilityLiveRegion="polite" className="font-sans-semibold text-title text-ink">Cadastro realizado com sucesso.</Text>
      <Text className="font-sans text-body text-slate">Entre com o email e a senha que você cadastrou.</Text>
      <TouchableOpacity accessibilityRole="button" onPress={() => { if (canLeave()) navigation.replace("Login"); }} className="rounded-control bg-clinic px-5 py-3">
        <Text className="font-sans-semibold text-title text-white">Ir para login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  const progressSteps = [
    {
      number: 1,
      title: "Informações Básicas",
      subtitle: "Nome, email e telefone",
    },
    { number: 2, title: "Dados Pessoais", subtitle: "CPF e endereço" },
    { number: 3, title: "Senha", subtitle: "Crie sua senha" },
  ];

  const currentStep = progressSteps[step - 1];

  return (
    <SafeAreaView className="flex-1 bg-mist" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          <Text className="mb-4 font-sans text-body text-slate">
            Preencha seus dados para criar sua conta de tutor.
          </Text>
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
                  editable={!isPending}
                  onChangeText={(value) => handleInputChange("name", value)}
                  onBlur={() => handleBlur("name")}
                  error={errors.name}
                  isValid={touched.name && !validation.name}
                  maxLength={75}
                  autoCapitalize="words"
                />

                <Input
                  label="Email"
                  placeholder="joao@exemplo.com"
                  value={formData.email}
                  editable={!isPending}
                  onChangeText={(value) => handleInputChange("email", value)}
                  onBlur={() => handleBlur("email")}
                  error={errors.email}
                  isValid={touched.email && !validation.email}
                  maxLength={75}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View className="mb-3">
                  <Text className="mb-[6px] font-sans text-label text-slate">
                    Telefone
                  </Text>
                  <MaskInput
                    value={formData.phone}
                  editable={!isPending}
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
                  editable={!isPending}
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
                    Informe o CPF do responsável pelos pets.
                  </Text>
                </View>
              </>
            )}

            {step === 2 && <Input
              label="Endereço" placeholder="Rua, número, bairro, cidade e UF"
              value={formData.address} onChangeText={(value) => handleInputChange("address", value)}
              onBlur={() => handleBlur("address")} error={errors.address}
              isValid={touched.address && !validation.address}
              editable={!isPending} maxLength={255}
            />}

            {step === 3 && (
              <>
                <Input
                  label="Senha"
                  placeholder="••••••••"
                  value={formData.password}
                  editable={!isPending}
                  onChangeText={(value) => handleInputChange("password", value)}
                  onBlur={() => handleBlur("password")}
                  error={errors.password}
                  isValid={touched.password && !validation.password}
                  maxLength={50}
                  type="password"
                />
                <Input
                  label="Confirmar Senha"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  editable={!isPending}
                  onChangeText={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  onBlur={() => handleBlur("confirmPassword")}
                  error={errors.confirmPassword}
                  isValid={touched.confirmPassword && !validation.confirmPassword}
                  maxLength={50}
                  type="password"
                />
              </>
            )}
          </View>

          {isPending && <ActivityIndicator color="#0E7A63" />}
          {errorMessage && <Text accessibilityRole="alert" accessibilityLiveRegion="polite" className="mt-3 font-sans text-body text-alert">{errorMessage}</Text>}

          <View className="mt-6 flex-row gap-[10px] pb-6">
            {step > 1 && (
              <TouchableOpacity
                disabled={isPending}
                onPress={handleBack}
                className="flex-1 items-center justify-center rounded-control border border-line-strong bg-card px-[18px] py-[11px]"
              >
                <Text className="font-sans-medium text-xs text-ink">Voltar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              disabled={isPending}
              accessibilityState={{ disabled: isPending, busy: isPending }}
              onPress={handleNext}
              className="flex-1 items-center justify-center rounded-control bg-clinic px-5 py-3"
            >
              <Text className="font-sans-semibold text-title text-white">
                {isPending ? "Cadastrando..." : step === 3 ? "Cadastrar" : "Próximo"}
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
