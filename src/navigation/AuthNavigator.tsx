import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { LoginScreen } from '@screens/auth/LoginScreen';
import { AgreementScreen } from '@screens/auth/AgreementScreen';
import { RegistrationScreen } from '@screens/auth/RegistrationScreen';
import { OTPScreen } from '@screens/auth/OTPScreen';
import WelcomeScreen from '@/screens/auth/WelcomeScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="Agreement" component={AgreementScreen} />
    </Stack.Navigator>
  );
};
