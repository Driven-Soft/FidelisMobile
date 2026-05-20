import React, { useContext, useMemo, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import AvatarBadge from "../../components/common/AvatarBadge";
import { UserContext } from "../../context/UserContext";
import { Masks } from "react-native-mask-input";

const initialForm = {
  name: "",
  species: "",
  breed: "",
  weight: "",
  sex: "",
  birthDate: "",
  emoji: "🐾",
  observations: "",
};

const NewPet = ({ navigation }) => {
  const { addTutorPet, user } = useContext(UserContext);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const [touched, setTouched] = useState({
    name: false,
    species: false,
    breed: false,
    weight: false,
    sex: false,
    birthDate: false,
  });

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const formatWeight = (text) => text.replace(/[^0-9.,]/g, "");

  const parsePtDate = (value) => {
    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return null;

    const day = Number(match[1]);
    const month = Number(match[2]);
    const year = Number(match[3]);
    const parsed = new Date(year, month - 1, day);

    if (
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) {
      return null;
    }

    if (parsed.getTime() > Date.now()) {
      return null;
    }

    return parsed;
  };

  const isNameValid = form.name.trim().length >= 2;
  const isSpeciesValid = form.species.trim().length >= 2;
  const isBreedValid = form.breed.trim().length >= 2;
  const isWeightValid =
    form.weight.trim().length > 0 && /^\d+([.,]\d+)?$/.test(form.weight.trim());
  const isSexValid = ["macho", "fêmea", "femea", "m", "f"].includes(
    form.sex.trim().toLowerCase(),
  );
  const isBirthDateValid =
    form.birthDate.trim().length > 0 &&
    parsePtDate(form.birthDate.trim()) !== null;

  const fieldErrors = {
    name:
      touched.name && !isNameValid
        ? "O nome deve ter pelo menos 2 letras"
        : null,
    species:
      touched.species && !isSpeciesValid ? "Informe uma espécie válida" : null,
    breed: touched.breed && !isBreedValid ? "Informe uma raça válida" : null,
    weight:
      touched.weight && !isWeightValid
        ? "Informe um peso válido numérico"
        : null,
    sex: touched.sex && !isSexValid ? "Informe 'Macho' ou 'Fêmea'" : null,
    birthDate:
      touched.birthDate && !isBirthDateValid
        ? form.birthDate.trim() === ""
          ? "Informe a data de nascimento"
          : "Data inválida ou no futuro"
        : null,
  };

  const setField = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));

  const validateStep = () => {
    const nextErrors = {};

    if (step === 1) {
      setTouched((prev) => ({
        ...prev,
        name: true,
        species: true,
        breed: true,
      }));
      if (!isNameValid) nextErrors.name = "O nome deve ter pelo menos 2 letras";
      if (!isSpeciesValid) nextErrors.species = "Informe uma espécie válida";
      if (!isBreedValid) nextErrors.breed = "Informe uma raça válida";
    }

    if (step === 2) {
      setTouched((prev) => ({
        ...prev,
        weight: true,
        sex: true,
        birthDate: true,
      }));
      if (!isWeightValid) nextErrors.weight = "Informe um peso numérico válido";
      if (!isSexValid) nextErrors.sex = "Informe 'Macho' ou 'Fêmea'";

      if (!form.birthDate.trim()) {
        nextErrors.birthDate = "Informe a data de nascimento";
      } else if (!parsePtDate(form.birthDate.trim())) {
        nextErrors.birthDate = "Data inválida ou no futuro";
      }
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

    const nextPet = {
      id: `${Date.now()}`,
      name: form.name.trim(),
      species: form.species.trim(),
      breed: form.breed.trim(),
      weight: form.weight.trim().replace(",", "."),
      sex:
        form.sex.trim().charAt(0).toUpperCase() +
        form.sex.trim().slice(1).toLowerCase(),
      birthDate: form.birthDate.trim(),
      avatar: form.emoji?.trim() || "🐾",
      color: "#E0F2FE",
      accent: "#0EA5E9",
      clinic: user?.clinic ?? "Clínica VetCare São Paulo",
    };

    addTutorPet(nextPet);
    navigation.goBack();
  };

  const stepLabels = useMemo(
    () => [
      { number: 1, label: "Dados básicos" },
      { number: 2, label: "Dados físicos" },
      { number: 3, label: "Foto e observações" },
    ],
    [],
  );

  const currentStep = stepLabels[step - 1];

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-4 pb-6 pt-4"
      >
        <Text className="text-4xl font-bold text-slate-900">Cadastrar Pet</Text>
        <Text className="mt-2 mb-6 text-sm text-slate-500">
          Preencha o cadastro em 3 etapas e salve o perfil do animal.
        </Text>

        <View className="mb-6 flex-row items-start">
          {stepLabels.map((item, index) => (
            <View key={item.number} className="flex-1 items-center">
              <View className="flex-row items-center w-full">
                <View
                  className={`flex-1 h-0.5 ${
                    index === 0
                      ? "bg-transparent"
                      : item.number <= step
                        ? "bg-cyan-600"
                        : "bg-slate-200"
                  }`}
                />
                <View
                  className={`h-9 w-9 items-center justify-center rounded-full ${
                    item.number <= step ? "bg-cyan-600" : "bg-slate-200"
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      item.number <= step ? "text-white" : "text-slate-500"
                    }`}
                  >
                    {item.number}
                  </Text>
                </View>
                <View
                  className={`flex-1 h-0.5 ${
                    index === stepLabels.length - 1
                      ? "bg-transparent"
                      : item.number < step
                        ? "bg-cyan-600"
                        : "bg-slate-200"
                  }`}
                />
              </View>
              <Text className="mt-2 px-1 text-center text-xs text-slate-500 leading-tight">
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <Card className="mb-4">
          <Text className="mb-4 text-lg font-bold text-slate-900">
            {currentStep.label}
          </Text>
          {step === 1 && (
            <>
              <Input
                label="Nome"
                placeholder="Ex.: Thor"
                value={form.name}
                onChangeText={(value) => setField("name", value)}
                onBlur={() => handleBlur("name")}
                error={fieldErrors.name}
                isValid={touched.name && isNameValid}
                autoCapitalize="words"
              />
              <Input
                label="Espécie"
                placeholder="Ex.: Cão"
                value={form.species}
                onChangeText={(value) => setField("species", value)}
                onBlur={() => handleBlur("species")}
                error={fieldErrors.species}
                isValid={touched.species && isSpeciesValid}
                autoCapitalize="words"
              />
              <Input
                label="Raça"
                placeholder="Ex.: Golden Retriever"
                value={form.breed}
                onChangeText={(value) => setField("breed", value)}
                onBlur={() => handleBlur("breed")}
                error={fieldErrors.breed}
                isValid={touched.breed && isBreedValid}
                autoCapitalize="words"
              />
            </>
          )}

          {step === 2 && (
            <>
              <Input
                label="Peso (kg)"
                placeholder="Ex.: 28.5"
                value={form.weight}
                onChangeText={(value) =>
                  setField("weight", formatWeight(value))
                }
                onBlur={() => handleBlur("weight")}
                error={fieldErrors.weight}
                isValid={touched.weight && isWeightValid}
                keyboardType="numeric"
              />
              <Input
                label="Sexo"
                placeholder="Macho ou Fêmea"
                value={form.sex}
                onChangeText={(value) => setField("sex", value)}
                onBlur={() => handleBlur("sex")}
                error={fieldErrors.sex}
                isValid={touched.sex && isSexValid}
                autoCapitalize="words"
              />
              <Input
                label="Data de nascimento"
                placeholder="DD/MM/AAAA"
                value={form.birthDate}
                onChangeText={(value) => setField("birthDate", value)}
                onBlur={() => handleBlur("birthDate")}
                error={fieldErrors.birthDate}
                isValid={touched.birthDate && isBirthDateValid}
                mask={Masks.DATE_DDMMYYYY}
                keyboardType="numeric"
              />
            </>
          )}

          {step === 3 && (
            <>
              <View className="mb-4 flex-row items-center space-x-4">
                <AvatarBadge
                  emoji={form.emoji || "🐾"}
                  size={96}
                  backgroundColor="#F3F7FB"
                />
                <View className="flex-1">
                  <Input
                    label="Emoji da foto"
                    placeholder="🐶"
                    value={form.emoji}
                    onChangeText={(value) => setField("emoji", value)}
                  />
                  <Text className="mt-2 text-xs leading-5 text-slate-500">
                    No mock atual usamos emoji/foto ilustrativa. Em produção
                    aqui entraria upload real.
                  </Text>
                </View>
              </View>
              <Input
                label="Observações"
                placeholder="Alergias, preferências, observações clínicas..."
                value={form.observations}
                onChangeText={(value) => setField("observations", value)}
                multiline
                numberOfLines={4}
                style={{ marginTop: 16 }}
              />
            </>
          )}
        </Card>

        <View className="flex-row space-x-3">
          {step > 1 && (
            <Button
              title="Voltar"
              variant="outline"
              onPress={() => setStep((current) => current - 1)}
              style={{ flex: 1 }}
            />
          )}
          <Button
            title={step === 3 ? "Salvar pet" : "Próximo"}
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
