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
import { MOCK_TUTOR_PROFILE, MOCK_TUTOR_PETS, MOCK_TUTOR_REMINDERS, MOCK_TUTOR_HISTORY, formatPtDate, getPetAgeLabel } from '../../data/fidelisData';
import AvatarBadge from '../../components/common/AvatarBadge';
import Card from '../../components/common/Card';
import SectionHeader from '../../components/common/SectionHeader';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function HomeTutor({ navigation }) {
  const upcomingReminders = [...MOCK_TUTOR_REMINDERS]
    .sort((left, right) => left.dueDate - right.dueDate)
    .slice(0, 3);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.greeting}>Olá, {MOCK_TUTOR_PROFILE.name.split(' ')[0]}</Text>
          <Text style={styles.heroTitle}>Tudo sob controle para hoje</Text>
          <Text style={styles.heroText}>
            Acompanhe os pets, próximos cuidados e o histórico mais recente em um só lugar.
          </Text>
        </View>

        <SectionHeader title="Meus Pets" subtitle="Arraste para o lado ou toque para abrir o perfil" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.petCarousel}>
          {MOCK_TUTOR_PETS.map((pet) => (
            <TouchableOpacity key={pet.id} onPress={() => navigation.navigate('PetProfile', { petId: pet.id })} style={styles.petCardWrap}>
              <Card style={styles.petCard}>
                <AvatarBadge emoji={pet.avatar} size={74} backgroundColor={pet.color} style={{ marginBottom: SPACING.md }} />
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petMeta}>{pet.breed}</Text>
                <Text style={styles.petMeta}>{getPetAgeLabel(pet.birthDate)}</Text>
                <Badge type="Preventiva" label={pet.species} style={{ marginTop: SPACING.sm }} />
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <SectionHeader title="Próximos cuidados" subtitle="Vacinas, medicamentos e consultas que vêm aí" />
        <View style={{ gap: SPACING.md }}>
          {upcomingReminders.map((reminder) => (
            <TouchableOpacity key={reminder.id} onPress={() => navigation.navigate('RemindersTutorScreen')}>
              <Card style={styles.reminderCard}>
                <View style={styles.reminderHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                    <Text style={styles.reminderMeta}>{reminder.petName} • {formatPtDate(reminder.dueDate)}</Text>
                  </View>
                  <Badge type={reminder.type} label={reminder.type} />
                </View>
                <Text style={styles.reminderDesc}>{reminder.description}</Text>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader title="Histórico recente" subtitle="Os últimos eventos clínicos dos seus pets" />
        <View style={{ gap: SPACING.md }}>
          {MOCK_TUTOR_HISTORY.map((event) => (
            <Card key={event.id} style={styles.historyCard}>
              <View style={styles.reminderHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.historyTitle}>{event.title}</Text>
                  <Text style={styles.reminderMeta}>{event.petName} • {formatPtDate(event.date)}</Text>
                </View>
                <Badge type={event.type} label={event.type} />
              </View>
              <Text style={styles.reminderDesc}>{event.note}</Text>
            </Card>
          ))}
        </View>

        <View style={{ marginTop: SPACING.xl }}>
          <Button title="Ver todos os lembretes" variant="secondary" onPress={() => navigation.navigate('RemindersTutorScreen')} />
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
    color: 'rgba(255,255,255,0.78)',
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
  petCarousel: {
    paddingRight: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  petCardWrap: {
    width: 170,
  },
  petCard: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  petName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  petMeta: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: 2,
  },
  reminderCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  reminderTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  historyTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  reminderMeta: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    marginTop: 3,
  },
  reminderDesc: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
    lineHeight: 20,
  },
  historyCard: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
});