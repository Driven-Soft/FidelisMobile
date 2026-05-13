import React, { useMemo, useState, useRef } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_TUTOR_REMINDERS, MOCK_TUTOR_PETS } from '../../data/fidelisData';
import SectionHeader from '../../components/common/SectionHeader';
import ReminderCard from '../../components/Tutor/ReminderCard';
import NewReminderModal from '../../components/Tutor/NewReminderModal';

const RemindersScreen = () => {
  const [reminders, setReminders] = useState(MOCK_TUTOR_REMINDERS);
  const [filterType, setFilterType] = useState('Todos');
  const [modalVisible, setModalVisible] = useState(false);

  const filterOptions = ['Todos', 'VACINA', 'RETORNO', 'MEDICAMENTO', 'CHECKUP', 'VERMÍFUGO'];

  const scale = useRef(new Animated.Value(1)).current;

  const filteredReminders = useMemo(() => {
    return reminders.filter((item) => (filterType === 'Todos' ? true : item.type === filterType));
  }, [filterType, reminders]);

  const buckets = useMemo(() => {
    const pending = filteredReminders.filter((item) => !item.completed && new Date(item.dueDate) >= new Date());
    const delayed = filteredReminders.filter((item) => !item.completed && new Date(item.dueDate) < new Date());
    const completed = filteredReminders.filter((item) => item.completed);
    return { pending, delayed, completed };
  }, [filteredReminders]);

  const markAsComplete = (reminderId) => {
    setReminders((current) => current.map((item) => (item.id === reminderId ? { ...item, completed: true } : item)));
  };

  const ignoreReminder = (reminderId) => {
    // mark as completed (ignored) for now
    setReminders((current) => current.map((item) => (item.id === reminderId ? { ...item, completed: true, ignored: true } : item)));
  };

  const handleCreate = (newReminder) => {
    setReminders((current) => [newReminder, ...current]);
    setModalVisible(false);
  };

  const onFabPressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const onFabPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-4">
          <SectionHeader title="Lembretes" subtitle="Vacinas, medicamentos e consultas organizados em um único lugar" />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4" contentContainerClassName="space-x-2">
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option}
                className={`rounded-full border px-4 py-2 ${filterType === option ? 'border-cyan-600 bg-cyan-600' : 'border-slate-200 bg-white'}`}
                onPress={() => setFilterType(option)}
              >
                <Text className={`text-sm font-medium ${filterType === option ? 'text-white' : 'text-slate-500'}`}>
                  {option === 'Todos' ? 'Todos' : option.charAt(0).toUpperCase() + option.slice(1).toLowerCase().replace('í', 'í')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {buckets.delayed.length > 0 && (
            <View className="mb-8">
              <SectionHeader title="Atrasados" subtitle={`${buckets.delayed.length} lembretes`} />
              <View className="pb-6">
                {buckets.delayed.map((reminder) => (
                  <ReminderCard key={reminder.id} reminder={{...reminder, ...(MOCK_TUTOR_PETS.find(p=>p.id===reminder.petId) || {})}} onComplete={markAsComplete} />
                ))}
              </View>
            </View>
          )}

          {buckets.pending.length > 0 && (
            <View className="mb-8">
              <SectionHeader title="Pendentes" subtitle={`${buckets.pending.length} lembretes`} />
              <View className="pb-6">
                {buckets.pending.map((reminder) => (
                  <ReminderCard key={reminder.id} reminder={{...reminder, ...(MOCK_TUTOR_PETS.find(p=>p.id===reminder.petId) || {})}} onComplete={markAsComplete} onIgnore={ignoreReminder} />
                ))}
              </View>
            </View>
          )}

          {buckets.completed.length > 0 && (
            <View className="mb-8">
              <SectionHeader title="Concluídos" subtitle={`${buckets.completed.length} lembretes`} />
              <View className="pb-6">
                {buckets.completed.map((reminder) => (
                  <ReminderCard key={reminder.id} reminder={{...reminder, ...(MOCK_TUTOR_PETS.find(p=>p.id===reminder.petId) || {})}} />
                ))}
              </View>
            </View>
          )}

          {filteredReminders.length === 0 && (
            <View className="items-center py-10">
              <Text className="text-base text-slate-500">Nenhum lembrete encontrado</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <NewReminderModal visible={modalVisible} onClose={() => setModalVisible(false)} onSave={handleCreate} pets={MOCK_TUTOR_PETS} />

      <Animated.View style={{ position: 'absolute', bottom: 24, right: 20, transform: [{ scale }] }}>
        <TouchableOpacity
          accessibilityLabel="Novo lembrete"
          onPressIn={onFabPressIn}
          onPressOut={onFabPressOut}
          onPress={() => setModalVisible(true)}
          className="h-14 w-14 items-center justify-center rounded-full bg-cyan-600 shadow-sm"
        >
          <Text className="text-[28px] text-white">+</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default RemindersScreen;
