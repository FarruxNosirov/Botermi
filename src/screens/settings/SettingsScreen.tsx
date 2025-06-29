import GoBackHeader from '@/components/GoBackHeader';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { SettingsStackParamList } from '@/navigation/SettingsNavigator';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  SettingsStackParamList,
  'SettingsMain'
>;

type SettingsItem = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

export const SettingsScreen = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [notifications, setNotifications] = useState(true);
  const { t } = useTranslation();

  const settingsItems: SettingsItem[] = [
    {
      id: '1',
      title: 'Profile',
      icon: 'person-outline',
      onPress: () => navigation.navigate('Profile'),
    },
    {
      id: '2',
      title: 'Language',
      icon: 'language-outline',
      onPress: () => navigation.navigate('Language'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader title="Sozlamalar" />
      <View style={styles.list}>
        <View style={styles.item}>
          <Text style={styles.text}>{t('profilePage.messages')}</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#eee', true: colors.successColor || '#4cd964' }}
            thumbColor="#fff"
          />
        </View>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.item} onPress={() => {}}>
          <Text style={styles.text}>{t('profilePage.termsOfUse')}</Text>
          <Ionicons name="chevron-forward" size={20} color="#bbb" />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.item} onPress={() => {}}>
          <Text style={styles.text}>{t('profilePage.privacyPolicy')}</Text>
          <Ionicons name="chevron-forward" size={20} color="#bbb" />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.item} onPress={() => {}}>
          <Text style={[styles.text, { color: '#E32F45' }]}>{t('profilePage.deleteAccount')}</Text>
          <Ionicons name="chevron-forward" size={20} color="#E32F45" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { marginTop: 8 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 52,
    backgroundColor: '#fff',
  },
  text: { fontSize: 16, color: '#222' },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.gray[900],
  },
});
