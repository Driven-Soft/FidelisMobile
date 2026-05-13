import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../../styles/theme';

const SectionHeader = ({ title, subtitle, action, style }) => {
  const styles = StyleSheet.create({
    container: {
      marginBottom: SPACING.lg,
      marginTop: SPACING.lg,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text,
    },
    subtitle: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textLight,
      fontWeight: FONT_WEIGHTS.regular,
      marginTop: SPACING.xs,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {action && action}
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

export default SectionHeader;
