import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

export default function Card({ children, style }: Props) {
  return <View style={[stylesCard.cardy, style]}>{children}</View>;
}

const stylesCard = StyleSheet.create({
  cardy: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#00000054',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginTop: -65,
    marginHorizontal: 20,
  },
});
