import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, FONT_WEIGHTS } from '../../styles/theme';

const Badge = ({ type = 'default', label, icon, style, textStyle }) => {
  const getBadgeColor = () => {
    switch (type) {
      case 'VACINA':
        return { bg: COLORS.success, text: COLORS.white };
      case 'RETORNO':
        return { bg: COLORS.info, text: COLORS.white };
      case 'MEDICAMENTO':
        return { bg: COLORS.warning, text: COLORS.white };
      case 'VERMÍFUGO':
        return { bg: COLORS.secondary, text: COLORS.white };
      case 'CONSULTA':
        return { bg: COLORS.primary, text: COLORS.white };
      case 'PENDENTE':
        return { bg: '#FFF4D6', text: '#9A6700' };
      case 'CONCLUÍDO':
        return { bg: '#E6F6EA', text: '#157347' };
      case 'ATRASADO':
        return { bg: '#FDECEC', text: COLORS.danger };
      case 'Rotina':
        return { bg: '#E8F5E9', text: COLORS.success };
      case 'Retorno':
        return { bg: '#E3F2FD', text: COLORS.info };
      case 'Emergência':
        return { bg: '#FFEBEE', text: COLORS.danger };
      case 'Preventiva':
        return { bg: '#F3E5F5', text: COLORS.secondary };
      default:
        return { bg: COLORS.lightGray, text: COLORS.text };
    }
  };

  const colors = getBadgeColor();

  const styles = StyleSheet.create({
    badge: {
      backgroundColor: colors.bg,
      paddingVertical: SPACING.xs,
      paddingHorizontal: SPACING.md,
      borderRadius: BORDER_RADIUS.full,
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.xs,
      alignSelf: 'flex-start',
    },
    text: {
      color: colors.text,
      fontSize: FONT_SIZES.xs,
      fontWeight: FONT_WEIGHTS.semibold,
    },
  });

  return (
    <View style={[styles.badge, style]}>
      {icon && icon}
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </View>
  );
};

export default Badge;
