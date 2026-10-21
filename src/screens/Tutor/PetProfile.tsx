import type { PetProfileScreenProps } from '../../routes/types';
import { useState } from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { usePet } from '../../hooks/usePets';
import { petAgeLabel } from '../../utils/petUtils';
import TutorHeader from '../../components/Tutor/TutorHeader';
import PetAvatar from '../../components/Tutor/PetAvatar';
import PetQueryStatus from '../../components/Tutor/PetQueryStatus';
import { usePetReminders } from '../../hooks/useReminders';
import ReminderCard from '../../components/Tutor/ReminderCard';
import ReminderQueryStatus from '../../components/Tutor/ReminderQueryStatus';

const PetProfile = ({ route, navigation }: PetProfileScreenProps) => {
  const query = usePet(route.params?.petId);
  const pet = query.data;
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const reminders = usePetReminders(pet?.id);

  const tabs = [null, ...reminders.types];
  const selectedTab = activeTab !== null && reminders.types.includes(activeTab) ? activeTab : null;
  const visibleReminders = reminders.data.filter((item) => selectedTab === null || item.tipo === selectedTab);

  if (query.isPending || query.error || !pet) {
    return (
      <View className="flex-1 bg-mist">
        <TutorHeader title="Pet" onBack={() => navigation.goBack()} />
        <View className="flex-1 items-center justify-center px-4">
          <PetQueryStatus query={query} />
          {!query.isPending && !query.error && <Text className="font-sans-medium text-body text-ink">Pet não encontrado</Text>}
          <Pressable
            className="mt-3"
            onPress={() => navigation.goBack()}
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
          >
            <Text className="font-sans-medium text-eyebrow text-clinic">Voltar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-mist">
      <TutorHeader title={pet.nome} onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-3 px-4 pb-6 pt-[14px]">
        <View className="items-center rounded-card border border-line bg-card p-[14px]">
          <PetAvatar pet={pet} size={96} />
        </View>

        <View className="flex-row flex-wrap gap-[10px]">
          <View className="min-w-[48%] flex-1 rounded-card border border-line bg-card p-[13px]">
            <Text className="font-sans text-label text-slate">ESPÉCIE</Text>
            <Text className="mt-[3px] font-sans-medium text-body text-ink">{pet.especie}</Text>
          </View>
          <View className="min-w-[48%] flex-1 rounded-card border border-line bg-card p-[13px]">
            <Text className="font-sans text-label text-slate">RAÇA</Text>
            <Text className="mt-[3px] font-sans-medium text-body text-ink">{pet.raca}</Text>
          </View>
          <View className="min-w-[48%] flex-1 rounded-card border border-line bg-card p-[13px]">
            <Text className="font-sans text-label text-slate">SEXO</Text>
            <Text className="mt-[3px] font-sans-medium text-body text-ink">{pet.sexo === 'M' ? 'Macho' : 'Fêmea'}</Text>
          </View>
          <View className="min-w-[48%] flex-1 rounded-card border border-line bg-card p-[13px]">
            <Text className="font-sans text-label text-slate">IDADE</Text>
            <Text className="mt-[3px] font-mono-medium text-body text-ink">
              {petAgeLabel(pet.dataNascimento)}
            </Text>
          </View>
        </View>

        <View className="rounded-card border border-line bg-card p-[13px]">
          <Text className="font-sans text-label text-slate">CLÍNICA VINCULADA</Text>
          <Text className="mt-[3px] font-sans-medium text-body text-ink">
            {pet.clinicaId ? `Clínica #${pet.clinicaId}` : 'Não vinculada'}
          </Text>
        </View>

        <PetQueryStatus query={query} />
        <Text className="font-sans-semibold text-title text-ink">Lembretes do pet</Text>
        <Text className="font-sans text-label text-slate">Cuidados cadastrados em Lembretes, com suas datas previstas e status.</Text>
        <ReminderQueryStatus query={reminders} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-1">
          {tabs.map((tab) => (
            <Pressable
              key={tab === null ? 'all' : `type-${tab}`}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedTab === tab }}
              onPress={() => setActiveTab(tab)}
              style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
              className={`rounded-badge px-[10px] py-[5px] ${selectedTab === tab ? 'bg-clinic-50' : ''}`}
            >
              <Text
                className={`font-sans-medium text-eyebrow ${
                  selectedTab === tab ? 'text-clinic-ink' : 'text-slate'
                }`}
              >
                {tab ?? 'Todos'}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {visibleReminders.map((reminder) => <ReminderCard key={reminder.id} reminder={reminder} pet={pet} />)}
        {!reminders.isPending && !reminders.error && visibleReminders.length === 0 &&
          <View className="items-center rounded-card border border-line bg-card px-[14px] py-8">
            <Text className="font-sans text-body text-slate">Nenhum lembrete cadastrado para este pet.</Text>
          </View>}
      </ScrollView>
    </View>
  );
};

export default PetProfile;
