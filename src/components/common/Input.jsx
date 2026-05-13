import React from 'react';
import { TextInput, View, Text, TouchableOpacity } from 'react-native';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  icon,
  type = 'text',
  editable = true,
  onRightIconPress,
  rightIcon,
  style,
  ...props
}) => {
  return (
    <View className="mb-4" style={style}>
      {label && <Text className="mb-2 text-sm font-semibold text-slate-900">{label}</Text>}
      <View className={`flex-row items-center rounded-2xl border-2 bg-white px-4 py-3 ${error ? 'border-red-500' : 'border-slate-200'}`}>
        {icon && <View className="mr-3">{icon}</View>}
        <TextInput
          className="flex-1 text-base text-slate-900"
          placeholder={placeholder}
          placeholderTextColor="#64748b"
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          secureTextEntry={type === 'password'}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity className="ml-3" onPress={onRightIconPress}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}
    </View>
  );
};

export default Input;
