import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { MOCK_PETS } from '../../data/mockData';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../../styles/theme';
import Card from '../../components/common/Card';
import SectionHeader from '../../components/common/SectionHeader';

const PetProfile = ({ route, navigation }) => {
  const { petId } = route.params;
  const pet = MOCK_PETS.find((p) => p.id === petId);
  const [activeTab, setActiveTab] = useState('Vacinas');

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const tabs = ['Vacinas', 'Consultas', 'Medicamentos', 'Bem-estar'];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    content: {
      paddingHorizontal: SPACING.lg,
    },
    headerImage: {
      width: '100%',
      height: 250,
      borderRadius: BORDER_RADIUS.lg,
      marginBottom: SPACING.lg,
      ...SHADOWS.md,
    },
    petName: {
      fontSize: FONT_SIZES.xxxl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text,
      marginBottom: SPACING.md,
    },
    infoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.md,
      marginBottom: SPACING.lg,
    },
    infoCard: {
      flex: 1,
      minWidth: '48%',
    },
    infoLabel: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.textLight,
      fontWeight: FONT_WEIGHTS.regular,
      marginBottom: SPACING.xs,
    },
    infoValue: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text,
    },
    tabsContainer: {
      flexDirection: 'row',
      gap: SPACING.sm,
      marginBottom: SPACING.lg,
      borderBottomWidth: 2,
      borderBottomColor: COLORS.border,
    },
    tab: {
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.md,
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: COLORS.accent,
    },
    tabText: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
      color: COLORS.textLight,
    },
    activeTabText: {
      color: COLORS.accent,
      fontWeight: FONT_WEIGHTS.semibold,
    },
    contentContainer: {
      paddingBottom: SPACING.xl,
    },
    emptyState: {
      padding: SPACING.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      color: COLORS.textLight,
      fontSize: FONT_SIZES.sm,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Image
            source={pet.profileImage}
            style={styles.headerImage}
            defaultSource={require('../../../assets/icon.png')}
          />

          <Text style={styles.petName}>{pet.name}</Text>

          <View style={styles.infoGrid}>
            <Card style={styles.infoCard} padding={true}>
              <Text style={styles.infoLabel}>Espécie</Text>
              <Text style={styles.infoValue}>{pet.species}</Text>
            </Card>
            <Card style={styles.infoCard} padding={true}>
              <Text style={styles.infoLabel}>Raça</Text>
              <Text style={styles.infoValue}>{pet.breed}</Text>
            </Card>
            <Card style={styles.infoCard} padding={true}>
              <Text style={styles.infoLabel}>Sexo</Text>
              <Text style={styles.infoValue}>{pet.sex}</Text>
            </Card>
            <Card style={styles.infoCard} padding={true}>
              <Text style={styles.infoLabel}>Idade</Text>
              <Text style={styles.infoValue}>{calculateAge(pet.birthDate)} anos</Text>
            </Card>
          </View>

          <Card>
            <Text style={styles.infoLabel}>Clínica Vinculada</Text>
            <Text style={styles.infoValue}>{pet.clinicAssociated}</Text>
          </Card>

          <View style={styles.tabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                Nenhum registro em {activeTab}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PetProfile;
