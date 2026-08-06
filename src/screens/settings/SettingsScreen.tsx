import GoBackHeader from '@/components/GoBackHeader';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { useDeleteProfile } from '@/hooks/querys';
import { SettingsStackParamList } from '@/navigation/SettingsNavigator';
import { RootState } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, SafeAreaView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  SettingsStackParamList,
  'SettingsMain'
>;

export const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const { t } = useTranslation();
  const { mutate: deleteProfile } = useDeleteProfile();
  const { user } = useSelector((state: RootState) => state.auth);
  console.log(JSON.stringify(user?.data?.id, null, 2));
  const onDeleteProfile = () => {
    Alert.alert(t('profilePage.deleteAccountTitle'), t('profilePage.deleteAccountDescription'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('profilePage.delete'), onPress: () => deleteProfile(user?.data?.id) },
    ]);
  };
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader title={t('profilePage.settings')} />
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
        <View style={{ width: '100%' }}>
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('TermsOfUse')}>
            <View style={{ width: '80%' }}>
              <Text style={styles.text}>{t('profilePage.termsOfUse')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#bbb" />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={{ width: '100%' }}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <View style={{ width: '80%' }}>
              <Text style={styles.text}>{t('profilePage.privacyPolicy')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#bbb" />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={{ width: '100%' }}>
          <TouchableOpacity style={styles.item} onPress={onDeleteProfile}>
            <View style={{ width: '80%' }}>
              <Text style={[styles.text, { color: '#E32F45' }]}>
                {t('profilePage.deleteAccount')}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#E32F45" />
          </TouchableOpacity>
        </View>
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
