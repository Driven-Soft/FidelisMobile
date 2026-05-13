import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { MOCK_VET_PATIENTS } from '../../data/fidelisData';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../../styles/theme';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import SectionHeader from '../../components/common/SectionHeader';
import Button from '../../components/common/Button';
import AvatarBadge from '../../components/common/AvatarBadge';
import Badge from '../../components/common/Badge';

const PatientsVet = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const filterOptions = ['Todos', 'Cão', 'Gato', 'Ave', 'Outros'];

  const filteredPatients = useMemo(() => {
    return MOCK_VET_PATIENTS.filter((patient) => {
      const query = searchText.toLowerCase();
      const matchesSearch =
        patient.petName.toLowerCase().includes(query) ||
        patient.tutorName.toLowerCase().includes(query);
      const matchesFilter = selectedFilter === 'Todos' || patient.petSpecies === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchText, selectedFilter]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    content: {
      paddingHorizontal: SPACING.lg,
    },
    filterContainer: {
      flexDirection: 'row',
      gap: SPACING.sm,
      marginBottom: SPACING.lg,
      marginTop: SPACING.lg,
      flexWrap: 'wrap',
    },
    filterButton: {
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      borderRadius: 20,
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.border,
    },
    filterButtonActive: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    filterText: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
      color: COLORS.textLight,
    },
    filterTextActive: {
      color: COLORS.white,
    },
    patientGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.md,
      paddingBottom: SPACING.xl,
    },
    patientCardContainer: {
      width: '48%',
    },
    patientCard: {
      ...SHADOWS.md,
      overflow: 'hidden',
    },
    patientInfo: {
      padding: SPACING.md,
    },
    petName: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text,
      marginBottom: SPACING.xs,
    },
    species: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.textLight,
      marginBottom: SPACING.xs,
    },
    breed: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.textLight,
      marginBottom: SPACING.sm,
    },
    tutorName: {
      fontSize: FONT_SIZES.xs,
      fontWeight: FONT_WEIGHTS.medium,
      color: COLORS.accent,
      marginBottom: SPACING.sm,
    },
    lastConsultation: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.textLight,
      marginBottom: SPACING.md,
    },
    avatarWrap: {
      alignItems: 'center',
      paddingTop: SPACING.md,
    },
    emptyContainer: {
      paddingVertical: SPACING.xxl,
      alignItems: 'center',
    },
    emptyText: {
      color: COLORS.textLight,
      fontSize: FONT_SIZES.base,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <SectionHeader title="Pacientes" subtitle="Busque, filtre e abra a ficha clínica rapidamente" />

          <Input
            placeholder="Buscar por nome ou tutor..."
            value={searchText}
            onChangeText={setSearchText}
            icon={<Text>🔍</Text>}
          />

          <View style={styles.filterContainer}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterButton,
                  selectedFilter === option && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedFilter(option)}
              >
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === option && styles.filterTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {filteredPatients.length > 0 ? (
            <View style={styles.patientGrid}>
              {filteredPatients.map((patient) => (
                <TouchableOpacity
                  key={patient.id}
                  style={styles.patientCardContainer}
                  onPress={() => navigation.navigate('PatientRecord', { patientId: patient.id })}
                >
                  <Card style={styles.patientCard} padding={false}>
                    <View style={styles.avatarWrap}>
                      <AvatarBadge emoji={patient.avatar} size={78} backgroundColor={patient.color} />
                    </View>
                    <View style={styles.patientInfo}>
                      <Text style={styles.petName}>{patient.petName}</Text>
                      <Text style={styles.species}>{patient.petSpecies}</Text>
                      <Text style={styles.breed}>{patient.breed}</Text>
                      <Text style={styles.tutorName}>{patient.tutorName}</Text>
                      <Text style={styles.lastConsultation}>Última: {patient.lastConsultation.toLocaleDateString('pt-BR')}</Text>
                      <Badge type="Retorno" label={patient.clinic} style={{ marginBottom: SPACING.md }} />
                      <Button title="Ver Ficha" variant="primary" size="sm" onPress={() => navigation.navigate('PatientRecord', { patientId: patient.id })} />
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum paciente encontrado</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PatientsVet;
