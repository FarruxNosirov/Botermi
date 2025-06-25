import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@/screens/home/HomeScreen';
import Blogs from '@/screens/home/Blogs';
import { HomeStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="Blogs" component={Blogs} />
  </Stack.Navigator>
);

export default HomeStack;
