import { View, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

type Props = {
  emoji?: string;
  initials?: string;
  name?: string;
  size?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '?';

const Avatar = ({ emoji, initials, name, size = 40, radius = 8, style }: Props) => (
  <View
    className="items-center justify-center bg-clinic-50"
    style={[{ width: size, height: size, borderRadius: radius }, style]}
  >
    {emoji ? (
      <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
    ) : (
      <Text className="font-sans-semibold text-clinic-ink" style={{ fontSize: size * 0.36 }}>
        {initials ?? getInitials(name)}
      </Text>
    )}
  </View>
);

export default Avatar;
