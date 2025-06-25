import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { NotificationsScreen } from '@/screens/notifications/NotificationsScreen';
import { NotificationDetailScreen } from '@/screens/notifications/NotificationDetailScreen';
import OperationsFilterScreen from '@/screens/operations/OperationsFilterScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
      <Stack.Screen name="OperationsFilter" component={OperationsFilterScreen} />
    </Stack.Navigator>
  );
};
