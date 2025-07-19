import { BranchesScreen } from '@/screens/branches/BranchesScreen';
import { NotificationDetailScreen } from '@/screens/notifications/NotificationDetailScreen';
import { NotificationsScreen } from '@/screens/notifications/NotificationsScreen';
import OperationsFilterScreen from '@/screens/operations/OperationsFilterScreen';
import { AppDispatch, RootState } from '@/store';
import { RootStackParamList } from '@/types/navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMe } from '@/store/slices/authSlice';
import i18n from '@/i18n';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { isAuthenticated, isFullyRegistered } = useSelector((state: RootState) => state.auth);
  const locale = useSelector((state: RootState) => state.language.locale);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('@auth_token');
      console.log('token', token);
      if (token) {
        dispatch(getMe());
      }
    })();
  }, [dispatch]);
  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated || !isFullyRegistered ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="MainApp" component={MainTabNavigator} />
            <Stack.Screen name="Branches" component={BranchesScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
            <Stack.Screen name="OperationsFilter" component={OperationsFilterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
