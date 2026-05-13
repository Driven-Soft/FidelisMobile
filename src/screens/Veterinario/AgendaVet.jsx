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
import { MOCK_VET_APPOINTMENTS } from '../../data/fidelisData';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import SectionHeader from '../../components/common/SectionHeader';

export default function AgendaVet({ navigation }) {
  const todayLabel = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <SectionHeader
          title="Agenda"
          subtitle={`Consultas de ${todayLabel}`}
          action={<Button title="Nova" variant="primary" size="sm" onPress={() => navigation.navigate('NewConsultation')} />}
        />

        <View style={{ gap: SPACING.md }}>
          {MOCK_VET_APPOINTMENTS.map((appointment) => (
            <TouchableOpacity
              key={appointment.id}
              onPress={() => navigation.navigate('PatientRecord', { patientId: appointment.petId })}
            >
              <Card style={styles.card}>
                <View style={styles.row}>
                  <View>
                    <Text style={styles.time}>{appointment.time}</Text>
                    <Text style={styles.title}>{appointment.petName}</Text>
                  </View>
                  <Badge type={appointment.consultationType} label={appointment.consultationType} />
                </View>
                <Text style={styles.meta}>{appointment.tutorName}</Text>
                <Text style={styles.meta}>{appointment.petSpecies}</Text>
              </Card>
            </TouchableOpacity>
          ))}
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
  card: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    ...SHADOWS.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SPACING.md,
  },
  time: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  title: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginTop: SPACING.xs,
  },
  meta: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
});
