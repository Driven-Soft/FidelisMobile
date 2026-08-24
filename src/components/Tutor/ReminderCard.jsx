import { View, Text, Pressable } from 'react-native';
import Avatar from '../common/Avatar';

const ReminderCard = ({ reminder, onComplete, onIgnore, horizontal = false }) => {
  const daysUntilDue = Math.ceil((reminder.dueDate - new Date()) / (1000 * 60 * 60 * 24));
  const status = reminder.completed ? 'CONCLUÍDO' : daysUntilDue < 0 ? 'ATRASADO' : 'PENDENTE';
  const dueLabel = new Date(reminder.dueDate)
    .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    .replace('.', '');

  return (
    <View
      className={`mb-[10px] rounded-card border border-line bg-card p-[14px] ${
        horizontal ? 'mr-[10px] min-w-[280px]' : ''
      }`}
    >
      <View className="flex-row items-center gap-3">
        <Avatar emoji={reminder.petAvatar} name={reminder.petName} size={32} radius={8} />

        <View className="flex-1">
          <Text className="font-sans-medium text-body text-ink">{reminder.petName}</Text>
          <Text className="font-mono text-label text-slate">{dueLabel}</Text>
        </View>

        <View className="items-end gap-1">
          <View className="rounded-badge bg-hairline px-2 py-1">
            <Text className="font-sans-semibold text-badge text-slate">{reminder.type}</Text>
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

      <Text className="mt-3 font-sans text-body text-ink">{reminder.description}</Text>

      {!reminder.completed && (
        <View className="mt-[14px] flex-row gap-[10px]">
          <Pressable
            accessibilityRole="button"
            onPress={() => onComplete && onComplete(reminder.id)}
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
            className="items-center justify-center rounded-control bg-clinic px-[14px] py-2"
          >
            <Text className="font-sans-semibold text-title text-white">Concluído</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => onIgnore && onIgnore(reminder.id)}
            style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}
            className="items-center justify-center rounded-control border border-line-strong bg-card px-[14px] py-2"
          >
            <Text className="font-sans-medium text-xs text-ink">Ignorar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default ReminderCard;
