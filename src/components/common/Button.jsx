import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../../styles/theme';

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
  const styles = StyleSheet.create({
    base: {
      borderRadius: BORDER_RADIUS.lg,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      ...SHADOWS.sm,
    },
    primary: {
      backgroundColor: COLORS.primary,
      paddingVertical: size === 'sm' ? SPACING.md : SPACING.lg,
      paddingHorizontal: SPACING.lg,
    },
    secondary: {
      backgroundColor: COLORS.accent,
      paddingVertical: size === 'sm' ? SPACING.md : SPACING.lg,
      paddingHorizontal: SPACING.lg,
    },
    outline: {
      backgroundColor: COLORS.white,
      borderWidth: 2,
      borderColor: COLORS.primary,
      paddingVertical: size === 'sm' ? SPACING.md : SPACING.lg,
      paddingHorizontal: SPACING.lg,
    },
    danger: {
      backgroundColor: COLORS.danger,
      paddingVertical: size === 'sm' ? SPACING.md : SPACING.lg,
      paddingHorizontal: SPACING.lg,
    },
    text: {
      primary: {
        color: COLORS.white,
        fontSize: size === 'sm' ? FONT_SIZES.sm : FONT_SIZES.base,
        fontWeight: FONT_WEIGHTS.semibold,
      },
      secondary: {
        color: COLORS.white,
        fontSize: size === 'sm' ? FONT_SIZES.sm : FONT_SIZES.base,
        fontWeight: FONT_WEIGHTS.semibold,
      },
      outline: {
        color: COLORS.primary,
        fontSize: size === 'sm' ? FONT_SIZES.sm : FONT_SIZES.base,
        fontWeight: FONT_WEIGHTS.semibold,
      },
      danger: {
        color: COLORS.white,
        fontSize: size === 'sm' ? FONT_SIZES.sm : FONT_SIZES.base,
        fontWeight: FONT_WEIGHTS.semibold,
      },
    },
  });

  const containerStyle = [
    styles.base,
    styles[variant],
    disabled && { opacity: 0.5 },
    style,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? COLORS.primary : COLORS.white}
          size="small"
        />
      ) : (
        <Text style={[styles.text[variant], textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
