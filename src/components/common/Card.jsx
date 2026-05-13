import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../../styles/theme';

const Card = ({
  children,
  style,
  shadow = true,
  padding = true,
  ...props
}) => {
  const styles = StyleSheet.create({
    card: {
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
      ...(shadow && SHADOWS.md),
      ...(padding && { padding: SPACING.lg }),
    },
  });

  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

export default Card;
