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
import { MOCK_VET_PROFILE, MOCK_VET_PATIENTS, MOCK_VET_APPOINTMENTS, MOCK_VET_ALERTS, formatPtDate } from '../../data/fidelisData';
import Card from '../../components/common/Card';
import SectionHeader from '../../components/common/SectionHeader';
import Badge from '../../components/common/Badge';
import AvatarBadge from '../../components/common/AvatarBadge';
import Button from '../../components/common/Button';

export default function HomeVet({ navigation }) {
  const stats = [
    { label: 'Pets ativos', value: MOCK_VET_PATIENTS.length, tone: COLORS.primary },
    { label: 'Consultas hoje', value: MOCK_VET_APPOINTMENTS.length, tone: COLORS.accent },
    { label: 'Alertas pendentes', value: MOCK_VET_ALERTS.length, tone: COLORS.danger },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.greeting}>Olá, {MOCK_VET_PROFILE.name}</Text>
          <Text style={styles.heroTitle}>Agenda e pacientes em um só painel</Text>
          <Text style={styles.heroText}>
            Revise os atendimentos do dia, acompanhe os alertas urgentes e abra a ficha clínica com um toque.
          </Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <Card key={stat.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: stat.tone }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        <SectionHeader title="Agenda do dia" subtitle="Consultas agendadas para hoje" action={<Text onPress={() => navigation.navigate('AgendaVet')} style={styles.actionLink}>Ver tudo</Text>} />
        <View style={{ gap: SPACING.md }}>
          {MOCK_VET_APPOINTMENTS.map((appointment) => (
            <TouchableOpacity key={appointment.id} onPress={() => navigation.navigate('PatientRecord', { patientId: appointment.petId })}>
              <Card style={styles.appointmentCard}>
                <View style={styles.rowTop}>
                  <View>
                    <Text style={styles.time}>{appointment.time}</Text>
                    <Text style={styles.appointmentTitle}>{appointment.petName}</Text>
                  </View>
                  <Badge type={appointment.consultationType} label={appointment.consultationType} />
                </View>
                <Text style={styles.appointmentMeta}>{appointment.tutorName} • {appointment.petSpecies}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader title="Alertas urgentes" subtitle="Vacinas atrasadas e retornos pendentes" />
        <View style={{ gap: SPACING.md }}>
          {MOCK_VET_ALERTS.map((alert) => (
            <TouchableOpacity key={alert.id} onPress={() => navigation.navigate('PatientRecord', { patientId: alert.petId })}>
              <Card style={styles.alertCard}>
                <View style={styles.rowTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.appointmentTitle}>{alert.petName}</Text>
                    <Text style={styles.appointmentMeta}>{alert.tutorName}</Text>
                  </View>
                  <Badge type={alert.alertType} label={alert.alertType} />
                </View>
                <Text style={styles.alertText}>{alert.description}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footerActions}>
          <Button title="Abrir agenda completa" variant="secondary" onPress={() => navigation.navigate('AgendaVet')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
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
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.primary,
    ...SHADOWS.md,
  },
  greeting: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    marginBottom: SPACING.sm,
  },
  heroText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
  },
  statLabel: {
    textAlign: 'center',
    color: COLORS.textLight,
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
  actionLink: {
    color: COLORS.accent,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.md,
  },
  time: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  appointmentTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginTop: 2,
  },
  appointmentMeta: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  alertCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.danger,
  },
  alertText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
  },
  appointmentCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  footerActions: {
    marginTop: SPACING.xl,
  },
});