import React from 'react';
import { View } from 'react-native';

const Card = ({
  children,
  style,
  shadow = true,
  padding = true,
  ...props
}) => {
  return (
    <View
      className={`rounded-2xl bg-white ${padding ? 'p-4' : ''} ${shadow ? 'shadow-sm' : ''}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
};

export default Card;
