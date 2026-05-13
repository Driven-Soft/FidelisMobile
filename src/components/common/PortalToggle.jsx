import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../../styles/theme';

const PortalToggle = ({ selected, onToggle }) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: COLORS.lightGray,
      borderRadius: BORDER_RADIUS.full,
      padding: SPACING.sm,
      gap: SPACING.sm,
      marginBottom: SPACING.xl,
    },
    button: {
      flex: 1,
      paddingVertical: SPACING.md,
      borderRadius: BORDER_RADIUS.full,
      alignItems: 'center',
    },
    active: {
      backgroundColor: selected === 'TUTOR' ? COLORS.accent : COLORS.primary,
    },
    inactive: {
      backgroundColor: 'transparent',
    },
    text: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.semibold,
    },
    activeText: {
      color: COLORS.white,
    },
    inactiveText: {
      color: COLORS.textLight,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          selected === 'TUTOR' ? styles.active : styles.inactive,
        ]}
        onPress={() => onToggle('TUTOR')}
      >
        <Text
          style={[
            styles.text,
            selected === 'TUTOR' ? styles.activeText : styles.inactiveText,
          ]}
        >
          🐾 Tutor
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          selected === 'VET' ? styles.active : styles.inactive,
        ]}
        onPress={() => onToggle('VET')}
      >
        <Text
          style={[
            styles.text,
            selected === 'VET' ? styles.activeText : styles.inactiveText,
          ]}
        >
          👨‍⚕️ Veterinário
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PortalToggle;
