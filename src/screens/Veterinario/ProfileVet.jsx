import React, { useContext } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
} from 'react-native';
import { UserContext } from '../../context/UserContext';
import { MOCK_VET_PROFILE } from '../../data/fidelisData';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../../styles/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SectionHeader from '../../components/common/SectionHeader';
import AvatarBadge from '../../components/common/AvatarBadge';

const ProfileVet = ({ navigation }) => {
  const { logout } = useContext(UserContext);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    content: {
      paddingHorizontal: SPACING.lg,
    },
    profileHeader: {
      alignItems: 'center',
      marginTop: SPACING.xl,
      marginBottom: SPACING.xl,
    },
    name: {
      fontSize: FONT_SIZES.xxl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text,
      marginBottom: SPACING.sm,
    },
    specialty: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textLight,
    },
    section: {
      marginBottom: SPACING.lg,
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
      marginBottom: SPACING.md,
    },
    clinicName: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.accent,
      marginBottom: SPACING.sm,
    },
    clinicAddress: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textLight,
    },
    clinicCard: {
      borderLeftWidth: 4,
      borderLeftColor: COLORS.primary,
    },
    buttonContainer: {
      gap: SPACING.md,
      marginBottom: SPACING.lg,
      marginTop: SPACING.lg,
      paddingBottom: SPACING.xl,
    },
  });

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.profileHeader}>
            <AvatarBadge initials={MOCK_VET_PROFILE.initials} size={120} backgroundColor={MOCK_VET_PROFILE.avatarColor} style={{ marginBottom: SPACING.lg }} />
            <Text style={styles.name}>{MOCK_VET_PROFILE.name}</Text>
            <Text style={styles.specialty}>{MOCK_VET_PROFILE.specialty}</Text>
          </View>

          <SectionHeader title="Informações Profissionais" />
          <Card style={styles.section}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{MOCK_VET_PROFILE.email}</Text>

            <Text style={styles.infoLabel}>Telefone</Text>
            <Text style={styles.infoValue}>{MOCK_VET_PROFILE.phone}</Text>

            <Text style={styles.infoLabel}>CRMV</Text>
            <Text style={styles.infoValue}>{MOCK_VET_PROFILE.crmv}</Text>

            <Text style={styles.infoLabel}>Especialidade</Text>
            <Text style={styles.infoValue}>{MOCK_VET_PROFILE.specialty}</Text>
          </Card>

          <SectionHeader title="Clínica Vinculada" />
          <Card style={[styles.section, styles.clinicCard]}>
            <Text style={styles.clinicName}>{MOCK_VET_PROFILE.clinic.name}</Text>
            <Text style={styles.clinicAddress}>{MOCK_VET_PROFILE.clinic.address}</Text>
          </Card>

          <View style={styles.buttonContainer}>
            <Button
              title="Editar Perfil"
              variant="primary"
              onPress={() => {}}
            />
            <Button
              title="Sair"
              variant="danger"
              onPress={handleLogout}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileVet;
