import { View, Text, Pressable } from 'react-native';
import Avatar from '../common/Avatar';
import PetAvatar from './PetAvatar';
import { formatReminderDate, reminderStatusLabel } from '../../utils/reminderUtils';

const ReminderCard = ({ reminder, pet, onComplete, onCancel, onEdit, onDelete, busy = false, horizontal = false }) => {
  const status = reminderStatusLabel(reminder);
  const dueLabel = formatReminderDate(reminder.dataPrevista);
  const petName = pet?.nome ?? `Pet #${reminder.petId}`;

  return (
    <View
      className={`mb-[10px] rounded-card border border-line bg-card p-[14px] ${
        horizontal ? 'mr-[10px] min-w-[280px]' : ''
      }`}
    >
      <View className="flex-row items-center gap-3">
        {pet ? <PetAvatar pet={pet} size={32} /> : <Avatar name={petName} size={32} radius={8} />}

        <View className="flex-1">
          <Text className="font-sans-medium text-body text-ink">{petName}</Text>
          <Text className="font-mono text-label text-slate">{dueLabel}</Text>
        </View>

        <View className="items-end gap-1">
          <View className="rounded-badge bg-hairline px-2 py-1">
            <Text className="font-sans-semibold text-badge text-slate">{reminder.tipo}</Text>
          </View>
          <View
            className={`rounded-badge px-2 py-1 ${
              status === 'CONCLUÍDO' ? 'bg-clinic-50' : status === 'ATRASADO' ? 'bg-alert-50' : 'bg-hairline'
            }`}
          >
            <Text
              className={`font-sans-semibold text-badge ${
                status === 'CONCLUÍDO' ? 'text-clinic-ink' : status === 'ATRASADO' ? 'text-alert-ink' : 'text-slate'
              }`}
            >
              {status}
            </Text>
          </View>
        </View>
      </View>

      <Text className="mt-3 font-sans text-body text-ink">{reminder.descricao}</Text>

      {reminder.status === 'P' && onComplete && onCancel && (
        <View className="mt-[14px] flex-row gap-[10px]">
          <Pressable
            accessibilityRole="button"
            onPress={() => onComplete && onComplete(reminder.id)}
            disabled={busy}
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
            className="items-center justify-center rounded-control bg-clinic px-[14px] py-2"
          >
            <Text className="font-sans-semibold text-title text-white">Concluído</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={() => onCancel(reminder.id)}
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
            className="items-center justify-center rounded-control border border-line-strong bg-card px-[14px] py-2"
          >
            <Text className="font-sans-medium text-xs text-ink">Cancelar</Text>
          </Pressable>
        </View>
      )}
      <View className="mt-3 flex-row gap-4">
        {onEdit && <Pressable accessibilityRole="button" disabled={busy} onPress={() => onEdit(reminder.id)}><Text className="font-sans-medium text-body text-clinic">Editar</Text></Pressable>}
        {onDelete && <Pressable accessibilityRole="button" disabled={busy} onPress={() => onDelete(reminder.id)}><Text className="font-sans-medium text-body text-alert">Excluir</Text></Pressable>}
      </View>
    </View>
  );
};

export default ReminderCard;
