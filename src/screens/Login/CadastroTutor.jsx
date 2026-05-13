import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../../styles/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import SectionHeader from '../../components/common/SectionHeader';

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    content: {
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.xl,
    },
    progressContainer: {
      flexDirection: 'row',
      gap: SPACING.md,
      marginBottom: SPACING.xl,
      alignItems: 'center',
    },
    progressDot: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: COLORS.lightGray,
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressDotActive: {
      backgroundColor: COLORS.accent,
    },
    progressDotText: {
      color: COLORS.textLight,
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.bold,
    },
    progressDotTextActive: {
      color: COLORS.white,
    },
    progressLine: {
      height: 2,
      backgroundColor: COLORS.lightGray,
      flex: 1,
    },
    progressLineActive: {
      backgroundColor: COLORS.accent,
    },
    title: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text,
      marginBottom: SPACING.lg,
    },
    subtitle: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textLight,
      marginBottom: SPACING.lg,
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: SPACING.md,
      marginTop: SPACING.xl,
      paddingBottom: SPACING.xl,
    },
    backButton: {
      flex: 1,
    },
    nextButton: {
      flex: 1,
    },
  });

  const progressSteps = [
    { number: 1, title: 'Informações Básicas', subtitle: 'Nome, email e telefone' },
    { number: 2, title: 'Dados Pessoais', subtitle: 'CPF' },
    { number: 3, title: 'Senha', subtitle: 'Crie sua senha' },
  ];

  const currentStep = progressSteps[step - 1];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            {[1, 2, 3].map((num) => (
              <View key={num} style={{ flex: 1, alignItems: 'center' }}>
                <View
                  style={[
                    styles.progressDot,
                    num <= step && styles.progressDotActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.progressDotText,
                      num <= step && styles.progressDotTextActive,
                    ]}
                  >
                    {num}
                  </Text>
                </View>
                {num < 3 && (
                  <View
                    style={[
                      styles.progressLine,
                      num < step && styles.progressLineActive,
                    ]}
                  />
                )}
              </View>
            ))}
          </View>

          <Text style={styles.title}>{currentStep.title}</Text>
          <Text style={styles.subtitle}>{currentStep.subtitle}</Text>

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
                <Text style={{ color: COLORS.textLight, fontSize: FONT_SIZES.xs, marginTop: SPACING.md }}>
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

          <View style={styles.buttonContainer}>
            {step > 1 && (
              <Button
                title="Voltar"
                variant="outline"
                onPress={handleBack}
                style={styles.backButton}
              />
            )}
            <Button
              title={step === 3 ? 'Cadastrar' : 'Próximo'}
              variant="primary"
              onPress={handleNext}
              style={styles.nextButton}
            />
          </View>

          <View style={{ alignItems: 'center', marginTop: SPACING.lg }}>
            <Text style={{ color: COLORS.textLight, fontSize: FONT_SIZES.sm }}>
              Já tem conta?{' '}
              <Text
                style={{ color: COLORS.accent, fontWeight: FONT_WEIGHTS.bold }}
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