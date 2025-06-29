import ProfileItem from '@/components/ProfileItem';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { SettingsStackParamList } from '@/navigation/SettingsNavigator';
import { useAppDispatch } from '@/store/hooks';
import { getMe, logout } from '@/store/slices/authSlice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Linking, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ProfileScreenNavigationProp = NativeStackNavigationProp<SettingsStackParamList>;
type UserPosition = {
  id: number;
  name: string;
};

type UserData = {
  id: number;
  name: string;
  surname: string;
  phone: string;
  second_phone: string;
  vip: number;
  city: string;
  positions: UserPosition[];
};

export const ProfileScreen = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleGetMe = async () => {
    const resultAction = await dispatch(getMe());

    if (getMe.fulfilled.match(resultAction)) {
      setUserData(resultAction?.payload?.data);
    } else {
      console.log('Xatolik:', resultAction.payload);
    }
  };
  useEffect(() => {
    handleGetMe();
  }, []);

  const { i18n, t } = useTranslation();

  const navData = [
    {
      id: 'profile',
      title: t('profilePage.myProfile'),
      icon: 'person-outline' as const,
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: 'settings',
      title: t('profilePage.settings'),
      icon: 'settings-outline' as const,
      onPress: () => navigation.navigate('SettingsMain'),
    },
    {
      id: 'language',
      title: t('profilePage.language'),
      icon: 'language-outline' as const,
      value: i18n.language === 'uz' ? 'O‘zb' : 'Русский',
      valueColor: '#4CAF50',
      onPress: () => navigation.navigate('Language'),
    },
    {
      id: 'prizes',
      title: t('profilePage.prizes'),
      icon: 'pricetags-outline' as const,
      onPress: () => {},
    },
    {
      id: 'faq',
      title: t('profilePage.faq'),
      icon: 'help-circle-outline' as const,
      onPress: () => {},
    },
    {
      id: 'logout',
      title: t('profilePage.logout'),
      icon: 'log-out-outline' as const,
      onPress: () => {
        Alert.alert(
          t('attention'),
          t('deleteAccountDescription'),
          [
            { text: t('no'), style: 'cancel' },
            { text: t('yes'), style: 'destructive', onPress: () => dispatch(logout()) },
          ],
          { cancelable: true },
        );
      },
    },
    {
      id: 'about',
      title: t('profilePage.about'),
      icon: 'information-circle-outline' as const,
      onPress: () => {},
    },
  ];
  const insets = useSafeAreaInsets();
  const makeCall = async () => {
    const phoneNumber = 'tel:+998951447575';
    const supported = await Linking.canOpenURL(phoneNumber);

    if (supported) {
      Linking.openURL(phoneNumber);
    } else {
      Alert.alert(t('error'), t('errorDescription'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerBox}>
          <View style={styles.personBox}>
            <Icon name="person-outline" size={36} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.firstName}>
              {userData?.name || 'aziz'} {userData?.surname || 'rametov'}
            </Text>
            <Text style={styles.date}>{t('profilePage.registered')}: 17.05.2025; 10:56</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
              <Text style={styles.statusText}>{t('profilePage.status')}:</Text>
              <View style={styles.status}>
                <Icon name="checkmark-circle" size={18} color={colors.successColor} />
                <Text style={styles.statusTitle}>{t('profilePage.active')}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.contentContainerStyle}>
        <View style={styles.renderBox}>
          {navData.map((item, idx, arr) => (
            <ProfileItem key={idx} item={item} arr={arr} idx={idx} />
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: 80,
  },
  contentContainerStyle: { flex: 1 },
  headerContainer: {
    paddingBottom: 30,
    backgroundColor: colors.overlayDark,
    flex: 0.3,
  },
  headerBox: {
    backgroundColor: colors.gray[800],
    borderRadius: 16,
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileItems: {
    paddingHorizontal: 16,
  },
  personBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gray[700],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileItemTextContainer: {
    marginLeft: 12,
  },
  profileItemTitle: {
    fontSize: 14,
    color: colors.gray[400],
  },
  profileItemValue: {
    fontSize: 16,
    color: colors.gray[900],
    marginTop: 2,
  },
  renderBox: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 8,
    marginBottom: 16,
    overflow: 'hidden',
  },
  status: {
    backgroundColor: colors.white,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  opirator: {
    backgroundColor: colors.gray[100],
    borderRadius: 16,
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  opiratorTitle: { fontSize: 16, color: colors.textDark, marginLeft: 12 },
  statusTitle: { color: colors.successColor, fontWeight: 'bold', marginLeft: 4, fontSize: 13 },
  statusText: { color: colors.white, fontSize: 13, marginRight: 8 },
  date: { color: colors.white, fontSize: 13, marginTop: 10 },
  firstName: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});
