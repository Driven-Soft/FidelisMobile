import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../../styles/theme';
import { MOCK_TUTOR_PETS, getPetAgeLabel } from '../../data/fidelisData';
import Card from '../../components/common/Card';
import SectionHeader from '../../components/common/SectionHeader';
import AvatarBadge from '../../components/common/AvatarBadge';
import Button from '../../components/common/Button';

const PetsTutor = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl }}>
        <SectionHeader
          title="Meus Pets"
          subtitle="Gerencie os perfis, consultas e cuidados dos seus animais"
        />

        <TouchableOpacity onPress={() => navigation.navigate('NewPet')} style={styles.addCard}>
          <Text style={styles.addPlus}>＋</Text>
          <Text style={styles.addTitle}>Adicionar novo pet</Text>
          <Text style={styles.addSubtitle}>Cadastro em 3 etapas com dados básicos, físicos e observações.</Text>
        </TouchableOpacity>

        <View style={{ gap: SPACING.md, marginTop: SPACING.md }}>
          {MOCK_TUTOR_PETS.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              onPress={() => navigation.navigate('PetProfile', { petId: pet.id })}
            >
              <Card style={styles.petCard}>
                <View style={styles.row}>
                  <AvatarBadge
                    emoji={pet.avatar}
                    size={72}
                    backgroundColor={pet.color}
                    style={{ marginRight: SPACING.md }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.petMeta}>{pet.breed}</Text>
                    <Text style={styles.petMeta}>{getPetAgeLabel(pet.birthDate)} • {pet.sex}</Text>
                    <Text style={styles.clinic}>{pet.clinic}</Text>
                  </View>
                </View>
                <Button title="Abrir perfil" variant="outline" size="sm" style={{ marginTop: SPACING.md }} onPress={() => navigation.navigate('PetProfile', { petId: pet.id })} />
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  addCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.accent,
    backgroundColor: '#F7FCFD',
    marginBottom: SPACING.md,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  addPlus: {
    fontSize: 30,
    color: COLORS.accent,
    fontWeight: FONT_WEIGHTS.bold,
  },
  addTitle: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  addSubtitle: {
    marginTop: SPACING.xs,
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  petCard: {
    padding: SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  petName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  petMeta: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  clinic: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.accent,
    marginTop: SPACING.xs,
    fontWeight: FONT_WEIGHTS.semibold,
  },
});

export default PetsTutor;
