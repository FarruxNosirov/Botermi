import { Button } from '@/components/ui/Button';
import { useAppDispatch } from '@/store/hooks';
import { getMe } from '@/store/slices/authSlice';
import { HomeStackParamList } from '@/types/navigation';
import { UserDataType } from '@/types/userType';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const dispatch = useAppDispatch();
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const { t } = useTranslation();
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

  const StatusGrid = () => {
    return (
      <View style={[styles.bonusCard, { marginVertical: 0 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
            <Feather name="loader" size={24} color="#FFA500" />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
                0 {t('homePage.one')}
              </Text>
              <Text style={{ color: '#000' }}>{t('homePage.viewing')}</Text>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
            <AntDesign name="checkcircle" size={24} color="#00C851" />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
                0 {t('homePage.one')}
              </Text>
              <Text style={{ color: '#000' }}>{t('homePage.approved')}</Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
            <AntDesign name="closecircle" size={24} color="#FF4444" />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
                0 {t('homePage.one')}
              </Text>
              <Text style={{ color: '#000' }}>{t('homePage.rejected')}</Text>
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
            <AntDesign name="frowno" size={24} color="#FFC107" />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
                0 {t('homePage.one')}
              </Text>
              <Text style={{ color: '#000' }}>{t('homePage.used')}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={40} color="#666" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userId}>ID {userData?.id}</Text>
            <Text style={styles.userPhone}>+{userData?.phone}</Text>
          </View>
        </View>
        <Pressable onPress={() => navigation.navigate('Notifications' as any)}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.bonusCard}>
          <Text style={styles.bonusTitle}>{t('homePage.availableBonuss')}</Text>
          <View style={styles.bonusAmount}>
            <Ionicons name="card-outline" size={24} color="#00A86B" />
            <Text style={styles.bonusValue}>0</Text>
            <Text style={styles.bonusUnit}>{t('homePage.currency')}</Text>
          </View>
        </View>
        <StatusGrid />

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Blogs')}>
          <View style={styles.actionIcon}>
            <AntDesign name="youtube" size={24} color="#fff" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>{t('homePage.noteProject')}</Text>
            <Text style={styles.actionSubtitle}>{t('homePage.noteProjectDescription')}</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('homePage.announcements')}</Text>
          <TouchableOpacity
            style={[
              styles.promotionCard,
              {
                backgroundColor: '#229ED9',
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                padding: 16,
              },
            ]}
            onPress={() => {
              Linking.openURL('https://t.me/duca_uzb');
            }}
          >
            <View
              style={{
                width: 70,
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                backgroundColor: '#fff',
              }}
            >
              <FontAwesome name="telegram" size={45} color="#229ED9" />
            </View>
            <View style={styles.promotionContent}>
              <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                <View style={[styles.promotionBadge, { backgroundColor: '#fff' }]}>
                  <Text style={[styles.promotionBadgeText, { color: '#229ED9' }]}>
                    {t('homePage.telegram')}
                  </Text>
                </View>
              </View>
              <View style={styles.promotionHeader}>
                <Text style={[styles.promotionTitle, { color: '#fff' }]}>
                  {t('homePage.joinOurTelegramChannel')}
                </Text>
              </View>
              <Text style={[styles.promotionDescription, { color: '#fff' }]}>
                {t('homePage.aboutNews')}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.promotionCard,
              {
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                padding: 16,
                marginTop: 10,
                justifyContent: 'space-between',
              },
            ]}
            onPress={() => {}}
          >
            <View style={styles.promotionContent2}>
              <View style={styles.promotionHeader}>
                <Text style={[styles.promotionTitle, { color: '#000' }]}>
                  {t('homePage.giftInExchangeForPoints')}
                </Text>
              </View>
              <Text style={[styles.promotionDescription, { color: '#666', marginBottom: 12 }]}>
                {t('homePage.exchangeYourPointsForGiftsThroughTheApp')}
              </Text>
              <Button title={t('homePage.exchange')} onPress={() => {}} />
            </View>
            <Image
              source={require('@assets/2025-06-10 10.50.38.jpg')}
              style={{ width: 130, height: 150 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  content: {
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#fff',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  userDetails: {
    marginLeft: 12,
  },
  userId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  bonusCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0 0 5 #dddddd',
  },
  bonusTitle: {
    fontSize: 14,
    color: '#666',
  },
  bonusAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  bonusValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  bonusUnit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  actionCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    boxShadow: '0 0 5 #dddddd',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#353434',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  promotionCard: {
    borderRadius: 12,
    backgroundColor: '#fff',
    boxShadow: '0 0 5 #dddddd',
    overflow: 'hidden',
  },
  promotionContent: {
    width: '80%',
    paddingHorizontal: 10,
  },
  promotionContent2: {
    width: '60%',
    paddingHorizontal: 10,
  },
  promotionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promotionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  promotionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
  },
  promotionBadgeText: {
    fontSize: 12,
    color: '#fff',
  },
  promotionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
});

export default HomeScreen;
