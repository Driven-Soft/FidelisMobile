import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const STORAGE_KEY_CADASTRO_TUTOR = '@fidelis:cadastro_tutor';

export default function CadastroTutor({ navigation }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (!validateStep(step)) {
      return;
    }

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    handleComplete();
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY_CADASTRO_TUTOR,
        JSON.stringify({
          userType: 'TUTOR',
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          cpf: formData.cpf.trim(),
          password: formData.password,
        })
      );
      Alert.alert('Sucesso', 'Cadastro de tutor realizado.');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Erro', 'Nao foi possivel salvar o cadastro.');
    }
  };

  const validateStep = (currentStep) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const digitsOnly = (value) => value.replace(/\D/g, '');

    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
        Alert.alert('Campos obrigatorios', 'Preencha nome, email e telefone.');
        return false;
      }

      if (!emailRegex.test(formData.email.trim())) {
        Alert.alert('Email invalido', 'Informe um email valido.');
        return false;
      }

      if (digitsOnly(formData.phone).length < 10) {
        Alert.alert('Telefone invalido', 'Informe um telefone com DDD.');
        return false;
      }
    }

    if (currentStep === 2) {
      const cpfDigits = digitsOnly(formData.cpf);
      if (!cpfDigits) {
        Alert.alert('Campos obrigatorios', 'Informe o CPF.');
        return false;
      }

      if (cpfDigits.length !== 11) {
        Alert.alert('CPF invalido', 'Informe um CPF com 11 digitos.');
        return false;
      }
    }

    if (currentStep === 3) {
      if (!formData.password || !formData.confirmPassword) {
        Alert.alert('Campos obrigatorios', 'Preencha a senha e a confirmacao.');
        return false;
      }

      if (formData.password.length < 6) {
        Alert.alert('Senha invalida', 'A senha deve ter ao menos 6 caracteres.');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Senha invalida', 'As senhas nao conferem.');
        return false;
      }
    }

    return true;
  };

  const progressSteps = [
    { number: 1, title: 'Informações Básicas', subtitle: 'Nome, email e telefone' },
    { number: 2, title: 'Dados Pessoais', subtitle: 'CPF' },
    { number: 3, title: 'Senha', subtitle: 'Crie sua senha' },
  ];

  const currentStep = progressSteps[step - 1];

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Progress Bar */}
          <View className="mb-6 flex-row items-center space-x-3">
            {[1, 2, 3].map((num) => (
              <View key={num} className="flex-1 items-center">
                <View className={`h-10 w-10 items-center justify-center rounded-full ${num <= step ? 'bg-cyan-600' : 'bg-slate-200'}`}>
                  <Text className={`text-sm font-bold ${num <= step ? 'text-white' : 'text-slate-500'}`}>
                    {num}
                  </Text>
                </View>
                {num < 3 && (
                  <View className={`h-0.5 w-full ${num < step ? 'bg-cyan-600' : 'bg-slate-200'}`} />
                )}
              </View>
            ))}
          </View>

          <Text className="mb-2 text-2xl font-bold text-slate-900">{currentStep.title}</Text>
          <Text className="mb-4 text-sm text-slate-500">{currentStep.subtitle}</Text>

          <Card>
            {step === 1 && (
              <>
                <Input
                  label="Nome Completo"
                  placeholder="João Silva"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                />
                <Input
                  label="Email"
                  placeholder="joao@exemplo.com"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                />
                <Input
                  label="Telefone"
                  placeholder="(11) 98765-4321"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                />
              </>
            )}

            {step === 2 && (
              <>
                <Input
                  label="CPF"
                  placeholder="123.456.789-10"
                  value={formData.cpf}
                  onChangeText={(value) => handleInputChange('cpf', value)}
                />
                <Text className="mt-4 text-xs text-slate-500">
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
                  onChangeText={(value) => handleInputChange('password', value)}
                  type="password"
                />
                <Input
                  label="Confirmar Senha"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
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
              title={step === 3 ? 'Cadastrar' : 'Próximo'}
              variant="primary"
              onPress={handleNext}
              style={{ flex: 1 }}
            />
          </View>

          <View className="mt-4 items-center">
            <Text className="text-sm text-slate-500">
              Já tem conta?{' '}
              <Text
                className="font-bold text-cyan-600"
                onPress={() => navigation.replace('Login')}
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