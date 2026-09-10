import { useState } from "react";
import { View, ScrollView, Text, Pressable } from "react-native";
import TutorHeader from "../../components/Tutor/TutorHeader";
import Input from "../../components/common/Input";
import PetQueryStatus from "../../components/Tutor/PetQueryStatus";
import { usePet, useCreatePet, useUpdatePet } from "../../hooks/usePets";
import { emptyPetForm, petToForm, validatePetForm, petFormFields, petFormPatch, getPetErrorMessage } from "../../utils/petUtils";
import { Masks } from "react-native-mask-input";
import { useClinics } from "../../hooks/useClinics";
import PetClinicSelector from "../../components/Tutor/PetClinicSelector";

export default function NewPet({ navigation, route }) {
  const editing = route.params?.petId !== undefined;
  const query = usePet(route.params?.petId);
  if (editing && (query.isPending || query.error || !query.data)) {
    return (
      <View className="flex-1 bg-mist">
        <TutorHeader title="Editar Pet" onBack={() => navigation.goBack()} />
        <View className="px-4">
          <PetQueryStatus query={query} />
          {!query.isPending && !query.error && <Text className="font-sans text-body text-slate">Pet não encontrado.</Text>}
        </View>
      </View>
    );
  }
  return <PetForm key={editing ? query.data.id : "new"} pet={editing ? query.data : null} navigation={navigation} />;
}

const PetForm = ({ pet, navigation }) => {
  const create = useCreatePet();
  const update = useUpdatePet();
  const mutation = pet ? update : create;
  const clinics = useClinics(!pet);
  const [clinicId, setClinicId] = useState(null);
  const clinicAvailable = !clinics.isError && clinics.data?.some((clinic) => clinic.id === clinicId);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(() => pet ? petToForm(pet) : { ...emptyPetForm });
  const [touched, setTouched] = useState({});
  const validation = validatePetForm(form);
  if (!pet && !clinicAvailable) validation.clinicaId = "Selecione uma clínica disponível e confirme o aviso.";
  const fieldErrors = Object.fromEntries(Object.entries(validation).filter(([key]) => touched[key]));
  const handleBlur = (field) => setTouched((current) => ({ ...current, [field]: true }));
  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const stepFields = [["name", "species", "breed"], ["sex", "birthDate"], pet ? ["fotoUrl"] : ["fotoUrl", "clinicaId"]];
  const stepLabels = [
    { number: 1, label: "Dados básicos" },
    { number: 2, label: "Dados físicos" },
    { number: 3, label: pet ? "Foto" : "Foto e clínica" },
  ];
  const currentStep = stepLabels[step - 1];

  const handleNext = async () => {
    if (mutation.isPending || (!pet && step === 3 && clinics.isFetching)) return;
    const fields = step === 3 ? stepFields.flat() : stepFields[step - 1];
    setTouched((current) => ({ ...current, ...Object.fromEntries(fields.map((field) => [field, true])) }));
    if (fields.some((field) => validation[field])) return;
    if (step < 3) { setStep(step + 1); return; }
    try {
      if (pet) {
        const changes = petFormPatch(form, pet);
        if (Object.keys(changes).length === 0) { navigation.goBack(); return; }
        await update.mutateAsync({ id: pet.id, changes });
      } else {
        await create.mutateAsync({ ...petFormFields(form), clinicaId: clinicId });
      }
      navigation.goBack();
    } catch {
      // O erro da mutation é apresentado no formulário.
    }
  };

  return (
    <View className="flex-1 bg-mist">
      <TutorHeader title={pet ? "Editar Pet" : "Cadastrar Pet"} onBack={mutation.isPending ? undefined : () => navigation.goBack()} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-3 px-4 pb-6 pt-[14px]"
      >
        <Text className="font-sans text-body text-slate">
          Preencha os dados em 3 etapas e salve o perfil do animal.
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
                maxLength={30}
                editable={!mutation.isPending}
                onChangeText={(value) => setField("name", value)}
                onBlur={() => handleBlur("name")}
                error={fieldErrors.name}
                isValid={touched.name && !validation.name}
                autoCapitalize="words"
              />
              <Input
                label="Espécie"
                placeholder="Ex.: Cão"
                value={form.species}
                maxLength={20}
                editable={!mutation.isPending}
                onChangeText={(value) => setField("species", value)}
                onBlur={() => handleBlur("species")}
                error={fieldErrors.species}
                isValid={touched.species && !validation.species}
                autoCapitalize="words"
              />
              <Input
                label="Raça"
                placeholder="Ex.: Golden Retriever"
                value={form.breed}
                maxLength={20}
                editable={!mutation.isPending}
                onChangeText={(value) => setField("breed", value)}
                onBlur={() => handleBlur("breed")}
                error={fieldErrors.breed}
                isValid={touched.breed && !validation.breed}
                autoCapitalize="words"
              />
            </>
          )}

          {step === 2 && (
            <>
              <Text className="mb-2 font-sans text-label text-slate">Sexo</Text>
              <View className="mb-3 flex-row gap-3">
                {[["M", "Macho"], ["F", "Fêmea"]].map(([value, label]) => (
                  <Pressable key={value} disabled={mutation.isPending} onPress={() => setField("sex", value)}
                    accessibilityRole="button" accessibilityState={{ selected: form.sex === value }}
                    className={`rounded-control border px-4 py-2 ${form.sex === value ? "border-clinic bg-clinic-50" : "border-line-strong bg-card"}`}>
                    <Text className="font-sans text-body text-ink">{label}</Text>
                  </Pressable>
                ))}
              </View>
              {fieldErrors.sex && <Text className="mb-2 font-sans text-label text-alert">{fieldErrors.sex}</Text>}
              <Input
                label="Data de nascimento"
                placeholder="DD/MM/AAAA"
                value={form.birthDate}
                editable={!mutation.isPending}
                onChangeText={(value) => setField("birthDate", value)}
                onBlur={() => handleBlur("birthDate")}
                error={fieldErrors.birthDate}
                isValid={touched.birthDate && !validation.birthDate}
                mask={Masks.DATE_DDMMYYYY}
                keyboardType="numeric"
                mono
              />
            </>
          )}

          {step === 3 && (
            <Input
              label="URL da foto"
              placeholder="Informe o endereço da imagem"
              value={form.fotoUrl}
              onChangeText={(value) => setField("fotoUrl", value)}
              onBlur={() => handleBlur("fotoUrl")}
              error={fieldErrors.fotoUrl}
              isValid={touched.fotoUrl && !validation.fotoUrl}
              autoCapitalize="none"
              maxLength={255}
              editable={!mutation.isPending}
            />
          )}
          {step === 3 && !pet && <PetClinicSelector query={clinics} selectedId={clinicId}
            onSelect={setClinicId} disabled={mutation.isPending} error={fieldErrors.clinicaId} />}
        </View>

        {mutation.error && <Text accessibilityRole="alert" className="font-sans text-body text-alert">{getPetErrorMessage(mutation.error)}</Text>}
        <View className="flex-row gap-[10px]">
          {step > 1 && (
            <Pressable
              accessibilityRole="button"
              disabled={mutation.isPending}
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
            disabled={mutation.isPending}
            accessibilityState={{ disabled: mutation.isPending, busy: mutation.isPending }}
            style={({ pressed }) => [{ flex: 1 }, pressed ? { opacity: 0.7 } : null]}
            className="items-center justify-center rounded-control bg-clinic px-5 py-3"
          >
            <Text className="font-sans-semibold text-title text-white">
              {mutation.isPending ? "Salvando..." : step === 3 ? "Salvar pet" : "Próximo"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};
