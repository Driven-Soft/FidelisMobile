import React, { useState, useRef } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaskInput, { Masks } from "react-native-mask-input";
import Input from "../../components/common/Input";
import { useRegisterTutor } from "../../hooks/useRegisterTutor";
import { validateTutorRegistration, tutorRegistrationRequest, getRegistrationErrorMessage } from "../../utils/tutorRegistration";

export default function CadastroTutor({ navigation }) {
  const registration = useRegisterTutor();
  const submitting = useRef(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", cpf: "", address: "", password: "", confirmPassword: "",
  });
  const [touched, setTouched] = useState({});
  const validation = validateTutorRegistration(formData);
  const errors = Object.fromEntries(Object.entries(validation).filter(([field]) => touched[field]));
  const isNameValid = !validation.name;
  const isEmailValid = !validation.email;
  const isPhoneValid = !validation.phone;
  const isCpfValid = !validation.cpf;
  const isPasswordValid = !validation.password;
  const isConfirmPasswordValid = !validation.confirmPassword;

  const handleInputChange = (field, value) => {
    if (!submitting.current) setFormData((current) => ({ ...current, [field]: value }));
  };
  const handleBlur = (field) => setTouched((current) => ({ ...current, [field]: true }));
  const stepFields = [["name", "email", "phone"], ["cpf", "address"], ["password", "confirmPassword"]];

  const handleNext = async () => {
    if (registration.isPending || submitting.current || registration.isSuccess) return;
    const fields = step === 3 ? stepFields.flat() : stepFields[step - 1];
    setTouched((current) => ({ ...current, ...Object.fromEntries(fields.map((field) => [field, true])) }));
    if (fields.some((field) => validation[field])) return;
    if (step < 3) { setStep(step + 1); return; }
    submitting.current = true;
    try {
      await registration.mutateAsync(tutorRegistrationRequest(formData));
      setFormData((current) => ({ ...current, password: "", confirmPassword: "" }));
    } catch {
      // A mutation mantém o formulário e expõe o erro para a interface.
    } finally {
      submitting.current = false;
    }
  };
  const handleBack = () => {
    if (!registration.isPending && !submitting.current && step > 1) setStep(step - 1);
  };

  if (registration.isSuccess) return (
    <SafeAreaView className="flex-1 items-center justify-center gap-4 bg-mist px-4" edges={["top"]}>
      <Text accessibilityLiveRegion="polite" className="font-sans-semibold text-title text-ink">Cadastro realizado com sucesso.</Text>
      <Text className="font-sans text-body text-slate">Entre com o email e a senha que você cadastrou.</Text>
      <TouchableOpacity accessibilityRole="button" onPress={() => { if (!submitting.current) navigation.replace("Login"); }} className="rounded-control bg-clinic px-5 py-3">
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
                  editable={!registration.isPending}
                  onChangeText={(value) => handleInputChange("name", value)}
                  onBlur={() => handleBlur("name")}
                  error={errors.name}
                  isValid={touched.name && isNameValid}
                  maxLength={75}
                  autoCapitalize="words"
                />

                <Input
                  label="Email"
                  placeholder="joao@exemplo.com"
                  value={formData.email}
                  editable={!registration.isPending}
                  onChangeText={(value) => handleInputChange("email", value)}
                  onBlur={() => handleBlur("email")}
                  error={errors.email}
                  isValid={touched.email && isEmailValid}
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
                  editable={!registration.isPending}
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
                  editable={!registration.isPending}
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
              editable={!registration.isPending} maxLength={255}
            />}

            {step === 3 && (
              <>
                <Input
                  label="Senha"
                  placeholder="••••••••"
                  value={formData.password}
                  editable={!registration.isPending}
                  onChangeText={(value) => handleInputChange("password", value)}
                  onBlur={() => handleBlur("password")}
                  error={errors.password}
                  isValid={touched.password && isPasswordValid}
                  maxLength={50}
                  type="password"
                />
                <Input
                  label="Confirmar Senha"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  editable={!registration.isPending}
                  onChangeText={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  onBlur={() => handleBlur("confirmPassword")}
                  error={errors.confirmPassword}
                  isValid={touched.confirmPassword && isConfirmPasswordValid}
                  maxLength={50}
                  type="password"
                />
              </>
            )}
          </View>

          {registration.isPending && <ActivityIndicator color="#0E7A63" />}
          {registration.error && <Text accessibilityRole="alert" accessibilityLiveRegion="polite" className="mt-3 font-sans text-body text-alert">{getRegistrationErrorMessage(registration.error)}</Text>}

          <View className="mt-6 flex-row gap-[10px] pb-6">
            {step > 1 && (
              <TouchableOpacity
                disabled={registration.isPending}
                onPress={handleBack}
                className="flex-1 items-center justify-center rounded-control border border-line-strong bg-card px-[18px] py-[11px]"
              >
                <Text className="font-sans-medium text-xs text-ink">Voltar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              disabled={registration.isPending}
              accessibilityState={{ disabled: registration.isPending, busy: registration.isPending }}
              onPress={handleNext}
              className="flex-1 items-center justify-center rounded-control bg-clinic px-5 py-3"
            >
              <Text className="font-sans-semibold text-title text-white">
                {registration.isPending ? "Cadastrando..." : step === 3 ? "Cadastrar" : "Próximo"}
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
