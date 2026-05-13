import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

export default function CadastroVet({ navigation }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    crmv: '',
    specialty: '',
    clinic: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    navigation.replace('Login');
  };

  const progressSteps = [
    { number: 1, title: 'Informações Básicas', subtitle: 'Nome, email e telefone' },
    { number: 2, title: 'Dados Profissionais', subtitle: 'CRMV, especialidade e clínica' },
    { number: 3, title: 'Senha', subtitle: 'Crie sua senha segura' },
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
                <View className={`h-10 w-10 items-center justify-center rounded-full ${num <= step ? 'bg-slate-900' : 'bg-slate-200'}`}>
                  <Text className={`text-sm font-bold ${num <= step ? 'text-white' : 'text-slate-500'}`}>
                    {num}
                  </Text>
                </View>
                {num < 3 && (
                  <View className={`h-0.5 w-full ${num < step ? 'bg-slate-900' : 'bg-slate-200'}`} />
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
                  placeholder="Dr. João Silva"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                />
                <Input
                  label="Email Profissional"
                  placeholder="joao@clinica.com"
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
                  label="CRMV"
                  placeholder="CRMV-SP 12345"
                  value={formData.crmv}
                  onChangeText={(value) => handleInputChange('crmv', value)}
                />
                <Input
                  label="Especialidade"
                  placeholder="Clínica Geral"
                  value={formData.specialty}
                  onChangeText={(value) => handleInputChange('specialty', value)}
                />
                <Input
                  label="Clínica Vinculada"
                  placeholder="Nome da clínica"
                  value={formData.clinic}
                  onChangeText={(value) => handleInputChange('clinic', value)}
                />
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
                className="font-bold text-slate-900"
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