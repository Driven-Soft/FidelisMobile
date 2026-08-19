import React from 'react';
import { View } from 'react-native';

const Card = ({
  children,
  className = '',
  style,
  shadow = true,
  padding = true,
  ...props
}) => {
  return (
    <View
      className={`rounded-2xl bg-white ${padding ? 'p-4' : ''} ${shadow ? 'shadow-sm' : ''} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </View>
  );
};

export default Card;
