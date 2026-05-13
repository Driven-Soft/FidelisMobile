import React, { useMemo, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { MOCK_TUTOR_REMINDERS } from '../../data/fidelisData';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../../styles/theme';
import SectionHeader from '../../components/common/SectionHeader';
import ReminderCard from '../../components/Tutor/ReminderCard';

const RemindersScreen = () => {
  const [reminders, setReminders] = useState(MOCK_TUTOR_REMINDERS);
  const [filterType, setFilterType] = useState('Todos');

  const filterOptions = ['Todos', 'VACINA', 'RETORNO', 'MEDICAMENTO', 'CONSULTA'];

  const filteredReminders = useMemo(() => {
    return reminders.filter((item) => (filterType === 'Todos' ? true : item.type === filterType));
  }, [filterType, reminders]);

  const buckets = useMemo(() => {
    const pending = filteredReminders.filter((item) => !item.completed && item.dueDate >= new Date());
    const delayed = filteredReminders.filter((item) => !item.completed && item.dueDate < new Date());
    const completed = filteredReminders.filter((item) => item.completed);
    return { pending, delayed, completed };
  }, [filteredReminders]);

  const markAsComplete = (reminderId) => {
    setReminders((current) => current.map((item) => (item.id === reminderId ? { ...item, completed: true } : item)));
  };

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
      paddingBottom: SPACING.md,
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
      backgroundColor: COLORS.accent,
      borderColor: COLORS.accent,
    },
    filterText: {
      fontSize: FONT_SIZES.sm,
      fontWeight: FONT_WEIGHTS.medium,
      color: COLORS.textLight,
    },
    filterTextActive: {
      color: COLORS.white,
    },
    remindersContainer: {
      paddingBottom: SPACING.xl,
    },
    statusSection: {
      marginBottom: SPACING.xl,
    },
    emptyContainer: {
      paddingVertical: SPACING.xl,
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
          <SectionHeader title="Lembretes" subtitle="Vacinas, medicamentos e consultas organizados em um único lugar" />

          <View style={styles.filterContainer}>
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterButton,
                  filterType === option && styles.filterButtonActive,
                ]}
                onPress={() => setFilterType(option)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filterType === option && styles.filterTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {buckets.delayed.length > 0 && (
            <View style={styles.statusSection}>
              <SectionHeader title="Atrasados" subtitle={`${buckets.delayed.length} lembretes`} />
              <View style={styles.remindersContainer}>
                {buckets.delayed.map((reminder) => (
                  <ReminderCard key={reminder.id} reminder={reminder} onComplete={markAsComplete} />
                ))}
              </View>
            </View>
          )}

          {buckets.pending.length > 0 && (
            <View style={styles.statusSection}>
              <SectionHeader title="Pendentes" subtitle={`${buckets.pending.length} lembretes`} />
              <View style={styles.remindersContainer}>
                {buckets.pending.map((reminder) => (
                  <ReminderCard key={reminder.id} reminder={reminder} onComplete={markAsComplete} />
                ))}
              </View>
            </View>
          )}

          {buckets.completed.length > 0 && (
            <View style={styles.statusSection}>
              <SectionHeader title="Concluídos" subtitle={`${buckets.completed.length} lembretes`} />
              <View style={styles.remindersContainer}>
                {buckets.completed.map((reminder) => (
                  <ReminderCard key={reminder.id} reminder={reminder} />
                ))}
              </View>
            </View>
          )}

          {filteredReminders.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum lembrete encontrado</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RemindersScreen;
