import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../../styles/theme';
import Badge from '../common/Badge';

const ReminderCard = ({ reminder, onComplete, horizontal = false }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'VACINA':
        return '💉';
      case 'RETORNO':
        return '🔄';
      case 'MEDICAMENTO':
        return '💊';
      case 'VERMÍFUGO':
        return '🪱';
      default:
        return '📋';
    }
  };

  const daysUntilDue = Math.ceil((reminder.dueDate - new Date()) / (1000 * 60 * 60 * 24));
  const status = reminder.completed ? 'CONCLUÍDO' : daysUntilDue < 0 ? 'ATRASADO' : 'PENDENTE';

  const styles = StyleSheet.create({
    card: {
      backgroundColor: COLORS.white,
      borderRadius: BORDER_RADIUS.lg,
      padding: SPACING.lg,
      marginBottom: SPACING.md,
      marginRight: horizontal ? SPACING.md : 0,
      minWidth: horizontal ? 280 : undefined,
      ...SHADOWS.sm,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: SPACING.md,
    },
    titleContainer: {
      flex: 1,
      marginRight: SPACING.md,
    },
    petName: {
      fontSize: FONT_SIZES.base,
      fontWeight: FONT_WEIGHTS.semibold,
      color: COLORS.text,
      marginBottom: SPACING.xs,
    },
    description: {
      fontSize: FONT_SIZES.sm,
      color: COLORS.textLight,
      fontWeight: FONT_WEIGHTS.regular,
    },
    icon: {
      fontSize: FONT_SIZES.xxl,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: SPACING.md,
    },
    dateText: {
      fontSize: FONT_SIZES.xs,
      color: COLORS.textLight,
      fontWeight: FONT_WEIGHTS.regular,
    },
    daysUntil: {
      fontSize: FONT_SIZES.xs,
      fontWeight: FONT_WEIGHTS.bold,
      color: status === 'ATRASADO' ? COLORS.danger : daysUntilDue <= 3 ? COLORS.warning : COLORS.success,
    },
    statusContainer: {
      alignItems: 'flex-end',
      gap: SPACING.xs,
    },
    completeButton: {
      marginTop: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      borderWidth: 1,
      borderColor: COLORS.accent,
      paddingVertical: SPACING.sm,
      alignItems: 'center',
    },
    completeText: {
      color: COLORS.accent,
      fontWeight: FONT_WEIGHTS.semibold,
      fontSize: FONT_SIZES.xs,
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.petName}>{reminder.petName}</Text>
          <Text style={styles.description}>{reminder.title}</Text>
          <Text style={styles.description}>{reminder.description}</Text>
        </View>
        <Text style={styles.icon}>{getTypeIcon(reminder.type)}</Text>
      </View>
      
      <View style={styles.footer}>
        <View>
          <Text style={styles.dateText}>
            {reminder.dueDate.toLocaleDateString('pt-BR')}
          </Text>
          <Text style={styles.daysUntil}>
            {daysUntilDue <= 0 ? 'Vencido' : `${daysUntilDue} dia${daysUntilDue !== 1 ? 's' : ''}`}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          <Badge type={reminder.type} label={reminder.type} />
          <Badge type={status} label={status} />
        </View>
      </View>

      {onComplete && !reminder.completed && (
        <TouchableOpacity style={styles.completeButton} onPress={() => onComplete(reminder.id)}>
          <Text style={styles.completeText}>Marcar como concluído</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ReminderCard;
