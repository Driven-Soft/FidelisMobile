import React from 'react';
import { View, Text } from 'react-native';

const SectionHeader = ({ title, subtitle, action, style }) => {
  return (
    <View className="mb-4 mt-4" style={style}>
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold text-slate-900">{title}</Text>
        {action && action}
      </View>
      {subtitle && <Text className="mt-1 text-sm text-slate-500">{subtitle}</Text>}
    </View>
  );
};

export default SectionHeader;
