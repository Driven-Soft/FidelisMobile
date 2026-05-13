import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../../styles/theme';

const AvatarBadge = ({ emoji, initials, size = 72, backgroundColor = COLORS.lightGray, textColor = COLORS.text, style }) => {
  const styles = StyleSheet.create({
    avatar: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    emoji: {
      fontSize: size * 0.42,
    },
    initials: {
      fontSize: size * 0.28,
      fontWeight: FONT_WEIGHTS.bold,
      color: textColor,
    },
  });

  return (
    <View style={[styles.avatar, style]}>
      {emoji ? <Text style={styles.emoji}>{emoji}</Text> : <Text style={styles.initials}>{initials}</Text>}
    </View>
  );
};

export default AvatarBadge;
