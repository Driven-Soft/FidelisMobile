import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MOCK_VET_PATIENTS, MOCK_VET_PATIENT_RECORDS } from '../../data/fidelisData';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../../styles/theme';
import Card from '../../components/common/Card';
import SectionHeader from '../../components/common/SectionHeader';
import Button from '../../components/common/Button';
import AvatarBadge from '../../components/common/AvatarBadge';
import Badge from '../../components/common/Badge';

const PatientRecord = ({ route, navigation }) => {
  const { patientId } = route.params;
  const patient = MOCK_VET_PATIENTS.find((p) => p.id === patientId);
  const record = MOCK_VET_PATIENT_RECORDS[patientId] || MOCK_VET_PATIENT_RECORDS['1'];
  const [activeTab, setActiveTab] = useState('Consultas');
  const [expandedId, setExpandedId] = useState(null);

  const tabs = ['Consultas', 'Vacinas', 'Prescrições', 'Exames', 'Bem-estar'];

  const tabData = {
    Consultas: record.consultations,
    Vacinas: record.vaccinations,
    Prescrições: record.prescriptions,
    Exames: record.exams,
    'Bem-estar': record.wellness,
  };

  const currentItems = tabData[activeTab] || [];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },
    content: {
      paddingHorizontal: SPACING.lg,
      paddingBottom: SPACING.xl,
    },
    hero: {
      borderRadius: BORDER_RADIUS.xl,
      padding: SPACING.xl,
      marginTop: SPACING.lg,
      marginBottom: SPACING.lg,
      overflow: 'hidden',
      ...SHADOWS.md,
    },
    petName: {
      fontSize: FONT_SIZES.xxxl,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.white,
      marginBottom: SPACING.xs,
    },
    petInfo: {
      fontSize: FONT_SIZES.sm,
      color: 'rgba(255,255,255,0.9)',
      marginBottom: SPACING.xs,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.md,
    },
    backButton: {
      alignSelf: 'flex-start',
      marginBottom: SPACING.sm,
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
    tutorCard: {
      marginBottom: SPACING.lg,
    },
    tutorTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: SPACING.md,
      marginBottom: SPACING.md,
    },
    tutorLabel: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.textLight,
      fontWeight: FONT_WEIGHTS.regular,
      marginBottom: SPACING.sm,
    },
    tutorName: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text,
      marginBottom: SPACING.sm,
    },
    contactInfo: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.textLight,
      marginBottom: SPACING.xs,
    },
    contactRow: {
      flexDirection: 'row',
      gap: SPACING.sm,
      marginTop: SPACING.md,
    },
    tabsContainer: {
      flexDirection: 'row',
      gap: SPACING.sm,
      marginBottom: SPACING.lg,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
    },
    tab: {
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.md,
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: COLORS.primary,
    },
    tabText: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
      color: COLORS.textLight,
    },
    activeTabText: {
      color: COLORS.primary,
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
    actionButton: {
      marginBottom: SPACING.lg,
    },
    timelineCard: {
      marginBottom: SPACING.md,
    },
    timelineDate: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.textLight,
      marginBottom: SPACING.xs,
    },
    timelineTitle: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.bold,
      color: COLORS.text,
    },
    timelineNotes: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textLight,
      marginTop: SPACING.sm,
      lineHeight: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={{ color: COLORS.accent, fontWeight: FONT_WEIGHTS.semibold }}>← Voltar</Text>
          </TouchableOpacity>

          <LinearGradient
            colors={['#1E6FAE', '#163A6F']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.topRow}>
              <AvatarBadge emoji={patient.avatar} size={92} backgroundColor={patient.color} />
              <View style={{ flex: 1 }}>
                <Text style={styles.petName}>{patient.petName}</Text>
                <Text style={styles.petInfo}>{record.species} • {record.breed}</Text>
                <Text style={styles.petInfo}>{record.sex} • {record.age} • {record.weight}</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.infoGrid}>
            <Card style={styles.infoCard} padding={true}>
              <Text style={styles.infoLabel}>Espécie</Text>
              <Text style={styles.infoValue}>{record.species}</Text>
            </Card>
            <Card style={styles.infoCard} padding={true}>
              <Text style={styles.infoLabel}>Raça</Text>
              <Text style={styles.infoValue}>{record.breed}</Text>
            </Card>
            <Card style={styles.infoCard} padding={true}>
              <Text style={styles.infoLabel}>Sexo</Text>
              <Text style={styles.infoValue}>{record.sex}</Text>
            </Card>
            <Card style={styles.infoCard} padding={true}>
              <Text style={styles.infoLabel}>Idade</Text>
              <Text style={styles.infoValue}>{record.age}</Text>
            </Card>
          </View>

          <Card style={styles.tutorCard}>
            <View style={styles.tutorTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.tutorLabel}>Tutor</Text>
                <Text style={styles.tutorName}>{record.tutorName}</Text>
                <Text style={styles.contactInfo}>Última consulta: {patient.lastConsultation.toLocaleDateString('pt-BR')}</Text>
                <Text style={styles.contactInfo}>{record.clinic}</Text>
              </View>
              <Badge type="Preventiva" label="Paciente ativo" />
            </View>
            <View style={styles.contactRow}>
              <Button title="Ligar" variant="outline" size="sm" style={{ flex: 1 }} onPress={() => {}} />
              <Button title="Email" variant="outline" size="sm" style={{ flex: 1 }} onPress={() => {}} />
            </View>
          </Card>

          <View style={styles.actionButton}>
            <Button
              title="+ Nova Consulta"
              variant="primary"
              onPress={() => navigation.navigate('NewConsultation', { patientId })}
            />
          </View>

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
            {currentItems.length > 0 ? currentItems.map((item) => {
              const expanded = expandedId === item.id;
              return (
                <TouchableOpacity key={item.id} onPress={() => setExpandedId(expanded ? null : item.id)}>
                  <Card style={styles.timelineCard}>
                    <Text style={styles.timelineDate}>{item.date.toLocaleDateString('pt-BR')}</Text>
                    <Text style={styles.timelineTitle}>{item.title}</Text>
                    <Text style={styles.timelineNotes} numberOfLines={expanded ? undefined : 2}>
                      {item.observations}
                    </Text>
                    <Text style={{ marginTop: SPACING.sm, color: COLORS.accent, fontWeight: FONT_WEIGHTS.semibold }}>
                      {expanded ? 'Recolher detalhes' : 'Expandir detalhes'}
                    </Text>
                  </Card>
                </TouchableOpacity>
              );
            }) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Nenhum registro em {activeTab}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PatientRecord;
