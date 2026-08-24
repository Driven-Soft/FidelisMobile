import React, { useContext } from 'react';
import { View, ScrollView, Text, Pressable } from 'react-native';
import { MOCK_TUTOR_PROFILE, MOCK_TUTOR_PETS, MOCK_TUTOR_HISTORY, formatPtDate, getPetAgeLabel } from '../../data/fidelisData';
import { UserContext } from '../../context/UserContext';
import TutorHeader from '../../components/Tutor/TutorHeader';
import Avatar from '../../components/common/Avatar';

const isUrgent = (dueDate) => {
  const days = Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24));
  return days <= 3;
};

export default function HomeTutor({ navigation }) {
  const { user, tutorPets, tutorReminders } = useContext(UserContext);
  const tutorName = user?.name ?? MOCK_TUTOR_PROFILE.name;
  const pets = tutorPets?.length ? tutorPets : MOCK_TUTOR_PETS;
  const upcomingReminders = tutorReminders
    .filter((reminder) => !reminder.completed && !reminder.dismissed)
    .sort((left, right) => new Date(left.dueDate) - new Date(right.dueDate))
    .slice(0, 3);

  const openReminders = () => navigation.navigate('RemindersTutorScreen');

  return (
    <View className="flex-1 bg-mist">
      <TutorHeader title={`Olá, ${tutorName.split(' ')[0]}`} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-3 px-4 pb-6 pt-[14px]">
        <View>
          <Text className="font-sans-semibold text-title text-ink">Tudo sob controle para hoje</Text>
          <Text className="mt-1 font-sans text-body text-slate">
            Acompanhe os pets, próximos cuidados e o histórico mais recente em um só lugar.
          </Text>
        </View>

        <View className="gap-[10px]">
          <View>
            <Text className="font-sans-semibold text-title text-ink">Meus Pets</Text>
            <Text className="mt-[2px] font-sans text-label text-slate">
              Arraste para o lado ou toque para abrir o perfil
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-[10px] pr-4">
            {pets.map((pet) => (
              <Pressable
                key={pet.id}
                accessibilityRole="button"
                onPress={() => navigation.navigate('PetProfile', { petId: pet.id })}
                style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
                className="w-[136px] items-center rounded-card border border-line bg-card p-[14px]"
              >
                <Avatar emoji={pet.avatar} name={pet.name} size={56} radius={12} />
                <Text className="mt-3 font-sans-medium text-body text-ink">{pet.name}</Text>
                <Text className="mt-[2px] text-center font-sans text-label text-slate">{pet.breed}</Text>
                <Text className="mt-[2px] font-mono text-label text-slate">{getPetAgeLabel(pet.birthDate)}</Text>
                <View className="mt-[10px] rounded-badge bg-hairline px-2 py-1">
                  <Text className="font-sans-semibold text-badge text-slate">{pet.species.toUpperCase()}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="gap-[10px]">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-3">
              <Text className="font-sans-semibold text-title text-ink">Próximos cuidados</Text>
              <Text className="mt-[2px] font-sans text-label text-slate">
                Vacinas, medicamentos e consultas que vêm aí
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={openReminders}
              hitSlop={8}
              style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
            >
              <Text className="font-sans-medium text-eyebrow text-clinic">Ver tudo</Text>
            </Pressable>
          </View>

          <View className="overflow-hidden rounded-card border border-line bg-card">
            {upcomingReminders.length === 0 ? (
              <Text className="px-[14px] py-6 text-center font-sans text-body text-slate">
                Nenhum cuidado pendente por aqui.
              </Text>
            ) : (
              upcomingReminders.map((reminder, index) => (
                <Pressable
                  key={reminder.id}
                  accessibilityRole="button"
                  onPress={openReminders}
                  style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
                  className={`min-h-[56px] flex-row items-center gap-3 px-[14px] py-3 ${
                    index === upcomingReminders.length - 1 ? '' : 'border-b border-hairline'
                  }`}
                >
                  <View
                    className={`h-[6px] w-[6px] rounded-full ${isUrgent(reminder.dueDate) ? 'bg-alert' : 'bg-clinic'}`}
                  />
                  <View className="flex-1">
                    <Text className="font-sans-medium text-body text-ink">
                      {reminder.title || reminder.description}
                    </Text>
                    <Text className="font-mono text-label text-slate">
                      {reminder.petName} · {formatPtDate(reminder.dueDate)}
                    </Text>
                    {reminder.title ? (
                      <Text className="mt-1 font-sans text-label text-slate">{reminder.description}</Text>
                    ) : null}
                  </View>
                  <View className="self-start rounded-badge bg-hairline px-2 py-1">
                    <Text className="font-sans-semibold text-badge text-slate">{reminder.type}</Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
        </View>

        <View className="gap-[10px]">
          <View>
            <Text className="font-sans-semibold text-title text-ink">Histórico recente</Text>
            <Text className="mt-[2px] font-sans text-label text-slate">
              Os últimos eventos clínicos dos seus pets
            </Text>
          </View>

          <View className="overflow-hidden rounded-card border border-line bg-card">
            {MOCK_TUTOR_HISTORY.map((event, index) => (
              <View
                key={event.id}
                className={`gap-1 px-[14px] py-3 ${
                  index === MOCK_TUTOR_HISTORY.length - 1 ? '' : 'border-b border-hairline'
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <View className="flex-1">
                    <Text className="font-sans-medium text-body text-ink">{event.title}</Text>
                    <Text className="font-mono text-label text-slate">
                      {event.petName} · {formatPtDate(event.date)}
                    </Text>
                  </View>
                  <View className="self-start rounded-badge bg-hairline px-2 py-1">
                    <Text className="font-sans-semibold text-badge text-slate">{event.type}</Text>
                  </View>
                </View>
                <Text className="font-sans text-label text-slate">{event.note}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={openReminders}
          style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
          className="mt-1 items-center justify-center rounded-control bg-clinic px-5 py-3"
        >
          <Text className="font-sans-semibold text-title text-white">Ver todos os lembretes</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
