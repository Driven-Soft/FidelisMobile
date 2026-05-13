import React, { useContext } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_TUTOR_PROFILE, MOCK_TUTOR_PETS, MOCK_TUTOR_REMINDERS, MOCK_TUTOR_HISTORY, formatPtDate, getPetAgeLabel } from '../../data/fidelisData';
import { UserContext } from '../../context/UserContext';
import AvatarBadge from '../../components/common/AvatarBadge';
import Card from '../../components/common/Card';
import SectionHeader from '../../components/common/SectionHeader';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function HomeTutor({ navigation }) {
  const { user, tutorPets } = useContext(UserContext);
  const tutorName = user?.name ?? MOCK_TUTOR_PROFILE.name;
  const pets = tutorPets?.length ? tutorPets : MOCK_TUTOR_PETS;
  const upcomingReminders = [...MOCK_TUTOR_REMINDERS]
    .sort((left, right) => left.dueDate - right.dueDate)
    .slice(0, 3);

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-6">
        <View className="mt-4 rounded-3xl bg-cyan-700 p-6 shadow-sm">
          <Text className="mb-1 text-sm text-white/75">Olá, {tutorName.split(' ')[0]}</Text>
          <Text className="mb-2 text-4xl font-bold text-white">Tudo sob controle para hoje</Text>
          <Text className="text-sm leading-5 text-white/90">
            Acompanhe os pets, próximos cuidados e o histórico mais recente em um só lugar.
          </Text>
        </View>

        <SectionHeader title="Meus Pets" subtitle="Arraste para o lado ou toque para abrir o perfil" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="mb-2 space-x-3 pr-4">
          {pets.map((pet) => (
            <TouchableOpacity key={pet.id} onPress={() => navigation.navigate('PetProfile', { petId: pet.id })} className="w-40">
              <Card className="items-center py-4">
                <AvatarBadge emoji={pet.avatar} size={74} backgroundColor={pet.color} style={{ marginBottom: 16 }} />
                <Text className="text-lg font-bold text-slate-900">{pet.name}</Text>
                <Text className="mt-1 text-sm text-slate-500">{pet.breed}</Text>
                <Text className="mt-1 text-sm text-slate-500">{getPetAgeLabel(pet.birthDate)}</Text>
                <Badge type="Preventiva" label={pet.species} style={{ marginTop: 8 }} />
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <SectionHeader title="Próximos cuidados" subtitle="Vacinas, medicamentos e consultas que vêm aí" />
        <View className="space-y-3">
          {upcomingReminders.map((reminder) => (
            <TouchableOpacity key={reminder.id} onPress={() => navigation.navigate('RemindersTutorScreen')}>
              <Card className="border-l-4 border-cyan-600">
                <View className="flex-row items-start justify-between space-x-4">
                  <View className="flex-1">
                    <Text className="text-base font-bold text-slate-900">{reminder.title}</Text>
                    <Text className="mt-1 text-xs text-slate-500">{reminder.petName} • {formatPtDate(reminder.dueDate)}</Text>
                  </View>
                  <Badge type={reminder.type} label={reminder.type} />
                </View>
                <Text className="mt-3 text-sm leading-5 text-slate-500">{reminder.description}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader title="Histórico recente" subtitle="Os últimos eventos clínicos dos seus pets" />
        <View className="space-y-3">
          {MOCK_TUTOR_HISTORY.map((event) => (
            <Card key={event.id} className="border-l-4 border-slate-900">
              <View className="flex-row items-start justify-between space-x-4">
                <View className="flex-1">
                  <Text className="text-base font-bold text-slate-900">{event.title}</Text>
                  <Text className="mt-1 text-xs text-slate-500">{event.petName} • {formatPtDate(event.date)}</Text>
                </View>
                <Badge type={event.type} label={event.type} />
              </View>
              <Text className="mt-3 text-sm leading-5 text-slate-500">{event.note}</Text>
            </Card>
          ))}
        </View>

        <View className="mt-6">
          <Button title="Ver todos os lembretes" variant="secondary" onPress={() => navigation.navigate('RemindersTutorScreen')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
