import BranchesScreen from '@/screens/branches/BranchesScreen';
import CartScreen from '@/screens/cart/CartScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

export type CartStackParamList = {
  Cart: undefined;
  Branches: {
    onSelect?: (location: string) => void;
  };
};

const Stack = createNativeStackNavigator<CartStackParamList>();

export const CartStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Branches" component={BranchesScreen} />
    </Stack.Navigator>
  );
};
