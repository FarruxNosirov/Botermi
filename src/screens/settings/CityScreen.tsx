import GoBackHeader from '@/components/GoBackHeader';
import { useGetCities } from '@/hooks/querys';
import { SettingsStackParamList } from '@/navigation/SettingsNavigator';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet } from 'react-native';

type SettingsScreenNavigationProp = NativeStackNavigationProp<SettingsStackParamList, 'CityScreen'>;

type SettingsItem = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export const CityScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { data: cities } = useGetCities();
  const { t } = useTranslation();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  console.log('cities', JSON.stringify(cities, null, 2));

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader title={t('profilePage.city')} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
