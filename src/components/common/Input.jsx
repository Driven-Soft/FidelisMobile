import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../../styles/theme';

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
  const styles = StyleSheet.create({
    container: {
      marginBottom: SPACING.lg,
    },
    label: {
      color: COLORS.text,
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.semibold,
      marginBottom: SPACING.sm,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.white,
      borderWidth: 2,
      borderColor: error ? COLORS.danger : COLORS.border,
      borderRadius: BORDER_RADIUS.md,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.md,
    },
    input: {
      flex: 1,
      color: COLORS.text,
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.regular,
    },
    icon: {
      marginRight: SPACING.md,
    },
    rightIcon: {
      marginLeft: SPACING.md,
    },
    error: {
      color: COLORS.danger,
      fontSize: FONT_SIZES.xs,
      marginTop: SPACING.xs,
      fontWeight: FONT_WEIGHTS.regular,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          secureTextEntry={type === 'password'}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default Input;
