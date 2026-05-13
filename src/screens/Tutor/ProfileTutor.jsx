import React, { useContext } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { UserContext } from '../../context/UserContext';
import { MOCK_TUTOR_PROFILE, MOCK_TUTOR_PETS } from '../../data/fidelisData';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../../styles/theme';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import SectionHeader from '../../components/common/SectionHeader';
import AvatarBadge from '../../components/common/AvatarBadge';

const ProfileTutor = ({ navigation }) => {
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
    email: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textLight,
    },
    section: {
      marginBottom: SPACING.lg,
    },
    statCard: {
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
      marginBottom: SPACING.sm,
    },
    petCount: {
      fontSize: FONT_SIZES.lg,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.accent,
    },
    buttonContainer: {
      gap: SPACING.md,
      marginBottom: SPACING.lg,
      marginTop: SPACING.lg,
      paddingBottom: SPACING.xl,
    },
    summaryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: SPACING.md,
    },
    summaryValue: {
      fontSize: FONT_SIZES.xl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.accent,
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
            <AvatarBadge initials={MOCK_TUTOR_PROFILE.initials} size={120} backgroundColor={MOCK_TUTOR_PROFILE.avatarColor} style={{ marginBottom: SPACING.lg }} />
            <Text style={styles.name}>{MOCK_TUTOR_PROFILE.name}</Text>
            <Text style={styles.email}>{MOCK_TUTOR_PROFILE.email}</Text>
          </View>

          <SectionHeader title="Informações Pessoais" />
          <Card style={styles.section}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{MOCK_TUTOR_PROFILE.email}</Text>

            <Text style={styles.infoLabel}>Telefone</Text>
            <Text style={styles.infoValue}>{MOCK_TUTOR_PROFILE.phone}</Text>

            <Text style={styles.infoLabel}>CPF</Text>
            <Text style={styles.infoValue}>{MOCK_TUTOR_PROFILE.cpf}</Text>
          </Card>

          <SectionHeader title="Resumo" />
          <View style={styles.summaryGrid}>
            <Card style={styles.statCard}>
              <Text style={styles.infoLabel}>Pets cadastrados</Text>
              <Text style={styles.summaryValue}>{MOCK_TUTOR_PETS.length}</Text>
            </Card>
            <Card style={styles.statCard}>
              <Text style={styles.infoLabel}>Clínica vinculada</Text>
              <Text style={styles.infoValue}>{MOCK_TUTOR_PROFILE.clinic}</Text>
            </Card>
          </View>

          <SectionHeader title="Clínica Vinculada" />
          <Card style={styles.section}>
            <Text style={styles.infoLabel}>Clínica</Text>
            <Text style={styles.infoValue}>{MOCK_TUTOR_PROFILE.clinic}</Text>
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

export default ProfileTutor;
