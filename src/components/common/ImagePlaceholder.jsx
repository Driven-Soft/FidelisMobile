import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, BORDER_RADIUS } from '../../styles/theme';

const ImagePlaceholder = ({ size = 'md', emoji = '🐾', style }) => {
  const sizes = {
    sm: 80,
    md: 120,
    lg: 200,
    xl: 250,
  };

  const styles = StyleSheet.create({
    container: {
      width: sizes[size],
      height: sizes[size],
      borderRadius: BORDER_RADIUS.lg,
      backgroundColor: COLORS.lightGray,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: COLORS.border,
      borderStyle: 'dashed',
    },
    emoji: {
      fontSize: sizes[size] / 2,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
  );
};

export default ImagePlaceholder;
