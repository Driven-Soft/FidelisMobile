import React, { useMemo, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-6 pt-4">
        <Text className="text-4xl font-bold text-slate-900">Cadastrar Pet</Text>
        <Text className="mt-2 mb-6 text-sm text-slate-500">Preencha o cadastro em 3 etapas e salve o perfil do animal.</Text>

        <View className="mb-4 flex-row items-start">
          {stepLabels.map((item) => (
            <View key={item.number} className="flex-1 items-center">
              <View className={`mb-1 h-9 w-9 items-center justify-center rounded-full ${item.number <= step ? 'bg-cyan-600' : 'bg-slate-200'}`}>
                <Text className={`text-sm font-bold ${item.number <= step ? 'text-white' : 'text-slate-500'}`}>{item.number}</Text>
              </View>
              <Text className="text-center text-xs text-slate-500">{item.label}</Text>
              {item.number < stepLabels.length && <View className={`absolute top-[18px] right-[-50%] h-0.5 w-full ${item.number < step ? 'bg-cyan-600' : 'bg-slate-300'}`} />}
            </View>
          ))}
        </View>

        <Card className="mb-4">
          <Text className="mb-4 text-lg font-bold text-slate-900">{currentStep.label}</Text>
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
              <View className="mb-4 flex-row items-center space-x-4">
                <AvatarBadge emoji={form.emoji || '🐾'} size={96} backgroundColor="#F3F7FB" />
                <View className="flex-1">
                  <Input label="Emoji da foto" placeholder="🐶" value={form.emoji} onChangeText={(value) => setField('emoji', value)} />
                  <Text className="mt-2 text-xs leading-5 text-slate-500">No mock atual usamos emoji/foto ilustrativa. Em produção aqui entraria upload real.</Text>
                </View>
              </View>
              <Input
                label="Observações"
                placeholder="Alergias, preferências, observações clínicas..."
                value={form.observations}
                onChangeText={(value) => setField('observations', value)}
                multiline
                numberOfLines={4}
                style={{ marginTop: 16 }}
              />
            </>
          )}
        </Card>

        <View className="flex-row space-x-3">
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

export default NewPet;
