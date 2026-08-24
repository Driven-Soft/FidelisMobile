import React, { useMemo, useState, useRef, useContext } from 'react';
import { Alert, View, ScrollView, Text, Pressable, Animated } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { MOCK_TUTOR_PETS } from '../../data/fidelisData';
import { UserContext } from '../../context/UserContext';
import TutorHeader from '../../components/Tutor/TutorHeader';
import ReminderCard from '../../components/Tutor/ReminderCard';
import NewReminderModal from '../../components/Tutor/NewReminderModal';

const RemindersScreen = () => {
  const { tutorPets, tutorReminders, addTutorReminder, updateTutorReminder } =
    useContext(UserContext);
  const [filterType, setFilterType] = useState('Todos');
  const [modalVisible, setModalVisible] = useState(false);
  const [cardHeights, setCardHeights] = useState({});
  const pets = tutorPets?.length ? tutorPets : MOCK_TUTOR_PETS;
  const animationMap = useRef(new Map()).current;

  const filterOptions = ['Todos', 'VACINA', 'RETORNO', 'MEDICAMENTO', 'CHECKUP', 'VERMÍFUGO'];

  const scale = useRef(new Animated.Value(1)).current;

  const filteredReminders = useMemo(() => {
    return tutorReminders.filter((item) => {
      if (item.dismissed) return false;
      return filterType === 'Todos' ? true : item.type === filterType;
    });
  }, [filterType, tutorReminders]);

  const buckets = useMemo(() => {
    const pending = filteredReminders.filter((item) => !item.completed && new Date(item.dueDate) >= new Date());
    const delayed = filteredReminders.filter((item) => !item.completed && new Date(item.dueDate) < new Date());
    const completed = filteredReminders.filter((item) => item.completed);
    return { pending, delayed, completed };
  }, [filteredReminders]);

  const withPetInfo = (reminder) => {
    const pet = pets.find((item) => item.id === reminder.petId);
    return {
      ...reminder,
      petName: reminder.petName ?? pet?.name,
      petAvatar: reminder.petAvatar ?? pet?.avatar,
      petColor: reminder.petColor ?? pet?.color,
    };
  };

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
      animationMap.delete(reminderId);
      setCardHeights((current) => {
        const next = { ...current };
        delete next[reminderId];
        return next;
      });
      updateTutorReminder(reminderId, updates);
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
            dismissReminder(reminderId, { completed: true, ignored: true, dismissed: true });
          },
        },
      ]
    );
  };

  const handleCreate = (newReminder) => {
    addTutorReminder(newReminder);
    setModalVisible(false);
  };

  const onFabPressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const onFabPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  const renderBucket = (reminder, withActions = true) => {
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
        <ReminderCard
          reminder={withPetInfo(reminder)}
          onComplete={withActions ? markAsComplete : undefined}
          onIgnore={withActions ? ignoreReminder : undefined}
        />
      </Animated.View>
    );
  };

  return (
    <View className="flex-1 bg-mist">
      <TutorHeader title="Lembretes" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-3 px-4 pb-6 pt-[14px]">
        <Text className="font-sans text-body text-slate">
          Vacinas, medicamentos e consultas organizados em um único lugar.
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-1">
          {filterOptions.map((option) => {
            const isActive = filterType === option;

            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                onPress={() => setFilterType(option)}
                style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
                className={`rounded-badge px-[10px] py-[5px] ${isActive ? 'bg-clinic-50' : ''}`}
              >
                <Text
                  className={`font-sans-medium text-eyebrow ${isActive ? 'text-clinic-ink' : 'text-slate'}`}
                >
                  {option === 'Todos' ? 'Todos' : option.charAt(0) + option.slice(1).toLowerCase()}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {buckets.delayed.length > 0 && (
          <View className="gap-[10px]">
            <View>
              <Text className="font-sans-semibold text-title text-ink">Atrasados</Text>
              <Text className="mt-[2px] font-sans text-label text-slate">
                {buckets.delayed.length} lembretes
              </Text>
            </View>
            <View>{buckets.delayed.map((reminder) => renderBucket(reminder))}</View>
          </View>
        )}

        {buckets.pending.length > 0 && (
          <View className="gap-[10px]">
            <View>
              <Text className="font-sans-semibold text-title text-ink">Pendentes</Text>
              <Text className="mt-[2px] font-sans text-label text-slate">
                {buckets.pending.length} lembretes
              </Text>
            </View>
            <View>{buckets.pending.map((reminder) => renderBucket(reminder))}</View>
          </View>
        )}

        {buckets.completed.length > 0 && (
          <View className="gap-[10px]">
            <View>
              <Text className="font-sans-semibold text-title text-ink">Concluídos</Text>
              <Text className="mt-[2px] font-sans text-label text-slate">
                {buckets.completed.length} lembretes
              </Text>
            </View>
            <View>{buckets.completed.map((reminder) => renderBucket(reminder, false))}</View>
          </View>
        )}

        {filteredReminders.length === 0 && (
          <View className="items-center py-10">
            <Text className="font-sans text-body text-slate">Nenhum lembrete encontrado</Text>
          </View>
        )}
      </ScrollView>

      <NewReminderModal visible={modalVisible} onClose={() => setModalVisible(false)} onSave={handleCreate} pets={pets} />

      <Animated.View style={{ position: 'absolute', bottom: 24, right: 20, transform: [{ scale }] }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Novo lembrete"
          onPressIn={onFabPressIn}
          onPressOut={onFabPressOut}
          onPress={() => setModalVisible(true)}
          className="h-12 w-12 items-center justify-center rounded-full bg-clinic"
          style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
        >
          <Feather name="plus" size={20} color="#FFFFFF" />
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default RemindersScreen;
