import { formatBalance } from '@/constants/constants';
import { useGetStatuses } from '@/hooks/querys';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getMe } from '@/store/slices/authSlice';
import { HomeStackParamList } from '@/types/navigation';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import StatusCard from '@/components/StatusCard';

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<HomeStackParamList>>();
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user?.data || state.auth.user);

  const { data: statuses, refetch } = useGetStatuses((authUser as any)?.id);
  const { t } = useTranslation();

  const handleGetMe = async () => {
    await dispatch(getMe());
  };
  useEffect(() => {
    if (!authUser) {
      handleGetMe();
    }
    refetch();
  }, []);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );
  console.log('authUser', JSON.stringify(authUser, null, 2));

  const StatusGrid = () => {
    return (
      <View style={{ width: '100%', paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
          <StatusCard
            iconLib="Entypo"
            iconName="back-in-time"
            color="#a9a9a9"
            value={statuses?.waiting_barcodes}
            title={t('homePage.currency')}
            label={t('homePage.viewing')}
          />
          <StatusCard
            iconLib="MaterialCommunityIcons"
            iconName="clock-check-outline"
            color="#a9a9a9"
            value={statuses?.approved_barcodes}
            title={t('homePage.currency')}
            label={t('homePage.approved')}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <StatusCard
            iconLib="MaterialCommunityIcons"
            iconName="clock-remove-outline"
            color="#a9a9a9"
            value={statuses?.rejected_barcodes}
            title={t('homePage.currency')}
            label={t('homePage.rejected')}
          />
          <StatusCard
            iconLib="FontAwesome5"
            iconName="hand-holding-heart"
            color="#a9a9a9"
            value={0}
            title={t('homePage.currency')}
            label={t('homePage.used')}
          />
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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.userPhone}>{authUser?.name} </Text>

              <Text style={styles.userPhone}>{authUser?.surname}</Text>
            </View>
            <Text style={styles.userId}>ID {authUser?.id}</Text>
          </View>
        </View>
        <Pressable onPress={() => navigation.navigate('Notifications' as any)}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </Pressable>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.bonusCard}>
          <View>
            <Text style={styles.bonusTitle}>{t('homePage.availableBonuss')}</Text>
            <View style={styles.bonusAmount}>
              <Text style={styles.bonusValue}>{formatBalance(authUser?.balance)}</Text>
              <Text style={styles.bonusUnit}>{t('homePage.currency')}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Catalog' as any, { screen: 'PrizesScreen' })}
          >
            <View
              style={{
                backgroundColor: '#c5c5c5',
                padding: 10,
                borderRadius: 5,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <FontAwesome6 name="gift" size={20} color="red" />
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>
                {t('homePage.exchange')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <StatusGrid />

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
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Blogs')}>
            <View style={styles.actionIcon}>
              <AntDesign name="youtube" size={45} color="#fff" />
            </View>
            <View style={styles.actionContent}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={styles.actionTitle}>{t('homePage.noteProject')}</Text>
                <View style={{ backgroundColor: 'red', padding: 5, borderRadius: 5 }}>
                  <Text style={{ color: '#fff', fontWeight: '600', fontSize: 14 }}>You Tube</Text>
                </View>
              </View>
              <Text style={styles.actionSubtitle}>{t('homePage.noteProjectDescription')}</Text>
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity
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
          </TouchableOpacity> */}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
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
    fontSize: 18,
    color: '#000',
    marginTop: 4,
    fontWeight: '600',
  },
  bonusCard: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    boxShadow: '0 0 5 #dddddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bonusTitle: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  bonusAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  bonusValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  bonusUnit: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
    alignSelf: 'flex-end',
  },
  actionCard: {
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: '#fff',
    boxShadow: '0 0 5 #dddddd',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 70,
    height: 70,
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
