import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

const Button = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  const sizeClasses = size === 'sm' ? 'py-3' : 'py-4';
  const variantClasses = {
    primary: 'bg-slate-900 border border-slate-900',
    secondary: 'bg-cyan-600 border border-cyan-600',
    outline: 'bg-white border-2 border-slate-900',
    danger: 'bg-red-500 border border-red-500',
  };

  const textClasses = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-slate-900',
    danger: 'text-white',
  };

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center rounded-2xl px-4 shadow-sm ${sizeClasses} ${variantClasses[variant]}`}
      style={[disabled && { opacity: 0.5 }, style]}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? '#0f172a' : '#ffffff'}
          size="small"
        />
      ) : (
        <Text className={`text-base font-semibold ${textClasses[variant]}`} style={textStyle}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
