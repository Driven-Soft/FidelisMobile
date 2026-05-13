import React from 'react';
import { View, Text } from 'react-native';

const Badge = ({ type = 'default', label, icon, style, textStyle }) => {
  const getBadgeColor = () => {
    switch (type) {
      case 'VACINA':
        return { bg: 'bg-emerald-600', text: 'text-white' };
      case 'RETORNO':
        return { bg: 'bg-sky-600', text: 'text-white' };
      case 'MEDICAMENTO':
        return { bg: 'bg-amber-500', text: 'text-white' };
      case 'CHECKUP':
        return { bg: 'bg-sky-600', text: 'text-white' };
      case 'VERMÍFUGO':
        return { bg: 'bg-violet-600', text: 'text-white' };
      case 'CONSULTA':
        return { bg: 'bg-slate-900', text: 'text-white' };
      case 'PENDENTE':
        return { bg: 'bg-amber-100', text: 'text-amber-800' };
      case 'CONCLUÍDO':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
      case 'ATRASADO':
        return { bg: 'bg-red-100', text: 'text-red-600' };
      case 'Rotina':
        return { bg: 'bg-emerald-100', text: 'text-emerald-600' };
      case 'Retorno':
        return { bg: 'bg-sky-100', text: 'text-sky-600' };
      case 'Emergência':
        return { bg: 'bg-red-100', text: 'text-red-600' };
      case 'Preventiva':
        return { bg: 'bg-violet-100', text: 'text-violet-600' };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-700' };
    }
  };

  const colors = getBadgeColor();

  return (
    <View className={`self-start flex-row items-center rounded-full px-3 py-1 ${colors.bg}`} style={style}>
      {icon && icon}
      <Text className={`text-xs font-semibold ${colors.text}`} style={textStyle}>
        {label}
      </Text>
    </View>
  );
};

export default Badge;
