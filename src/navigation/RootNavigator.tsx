import { BranchesScreen } from '@/screens/branches/BranchesScreen';
import { NotificationDetailScreen } from '@/screens/notifications/NotificationDetailScreen';
import { NotificationsScreen } from '@/screens/notifications/NotificationsScreen';
import OperationsFilterScreen from '@/screens/operations/OperationsFilterScreen';
import { AppDispatch, RootState } from '@/store';
import { RootStackParamList } from '@/types/navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthNavigator } from './AuthNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMe } from '@/store/slices/authSlice';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { isAuthenticated, isFullyRegistered } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  React.useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('@auth_token');
      if (token) {
        dispatch(getMe());
      }
    })();
  }, [dispatch]);
  console.log('isAuthenticated', isAuthenticated);
  console.log('isFullyRegistered', isFullyRegistered);

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
