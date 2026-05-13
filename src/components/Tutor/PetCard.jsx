import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../../styles/theme';

const PetCard = ({ pet, onPress, isAddPetCard = false }) => {
  const styles = StyleSheet.create({
    card: {
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      marginRight: SPACING.md,
      width: 140,
      alignItems: 'center',
      ...SHADOWS.sm,
    },
    addCard: {
      backgroundColor: COLORS.lightGray,
      borderStyle: 'dashed',
      borderWidth: 2,
      borderColor: COLORS.accent,
      justifyContent: 'center',
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING.md,
      backgroundColor: COLORS.lightGray,
    },
    name: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text,
      textAlign: 'center',
      marginBottom: SPACING.xs,
    },
    breed: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.textLight,
      textAlign: 'center',
    },
    addIcon: {
      fontSize: 32,
      marginBottom: SPACING.md,
    },
    addText: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.accent,
      textAlign: 'center',
    },
  });

  if (isAddPetCard) {
    return (
      <TouchableOpacity style={[styles.card, styles.addCard]} onPress={onPress}>
        <Text style={styles.addIcon}>➕</Text>
        <Text style={styles.addText}>Adicionar{'\n'}pet</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={pet.profileImage}
        style={styles.image}
                    defaultSource={require('../../../assets/icon.png')}
      />
      <Text style={styles.name}>{pet.name}</Text>
      <Text style={styles.breed}>{pet.species}</Text>
    </TouchableOpacity>
  );
};

export default PetCard;
