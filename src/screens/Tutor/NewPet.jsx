import React, { useContext, useMemo, useState } from "react";
import { View, ScrollView, Text, Pressable } from "react-native";
import TutorHeader from "../../components/Tutor/TutorHeader";
import Input from "../../components/common/Input";
import Avatar from "../../components/common/Avatar";
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
    <View className="flex-1 bg-mist">
      <TutorHeader title="Cadastrar Pet" onBack={() => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-3 px-4 pb-6 pt-[14px]"
      >
        <Text className="font-sans text-body text-slate">
          Preencha o cadastro em 3 etapas e salve o perfil do animal.
        </Text>

        <View className="flex-row items-start">
          {stepLabels.map((item, index) => (
            <View key={item.number} className="flex-1 items-center">
              <View className="w-full flex-row items-center">
                <View
                  className={`h-px flex-1 ${
                    index === 0
                      ? "bg-transparent"
                      : item.number <= step
                        ? "bg-clinic"
                        : "bg-line"
                  }`}
                />
                <View
                  className={`h-7 w-7 items-center justify-center rounded-full ${
                    item.number <= step ? "bg-clinic" : "bg-hairline"
                  }`}
                >
                  <Text
                    className={`font-mono-medium text-badge ${
                      item.number <= step ? "text-white" : "text-slate"
                    }`}
                  >
                    {item.number}
                  </Text>
                </View>
                <View
                  className={`h-px flex-1 ${
                    index === stepLabels.length - 1
                      ? "bg-transparent"
                      : item.number < step
                        ? "bg-clinic"
                        : "bg-line"
                  }`}
                />
              </View>
              <Text className="mt-2 px-1 text-center font-sans text-label text-slate">
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        <View className="rounded-card border border-line bg-card p-[14px]">
          <Text className="mb-[14px] font-sans-semibold text-title text-ink">
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
                mono
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
                mono
              />
            </>
          )}

          {step === 3 && (
            <>
              <View className="mb-3 flex-row items-center gap-3">
                <Avatar emoji={form.emoji || "🐾"} size={72} radius={12} />
                <View className="flex-1">
                  <Input
                    label="Emoji da foto"
                    placeholder="🐶"
                    value={form.emoji}
                    onChangeText={(value) => setField("emoji", value)}
                  />
                  <Text className="font-sans text-label text-slate">
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
              />
            </>
          )}
        </View>

        <View className="flex-row gap-[10px]">
          {step > 1 && (
            <Pressable
              accessibilityRole="button"
              onPress={() => setStep((current) => current - 1)}
              style={({ pressed }) => [{ flex: 1 }, pressed ? { opacity: 0.7 } : null]}
              className="items-center justify-center rounded-control border border-line-strong bg-card px-[18px] py-[11px]"
            >
              <Text className="font-sans-medium text-xs text-ink">Voltar</Text>
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            onPress={handleNext}
            style={({ pressed }) => [{ flex: 1 }, pressed ? { opacity: 0.7 } : null]}
            className="items-center justify-center rounded-control bg-clinic px-5 py-3"
          >
            <Text className="font-sans-semibold text-title text-white">
              {step === 3 ? "Salvar pet" : "Próximo"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default NewPet;
