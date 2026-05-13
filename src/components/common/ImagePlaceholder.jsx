import React from 'react';
import { View, Text } from 'react-native';

const ImagePlaceholder = ({ size = 'md', emoji = '🐾', style }) => {
  const sizes = {
    sm: 80,
    md: 120,
    lg: 200,
    xl: 250,
  };

  return (
    <View
      className="items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-100"
      style={[{ width: sizes[size], height: sizes[size] }, style]}
    >
      <Text style={{ fontSize: sizes[size] / 2 }}>{emoji}</Text>
    </View>
  );
};

export default ImagePlaceholder;
