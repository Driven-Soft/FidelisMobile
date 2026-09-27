import { useState } from 'react';
import { View, ScrollView, Text, Pressable, RefreshControl } from 'react-native';
import { usePets } from '../../hooks/usePets';
import { useReminders } from '../../hooks/useReminders';
import { groupReminders } from '../../utils/reminderUtils';
import PetQueryStatus from '../../components/Tutor/PetQueryStatus';
import ReminderQueryStatus from '../../components/Tutor/ReminderQueryStatus';
import TutorHeader from '../../components/Tutor/TutorHeader';
import ReminderCard from '../../components/Tutor/ReminderCard';

export default function RemindersScreen() {
  const query = useReminders();
  const petsQuery = usePets();
  const pets = petsQuery.isError ? [] : petsQuery.data ?? [];
  const reminders = query.isError ? [] : query.data ?? [];
  const [filterType, setFilterType] = useState('Todos');
  const filterOptions = ['Todos', ...new Set(reminders.map((item) => item.tipo))];
  const groups = groupReminders(reminders, filterOptions.includes(filterType) ? filterType : 'Todos');
  return <View className="flex-1 bg-mist">
    <TutorHeader title="Lembretes" />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-3 px-4 pb-6 pt-[14px]"
      refreshControl={<RefreshControl refreshing={query.isFetching && !query.isPending} onRefresh={() => query.refetch()} />}>
      <Text className="font-sans text-body text-slate">Acompanhe os cuidados dos seus pets. O cadastro e a atualização são realizados pelo veterinário da clínica.</Text>
      <PetQueryStatus query={petsQuery} empty={pets.length === 0} />
      <ReminderQueryStatus query={query} empty={groups.every((group) => group.items.length === 0)} />
      <Pressable accessibilityRole="button" disabled={query.isFetching} onPress={() => query.refetch()}>
        <Text className="font-sans-medium text-body text-clinic">Atualizar lembretes</Text>
      </Pressable>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-1">
        {filterOptions.map((option) => <Pressable key={option} accessibilityRole="button"
          accessibilityState={{ selected: filterType === option }} onPress={() => setFilterType(option)}
          className={`rounded-badge px-[10px] py-[5px] ${filterType === option ? 'bg-clinic-50' : ''}`}>
          <Text className="font-sans-medium text-eyebrow text-slate">{option}</Text>
        </Pressable>)}
      </ScrollView>
      {groups.filter((group) => group.items.length > 0).map((group) => <View key={group.status} className="gap-[10px]">
        <Text className="font-sans-semibold text-title text-ink">{group.status} · {group.items.length}</Text>
        {group.items.map((reminder) => <ReminderCard key={reminder.id} reminder={reminder} pet={pets.find((pet) => pet.id === reminder.petId)} />)}
      </View>)}
    </ScrollView>
  </View>;
}
