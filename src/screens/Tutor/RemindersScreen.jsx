import React, { useMemo, useState, useRef, useContext, useEffect } from 'react';
import { Alert, View, ScrollView, Text, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_TUTOR_REMINDERS, MOCK_TUTOR_PETS } from '../../data/fidelisData';
import { UserContext } from '../../context/UserContext';
import SectionHeader from '../../components/common/SectionHeader';
import ReminderCard from '../../components/Tutor/ReminderCard';
import NewReminderModal from '../../components/Tutor/NewReminderModal';

const RemindersScreen = () => {
  const { user, userType, tutorPets } = useContext(UserContext);
  const [reminders, setReminders] = useState(MOCK_TUTOR_REMINDERS);
  const [filterType, setFilterType] = useState('Todos');
  const [modalVisible, setModalVisible] = useState(false);
  const [cardHeights, setCardHeights] = useState({});
  const pets = tutorPets?.length ? tutorPets : MOCK_TUTOR_PETS;
  const animationMap = useRef(new Map()).current;

  const storageKey = useMemo(() => {
    const owner = user?.email ?? 'guest';
    const portal = userType ?? 'TUTOR';
    return `@fidelis:reminders:${portal}:${owner}`;
  }, [user?.email, userType]);

  const filterOptions = ['Todos', 'VACINA', 'RETORNO', 'MEDICAMENTO', 'CHECKUP', 'VERMÍFUGO'];

  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadReminders = async () => {
      try {
        const saved = await AsyncStorage.getItem(storageKey);
        if (!saved) {
          setReminders(MOCK_TUTOR_REMINDERS);
          return;
        }

        const parsed = JSON.parse(saved);
        setReminders(Array.isArray(parsed) ? parsed : MOCK_TUTOR_REMINDERS);
      } catch (error) {
        setReminders(MOCK_TUTOR_REMINDERS);
      }
    };

    loadReminders();
  }, [storageKey]);

  useEffect(() => {
    const persistReminders = async () => {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(reminders));
      } catch (error) {
      }
    };

    persistReminders();
  }, [reminders, storageKey]);

  const filteredReminders = useMemo(() => {
    return reminders.filter((item) => {
      if (item.dismissed) return false;
      return filterType === 'Todos' ? true : item.type === filterType;
    });
  }, [filterType, reminders]);

  const buckets = useMemo(() => {
    const pending = filteredReminders.filter((item) => !item.completed && new Date(item.dueDate) >= new Date());
    const delayed = filteredReminders.filter((item) => !item.completed && new Date(item.dueDate) < new Date());
    const completed = filteredReminders.filter((item) => item.completed);
    return { pending, delayed, completed };
  }, [filteredReminders]);

  const getCardAnimation = (reminderId) => {
    const existing = animationMap.get(reminderId);
    if (existing) return existing;
    const next = new Animated.Value(1);
    animationMap.set(reminderId, next);
    return next;
  };

  const handleCardLayout = (reminderId, event) => {
    if (cardHeights[reminderId]) return;
    const { height } = event.nativeEvent.layout;
    setCardHeights((current) => ({ ...current, [reminderId]: height }));
  };

  const dismissReminder = (reminderId, updates) => {
    const animation = getCardAnimation(reminderId);
    Animated.timing(animation, {
      toValue: 0,
      duration: 240,
      useNativeDriver: false,
    }).start(() => {
      setReminders((current) =>
        current.map((item) => (item.id === reminderId ? { ...item, ...updates, dismissed: true } : item))
      );
    });
  };

  const markAsComplete = (reminderId) => {
    dismissReminder(reminderId, { completed: true });
  };

  const ignoreReminder = (reminderId) => {
    Alert.alert(
      'Cancelar lembrete',
      'Tem certeza que deseja cancelar esse lembrete?',
      [
        { text: 'Nao', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: () => {
            dismissReminder(reminderId, { completed: true, ignored: true });
          },
        },
      ]
    );
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
                {buckets.delayed.map((reminder) => {
                  const animation = getCardAnimation(reminder.id);
                  const height = cardHeights[reminder.id];
                  const animatedStyle = height
                    ? { height: animation.interpolate({ inputRange: [0, 1], outputRange: [0, height] }), opacity: animation }
                    : { opacity: animation };

                  return (
                    <Animated.View
                      key={reminder.id}
                      style={[{ overflow: 'hidden' }, animatedStyle]}
                      onLayout={(event) => handleCardLayout(reminder.id, event)}
                    >
                      <ReminderCard reminder={{ ...reminder, ...(pets.find((p) => p.id === reminder.petId) || {}) }} onComplete={markAsComplete} onIgnore={ignoreReminder} />
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          )}

          {buckets.pending.length > 0 && (
            <View className="mb-8">
              <SectionHeader title="Pendentes" subtitle={`${buckets.pending.length} lembretes`} />
              <View className="pb-6">
                {buckets.pending.map((reminder) => {
                  const animation = getCardAnimation(reminder.id);
                  const height = cardHeights[reminder.id];
                  const animatedStyle = height
                    ? { height: animation.interpolate({ inputRange: [0, 1], outputRange: [0, height] }), opacity: animation }
                    : { opacity: animation };

                  return (
                    <Animated.View
                      key={reminder.id}
                      style={[{ overflow: 'hidden' }, animatedStyle]}
                      onLayout={(event) => handleCardLayout(reminder.id, event)}
                    >
                      <ReminderCard reminder={{ ...reminder, ...(pets.find((p) => p.id === reminder.petId) || {}) }} onComplete={markAsComplete} onIgnore={ignoreReminder} />
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          )}

          {buckets.completed.length > 0 && (
            <View className="mb-8">
              <SectionHeader title="Concluídos" subtitle={`${buckets.completed.length} lembretes`} />
              <View className="pb-6">
                {buckets.completed.map((reminder) => {
                  const animation = getCardAnimation(reminder.id);
                  const height = cardHeights[reminder.id];
                  const animatedStyle = height
                    ? { height: animation.interpolate({ inputRange: [0, 1], outputRange: [0, height] }), opacity: animation }
                    : { opacity: animation };

                  return (
                    <Animated.View
                      key={reminder.id}
                      style={[{ overflow: 'hidden' }, animatedStyle]}
                      onLayout={(event) => handleCardLayout(reminder.id, event)}
                    >
                      <ReminderCard reminder={{ ...reminder, ...(pets.find((p) => p.id === reminder.petId) || {}) }} />
                    </Animated.View>
                  );
                })}
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
      <NewReminderModal visible={modalVisible} onClose={() => setModalVisible(false)} onSave={handleCreate} pets={pets} />

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
