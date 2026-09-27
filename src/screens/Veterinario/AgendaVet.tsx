import { useState, useRef } from 'react';
import { View, ScrollView, Text, Pressable, Animated, RefreshControl } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useClinicPets } from '../../hooks/useClinicPets';
import { useClinicAgenda } from '../../hooks/useClinicAgenda';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVeterinarianReminderActions } from '../../hooks/useVeterinarianReminders';
import { getReminderErrorMessage, groupReminders } from '../../utils/reminderUtils';
import PetQueryStatus from '../../components/Tutor/PetQueryStatus';
import ReminderQueryStatus from '../../components/Tutor/ReminderQueryStatus';
import ReminderCard from '../../components/Tutor/ReminderCard';
import NewReminderModal from '../../components/Veterinario/NewReminderModal';

const AgendaVet = () => {
  const query = useClinicAgenda(false);
  const { status: statusMutation, remove: deleteMutation } = useVeterinarianReminderActions();
  const petsQuery = useClinicPets();
  const pets = petsQuery.error ? [] : petsQuery.data ?? [];
  const reminders = query.data.map(({ reminder }) => reminder);
  const [filterType, setFilterType] = useState('Todos');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const scale = useRef(new Animated.Value(1)).current;
  const submitting = useRef(false);
  const busy = statusMutation.isPending || deleteMutation.isPending;
  const error = statusMutation.error ?? deleteMutation.error;
  const filterOptions = ['Todos', ...new Set(['VACINA', 'RETORNO', 'MEDICAMENTO', 'CHECKUP', 'VERMÍFUGO', ...reminders.map((item) => item.tipo)])];
  const groups = groupReminders(reminders, filterType);

  const act = async (id, action) => {
    if (busy || submitting.current) return;
    submitting.current = true;
    statusMutation.reset();
    deleteMutation.reset();
    try {
      if (action === 'delete') await deleteMutation.mutateAsync(id);
      else await statusMutation.mutateAsync({ id, status: action });
      setConfirmation(null);
    } catch {
      // Mantém a confirmação e apresenta o erro fornecido pela mutation.
    } finally {
      submitting.current = false;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-mist" edges={["top"]}>
      <Text className="px-4 pt-4 font-sans-semibold text-screen text-ink">Agenda da clínica</Text>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="gap-3 px-4 pb-20 pt-[14px]"
        refreshControl={<RefreshControl refreshing={query.isFetching && !query.isPending} onRefresh={() => query.refetch()} />}>
        {query.hasClinic && <Text className="font-sans-medium text-body text-clinic">{query.clinicName ?? `Clínica #${query.clinicId}`}</Text>}
        <Text className="font-sans text-body text-slate">Cadastre e acompanhe os cuidados dos pets da sua clínica. As datas são previsões de cuidados, não consultas confirmadas.</Text>
        {!petsQuery.isPending && !petsQuery.error && !petsQuery.hasClinic && <Text className="font-sans text-body text-slate">Não há uma clínica válida vinculada ao seu perfil.</Text>}
        <PetQueryStatus query={petsQuery} empty={pets.length === 0} />
        <ReminderQueryStatus query={query} empty={groups.every((group) => group.items.length === 0)} />
        <Pressable accessibilityRole="button" disabled={query.isFetching} onPress={() => query.refetch()}>
          <Text className="font-sans-medium text-body text-clinic">Atualizar agenda</Text>
        </Pressable>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-1">
          {filterOptions.map((option) => (
            <Pressable key={option} accessibilityRole="button" accessibilityState={{ selected: filterType === option }}
              onPress={() => setFilterType(option)} className={`rounded-badge px-[10px] py-[5px] ${filterType === option ? 'bg-clinic-50' : ''}`}>
              <Text className="font-sans-medium text-eyebrow text-slate">{option}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {busy && <Text className="font-sans text-body text-clinic">{deleteMutation.isPending ? 'Excluindo lembrete...' : 'Atualizando status...'}</Text>}
        {error && <Text accessibilityRole="alert" className="font-sans text-body text-alert">{getReminderErrorMessage(error)}</Text>}
        {confirmation && <View className="gap-3 rounded-card border border-alert bg-card p-[14px]">
          <Text className="font-sans text-body text-ink">{confirmation.action === 'delete' ? 'Excluir definitivamente este lembrete?' : 'Cancelar este lembrete? Ele permanecerá listado como cancelado.'}</Text>
          <Pressable accessibilityRole="button" disabled={busy} onPress={() => act(confirmation.id, confirmation.action)}>
            <Text className="text-alert">{busy ? 'Aguarde...' : 'Confirmar'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" disabled={busy} onPress={() => setConfirmation(null)}><Text className="text-clinic">Voltar</Text></Pressable>
        </View>}
        {groups.filter((group) => group.items.length > 0).map((group) => (
          <View key={group.status} className="gap-[10px]">
            <Text className="font-sans-semibold text-title text-ink">{group.status} · {group.items.length}</Text>
            {group.items.map((reminder) => <ReminderCard key={reminder.id} reminder={reminder}
              pet={pets.find((pet) => pet.id === reminder.petId)} busy={busy || !!confirmation}
              onComplete={(id) => act(id, 'C')}
              onCancel={(id) => setConfirmation({ id, action: 'X' })}
              onDelete={(id) => setConfirmation({ id, action: 'delete' })}
              onEdit={(id) => { setEditingId(id); setModalVisible(true); }} />)}
          </View>
        ))}
      </ScrollView>
      <NewReminderModal visible={modalVisible} onClose={() => setModalVisible(false)} pets={pets} reminderId={editingId} />
      <Animated.View style={{ position: 'absolute', bottom: 24, right: 20, transform: [{ scale }] }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Novo lembrete"
          disabled={busy || !!confirmation || petsQuery.isPending || !!petsQuery.error || pets.length === 0}
          onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()}
          onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
          onPress={() => { setEditingId(null); setModalVisible(true); }}
          className="h-12 w-12 items-center justify-center rounded-full bg-clinic">
          <Feather name="plus" size={20} color="#FFFFFF" />
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
};

export default AgendaVet;
