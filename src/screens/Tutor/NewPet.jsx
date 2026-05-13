import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../../styles/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import AvatarBadge from '../../components/common/AvatarBadge';

const initialForm = {
  name: '',
  species: '',
  breed: '',
  weight: '',
  sex: '',
  birthDate: '',
  emoji: '🐾',
  observations: '',
};

const NewPet = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const validateStep = () => {
    const nextErrors = {};

    if (step === 1) {
      if (!form.name.trim()) nextErrors.name = 'Informe o nome do pet';
      if (!form.species.trim()) nextErrors.species = 'Informe a espécie';
      if (!form.breed.trim()) nextErrors.breed = 'Informe a raça';
    }

    if (step === 2) {
      if (!form.weight.trim()) nextErrors.weight = 'Informe o peso';
      if (!form.sex.trim()) nextErrors.sex = 'Informe o sexo';
      if (!form.birthDate.trim()) nextErrors.birthDate = 'Informe a data de nascimento';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }

    navigation.goBack();
  };

  const stepLabels = useMemo(
    () => [
      { number: 1, label: 'Dados básicos' },
      { number: 2, label: 'Dados físicos' },
      { number: 3, label: 'Foto e observações' },
    ],
    []
  );

  const currentStep = stepLabels[step - 1];

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cadastrar Pet</Text>
        <Text style={styles.subtitle}>Preencha o cadastro em 3 etapas e salve o perfil do animal.</Text>

        <View style={styles.stepperRow}>
          {stepLabels.map((item) => (
            <View key={item.number} style={styles.stepWrap}>
              <View style={[styles.stepCircle, item.number <= step && styles.stepCircleActive]}>
                <Text style={[styles.stepNumber, item.number <= step && styles.stepNumberActive]}>{item.number}</Text>
              </View>
              <Text style={styles.stepLabel}>{item.label}</Text>
              {item.number < stepLabels.length && <View style={[styles.stepLine, item.number < step && styles.stepLineActive]} />}
            </View>
          ))}
        </View>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>{currentStep.label}</Text>
          {step === 1 && (
            <>
              <Input label="Nome" placeholder="Ex.: Thor" value={form.name} onChangeText={(value) => setField('name', value)} error={errors.name} />
              <Input label="Espécie" placeholder="Ex.: Cão" value={form.species} onChangeText={(value) => setField('species', value)} error={errors.species} />
              <Input label="Raça" placeholder="Ex.: Golden Retriever" value={form.breed} onChangeText={(value) => setField('breed', value)} error={errors.breed} />
            </>
          )}

          {step === 2 && (
            <>
              <Input label="Peso" placeholder="Ex.: 28 kg" value={form.weight} onChangeText={(value) => setField('weight', value)} error={errors.weight} />
              <Input label="Sexo" placeholder="Ex.: Macho / Fêmea" value={form.sex} onChangeText={(value) => setField('sex', value)} error={errors.sex} />
              <Input label="Data de nascimento" placeholder="AAAA-MM-DD" value={form.birthDate} onChangeText={(value) => setField('birthDate', value)} error={errors.birthDate} />
            </>
          )}

          {step === 3 && (
            <>
              <View style={styles.previewRow}>
                <AvatarBadge emoji={form.emoji || '🐾'} size={96} backgroundColor="#F3F7FB" />
                <View style={{ flex: 1 }}>
                  <Input label="Emoji da foto" placeholder="🐶" value={form.emoji} onChangeText={(value) => setField('emoji', value)} />
                  <Text style={styles.helpText}>No mock atual usamos emoji/foto ilustrativa. Em produção aqui entraria upload real.</Text>
                </View>
              </View>
              <Input
                label="Observações"
                placeholder="Alergias, preferências, observações clínicas..."
                value={form.observations}
                onChangeText={(value) => setField('observations', value)}
                multiline
                numberOfLines={4}
                style={{ marginTop: SPACING.md }}
              />
            </>
          )}
        </Card>

        <View style={styles.actions}>
          {step > 1 && (
            <Button title="Voltar" variant="outline" onPress={() => setStep((current) => current - 1)} style={{ flex: 1 }} />
          )}
          <Button
            title={step === 3 ? 'Salvar pet' : 'Próximo'}
            variant="primary"
            onPress={handleNext}
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  stepWrap: {
    flex: 1,
    alignItems: 'center',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8EEF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  stepCircleActive: {
    backgroundColor: COLORS.accent,
  },
  stepNumber: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.textLight,
  },
  stepNumberActive: {
    color: COLORS.white,
  },
  stepLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  stepLine: {
    position: 'absolute',
    top: 18,
    right: '-50%',
    width: '100%',
    height: 2,
    backgroundColor: '#D4DEEA',
    zIndex: -1,
  },
  stepLineActive: {
    backgroundColor: COLORS.accent,
  },
  card: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  helpText: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
});

export default NewPet;
