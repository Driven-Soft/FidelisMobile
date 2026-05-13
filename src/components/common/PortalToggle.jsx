import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

const PortalToggle = ({ selected, onToggle }) => {
  return (
    <View className="mb-6 flex-row rounded-full bg-slate-100 p-1.5">
      <TouchableOpacity
        className={`flex-1 items-center rounded-full py-3 ${selected === 'TUTOR' ? 'bg-cyan-600' : 'bg-transparent'}`}
        onPress={() => onToggle('TUTOR')}
      >
        <Text className={`text-sm font-semibold ${selected === 'TUTOR' ? 'text-white' : 'text-slate-500'}`}>
          🐾 Tutor
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 items-center rounded-full py-3 ${selected === 'VET' ? 'bg-slate-900' : 'bg-transparent'}`}
        onPress={() => onToggle('VET')}
      >
        <Text className={`text-sm font-semibold ${selected === 'VET' ? 'text-white' : 'text-slate-500'}`}>
          👨‍⚕️ Veterinário
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PortalToggle;
