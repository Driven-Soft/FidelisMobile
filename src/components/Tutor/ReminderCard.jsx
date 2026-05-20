import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Badge from '../common/Badge';

const ReminderCard = ({ reminder, onComplete, onIgnore, horizontal = false }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'VACINA':
        return '💉';
      case 'RETORNO':
        return '🔄';
      case 'MEDICAMENTO':
        return '💊';
      case 'CHECKUP':
        return '🩺';
      case 'VERMÍFUGO':
        return '🪱';
      default:
        return '📋';
    }
  };

  const daysUntilDue = Math.ceil((reminder.dueDate - new Date()) / (1000 * 60 * 60 * 24));
  const status = reminder.completed ? 'CONCLUÍDO' : daysUntilDue < 0 ? 'ATRASADO' : 'PENDENTE';

  return (
    <View className={`mb-4 rounded-2xl bg-white p-4 shadow-sm ${horizontal ? 'mr-4 min-w-[280px]' : ''}`}>
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center space-x-4">
          <View className="h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: reminder.petColor || '#EEE' }}>
            <Text className="text-lg">{reminder.petAvatar || '🐾'}</Text>
          </View>
          <View className="flex-1">
            <View className="mb-1 flex-row items-center space-x-2">
              <Text className="text-base font-semibold text-slate-900">{reminder.petName}</Text>
              <Text className="text-xs text-slate-500">{new Date(reminder.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')}</Text>
            </View>
            <Text className="text-sm font-semibold text-slate-900">{reminder.description}</Text>
          </View>
        </View>
        <Text className="text-2xl">{getTypeIcon(reminder.type)}</Text>
      </View>

      <View className="flex-row items-center justify-between gap-4">
        <View />
        <View className="items-end space-y-2">
          <Badge type={reminder.type} label={reminder.type} />
          <Badge type={status} label={status} />
        </View>
      </View>

      {!reminder.completed && (
        <View className="mt-4 flex-row space-x-3">
          <TouchableOpacity className="items-center justify-center rounded-2xl bg-cyan-600 px-4 py-2" onPress={() => onComplete && onComplete(reminder.id)}>
            <Text className="font-semibold text-white">✓ Concluído</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2"
            onPress={() => {
              if (typeof onIgnore === 'function') return onIgnore(reminder.id);
            }}
          >
            <Text className="font-semibold text-slate-900">✕ Ignorar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ReminderCard;
