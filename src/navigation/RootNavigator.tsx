import { BranchesScreen } from '@/screens/branches/BranchesScreen';
import { NotificationDetailScreen } from '@/screens/notifications/NotificationDetailScreen';
import { NotificationsScreen } from '@/screens/notifications/NotificationsScreen';
import OperationsFilterScreen from '@/screens/operations/OperationsFilterScreen';
import { AppDispatch, RootState } from '@/store';
import { RootStackParamList } from '@/types/navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMe, logout } from '@/store/slices/authSlice';
import i18n from '@/i18n';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { isAuthenticated, isFullyRegistered } = useSelector((state: RootState) => state.auth);
  const locale = useSelector((state: RootState) => state.language.locale);
  const dispatch = useDispatch<AppDispatch>();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  // App ochilganda token tekshirish va validation
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('@auth_token');

        if (token) {
          // Token bor bo'lsa, serverdan user ma'lumotlarini olish
          try {
            await dispatch(getMe()).unwrap();
          } catch (error: any) {
            // Faqat 401 (Unauthorized) xatosida logout qilish
            if (error?.response?.status === 401 || error?.status === 401) {
              console.log('Token invalid, logging out');
              dispatch(logout());
            } else {
              // Boshqa xatolar (network, server error) da login saqlansin
              console.log('Network error, keeping user logged in:', error);
            }
          }
        }
      } catch (error) {
        console.log('Auth initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (isInitializing) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}
      >
        <ActivityIndicator size="large" color="#FF3B30" />
      </View>
    );
  }

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
