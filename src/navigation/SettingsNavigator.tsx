import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { ProfileScreen } from '../screens/settings/ProfileScreen';
import { LanguageScreen } from '../screens/settings/LanguageScreen';
import { EditProfileScreen } from '../screens/settings/EditProfileScreen';
import { EditPhoneScreen } from '../screens/settings/EditPhoneScreen';
import { AddPhoneScreen } from '../screens/settings/AddPhoneScreen';
import { EditBirthdayScreen } from '../screens/settings/EditBirthdayScreen';
import { EditOccupationScreen } from '@/screens/settings/EditOccupationScreen';
import { EditAddressScreen } from '@/screens/settings/EditAddressScreen';
import { CityScreen } from '@/screens/settings/CityScreen';

export type SettingsStackParamList = {
  SettingsMain: undefined;
  Profile: undefined;
  Language: undefined;
  EditProfile: undefined;
  EditPhone: undefined;
  AddPhone: undefined;
  EditBirthday: undefined;
  EditOccupation: undefined;
  EditAddressScreen: undefined;
  CityScreen: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export const SettingsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="EditPhone" component={EditPhoneScreen} />
      <Stack.Screen name="AddPhone" component={AddPhoneScreen} />
      <Stack.Screen name="EditBirthday" component={EditBirthdayScreen} />
      <Stack.Screen name="EditOccupation" component={EditOccupationScreen} />
      <Stack.Screen name="EditAddressScreen" component={EditAddressScreen} />
      <Stack.Screen name="CityScreen" component={CityScreen} />
    </Stack.Navigator>
  );
};
