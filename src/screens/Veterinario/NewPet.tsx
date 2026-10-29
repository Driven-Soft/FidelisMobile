import type { NewPetScreenProps } from '../../routes/types';
import { View, ScrollView, Text, Pressable } from "react-native";
import TutorHeader from "../../components/Tutor/TutorHeader";
import Input from "../../components/common/Input";
import PetQueryStatus from "../../components/common/PetQueryStatus";
import { useVeterinarianPet } from "../../hooks/useVeterinarianPets";
import { usePetForm } from "../../hooks/usePetForm";
import { Masks } from "react-native-mask-input";
import TutorDataStatus from "../../components/common/TutorDataStatus";
import type { PetResponse } from "../../models/pet";

interface PetFormProps {
  pet: PetResponse | null;
  navigation: NewPetScreenProps['navigation'];
}

export default function NewPet({ navigation, route }: NewPetScreenProps) {
  const editing = route.params?.petId !== undefined;
  const query = useVeterinarianPet(route.params?.petId);
  if (editing && (query.isPending || query.error || !query.data)) {
    return (
      <View className="flex-1 bg-mist">
        <TutorHeader eyebrow="Portal do Veterinário" title="Editar Pet" onBack={() => navigation.goBack()} />
        <View className="px-4">
          <PetQueryStatus query={query} />
          {!query.isPending && !query.error && <Text className="font-sans text-body text-slate">Pet não encontrado.</Text>}
        </View>
      </View>
    );
  }
  return <PetForm key={editing ? query.data?.id : "new"} pet={editing ? query.data ?? null : null} navigation={navigation} />;
}

const PetForm = ({ pet, navigation }: PetFormProps) => {
  const {
    tutors, tutor, tutorId, setTutorId, profile, clinic, step, form, touched, validation, fieldErrors,
    confirmDelete, setConfirmDelete, handleDelete,
    setField, handleBlur, handleNext, handleBack, isPending, errorMessage,
  } = usePetForm(pet, () => navigation.goBack());
  const stepLabels = [
    { number: 1, label: "Dados básicos" },
    { number: 2, label: "Dados físicos" },
    { number: 3, label: pet ? "Foto" : "Foto e tutor" },
  ];
  const currentStep = stepLabels[step - 1];

  return (
    <View className="flex-1 bg-mist">
      <TutorHeader eyebrow="Portal do Veterinário" title={pet ? "Editar Pet" : "Cadastrar Pet"} onBack={isPending ? undefined : () => navigation.goBack()} />

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
                editable={!isPending}
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
                editable={!isPending}
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
                editable={!isPending}
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
                  <Pressable key={value} disabled={isPending} onPress={() => setField("sex", value)}
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
                editable={!isPending}
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
              editable={!isPending}
            />
          )}
          {step === 3 && <View className="gap-2">
            {(profile.isPending || clinic.isPending) && <Text className="font-sans text-body text-slate">Carregando clínica...</Text>}
            {(profile.error || clinic.error) && <View>
              <Text accessibilityRole="alert" className="font-sans text-body text-alert">Não foi possível carregar os dados da clínica.</Text>
              <Pressable accessibilityRole="button" onPress={() => { void profile.refetch(); void clinic.refetch(); }}><Text className="text-clinic">Tentar novamente</Text></Pressable>
            </View>}
            <Text className="font-sans text-body text-clinic">Clínica: {clinic.data?.nome ?? (profile.data?.clinicaId ? `#${profile.data.clinicaId}` : 'Indisponível')}</Text>
            <Text className="font-sans text-label text-slate">O pet será vinculado à sua clínica. A clínica e o tutor não poderão ser alterados neste formulário.</Text>
            {pet ? <View>
              {tutor.isPending ? <Text className="font-sans text-body text-slate">Carregando tutor...</Text> : tutor.error ? <>
                <Text accessibilityRole="alert" className="font-sans text-body text-alert">Não foi possível carregar o nome do tutor.</Text>
                <Pressable accessibilityRole="button" disabled={tutor.isFetching} onPress={() => tutor.refetch()}><Text className="text-clinic">Tentar novamente</Text></Pressable>
              </> : <Text className="font-sans text-body text-ink">Tutor: {tutor.data?.nome}</Text>}
            </View> : <>
              <Text className="font-sans-semibold text-body text-ink">Selecione o tutor</Text>
              <TutorDataStatus query={tutors} label="tutores" />
              {!tutors.isPending && !tutors.error && tutors.data?.length === 0 && <Text>Nenhum tutor cadastrado. O tutor precisa criar sua conta primeiro.</Text>}
              {!tutors.error && tutors.data?.map((tutor) => <Pressable key={tutor.id} disabled={isPending} onPress={() => setTutorId(tutor.id)} accessibilityRole="button" accessibilityState={{ selected: tutorId === tutor.id }} className={`rounded-control border p-3 ${tutorId === tutor.id ? 'border-clinic bg-clinic-50' : 'border-line bg-card'}`}>
                <Text className="font-sans-medium text-body text-ink">{tutor.nome}</Text>
                <Text className="font-sans text-label text-slate">{tutor.email}</Text>
              </Pressable>)}
              {fieldErrors.tutorId && <Text className="text-alert">{fieldErrors.tutorId}</Text>}
            </>}
          </View>}
        </View>

        {errorMessage && <Text accessibilityRole="alert" className="font-sans text-body text-alert">{errorMessage}</Text>}
        <View className="flex-row gap-[10px]">
          {step > 1 && (
            <Pressable
              accessibilityRole="button"
              disabled={isPending}
              onPress={handleBack}
              style={({ pressed }) => [{ flex: 1 }, pressed ? { opacity: 0.7 } : null]}
              className="items-center justify-center rounded-control border border-line-strong bg-card px-[18px] py-[11px]"
            >
              <Text className="font-sans-medium text-xs text-ink">Voltar</Text>
            </Pressable>
          )}
          <Pressable
            accessibilityRole="button"
            onPress={handleNext}
            disabled={isPending}
            accessibilityState={{ disabled: isPending, busy: isPending }}
            style={({ pressed }) => [{ flex: 1 }, pressed ? { opacity: 0.7 } : null]}
            className="items-center justify-center rounded-control bg-clinic px-5 py-3"
          >
            <Text className="font-sans-semibold text-title text-white">
              {isPending ? "Salvando..." : step === 3 ? "Salvar pet" : "Próximo"}
            </Text>
          </Pressable>
        </View>
        {pet && <View className="gap-3 mt-3">
          {confirmDelete ? <>
            <Text className="font-sans text-body text-alert">Excluir {pet.nome}? Esta ação não pode ser desfeita.</Text>
            <Pressable disabled={isPending} onPress={handleDelete} accessibilityRole="button"><Text className="text-alert">Confirmar exclusão</Text></Pressable>
            <Pressable disabled={isPending} onPress={() => setConfirmDelete(false)} accessibilityRole="button"><Text className="text-clinic">Cancelar</Text></Pressable>
          </> : <Pressable disabled={isPending} onPress={() => setConfirmDelete(true)} accessibilityRole="button"><Text className="text-alert">Excluir pet</Text></Pressable>}
        </View>}
      </ScrollView>
    </View>
  );
};
