import React from 'react';
import { View, Text } from 'react-native';

const AvatarBadge = ({ emoji, initials, size = 72, backgroundColor = '#f1f5f9', textColor = '#0f172a', style }) => {
  return (
    <View
      className="items-center justify-center rounded-full border border-slate-200"
      style={[{ width: size, height: size, backgroundColor }, style]}
    >
      {emoji ? (
        <Text style={{ fontSize: size * 0.42 }}>{emoji}</Text>
      ) : (
        <Text style={{ fontSize: size * 0.28, fontWeight: '700', color: textColor }}>{initials}</Text>
      )}
    </View>
  );
};

export default AvatarBadge;
