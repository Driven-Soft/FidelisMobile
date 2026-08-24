import { View, Text } from 'react-native';

// A direcao preve um unico accent: todo tipo cai em ok (clinic), alert ou neutral.
const ALERT_TYPES = ['ATRASADO', 'Emergência'];
const OK_TYPES = ['CONCLUÍDO'];

const Badge = ({ type = 'default', label, icon, style, textStyle }) => {
  const isAlert = ALERT_TYPES.includes(type);
  const isOk = OK_TYPES.includes(type);

  return (
    <View
      className={`flex-row items-center self-start rounded-badge px-2 py-1 ${
        isAlert ? 'bg-alert-50' : isOk ? 'bg-clinic-50' : 'bg-hairline'
      }`}
      style={style}
    >
      {icon && icon}
      <Text
        className={`font-sans-semibold text-badge ${
          isAlert ? 'text-alert-ink' : isOk ? 'text-clinic-ink' : 'text-slate'
        }`}
        style={textStyle}
      >
        {label}
      </Text>
    </View>
  );
};

export default Badge;
