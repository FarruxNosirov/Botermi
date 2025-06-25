import GoBackHeader from '@/components/GoBackHeader';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { SettingsStackParamList } from '@/navigation/SettingsNavigator';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View, Switch } from 'react-native';

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

  const renderSettingsItem = ({ item }: { item: SettingsItem }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={item.onPress} activeOpacity={0.7}>
      <View style={styles.settingsItemLeft}>
        <Icon name={item.icon} size={24} color={colors.primary} />
        <Text style={styles.settingsItemText}>{item.title}</Text>
      </View>
      <Icon name="chevron-forward-outline" size={24} color={colors.gray[400]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader title="Sozlamalar" />
      <View style={styles.list}>
        {/* Xabarlar */}
        <View style={styles.item}>
          <Text style={styles.text}>Xabarlar</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#eee', true: colors.successColor || '#4cd964' }}
            thumbColor="#fff"
          />
        </View>
        <View style={styles.divider} />
        {/* Foydalanish qoidalari */}
        <TouchableOpacity style={styles.item} onPress={() => {}}>
          <Text style={styles.text}>Foydalanish qoidalari</Text>
          <Ionicons name="chevron-forward" size={20} color="#bbb" />
        </TouchableOpacity>
        <View style={styles.divider} />
        {/* Maxfiylik siyosati */}
        <TouchableOpacity style={styles.item} onPress={() => {}}>
          <Text style={styles.text}>Maxfiylik siyosati</Text>
          <Ionicons name="chevron-forward" size={20} color="#bbb" />
        </TouchableOpacity>
        <View style={styles.divider} />
        {/* Akkountni o'chirish */}
        <TouchableOpacity style={styles.item} onPress={() => {}}>
          <Text style={[styles.text, { color: '#E32F45' }]}>Akkountni o'chirish</Text>
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
