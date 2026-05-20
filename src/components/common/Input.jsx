import React from "react";
import { TextInput, View, Text, TouchableOpacity } from "react-native";
import MaskInput from "react-native-mask-input";

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  isValid,
  icon,
  type = "text",
  editable = true,
  onRightIconPress,
  rightIcon,
  style,
  mask,
  ...props
}) => {
  const Component = mask ? MaskInput : TextInput;

  let borderClass = "border-slate-200";
  if (error) {
    borderClass = "border-red-500";
  } else if (isValid) {
    borderClass = "border-emerald-500";
  }

  return (
    <View className="mb-4" style={style}>
      {label && (
        <Text className="mb-2 text-sm font-semibold text-slate-900">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center rounded-2xl border-2 bg-white px-4 py-3 ${borderClass}`}
      >
        {icon && <View className="mr-3">{icon}</View>}
        <Component
          className="flex-1 text-base text-slate-900"
          placeholder={placeholder}
          placeholderTextColor="#64748b"
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          secureTextEntry={type === "password"}
          mask={mask}
          {...props}
        />
        {rightIcon ? (
          <TouchableOpacity className="ml-3" onPress={onRightIconPress}>
            {rightIcon}
          </TouchableOpacity>
        ) : (
          <>
            {error ? (
              <Text className="ml-2 text-base text-red-500">⚠️</Text>
            ) : isValid ? (
              <Text className="ml-2 text-base text-emerald-500">✓</Text>
            ) : null}
          </>
        )}
      </View>
      {error && <Text className="mt-1 text-xs text-red-500">{error}</Text>}
    </View>
  );
};

export default Input;
