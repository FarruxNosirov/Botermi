import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { usePrizes, usePrizesExchange } from '@/hooks/querys';
import { DEVICE_WIDTH, formatBalance } from '@/constants/constants';
import { showToast } from '@/utils/toastHelper';
import { UserDataType } from '@/types/userType';
import { getMe } from '@/store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import IsLoading from '@/components/IsLoading';
import EmptyState from '@/components/EmptyState';

const PrizesScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const authUser = useAppSelector((state) => state.auth.user?.data || state.auth.user);
  const [userData, setUserData] = useState<UserDataType | null>(authUser || null);
  const [loadingItems, setLoadingItems] = useState<{ [key: number]: boolean }>({});
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();

  const { data, isLoading, refetch } = usePrizes();
  const { mutate: exchangePrize } = usePrizesExchange();

  // Sync userData with authUser
  useEffect(() => {
    if (authUser) {
      setUserData(authUser);
    }
  }, [authUser]);

  const handleGetMe = useCallback(async () => {
    const resultAction = await dispatch(getMe());
    if (getMe.fulfilled.match(resultAction)) {
      setUserData(resultAction?.payload?.data);
    } else {
      console.log('error:', resultAction.payload);
    }
  }, [dispatch]);

  useEffect(() => {
    if (!authUser) {
      handleGetMe();
    }
  }, [authUser, handleGetMe]);

  // Memoize productCardWidth to avoid recalculation on every render
  const productCardWidth = useMemo(() => DEVICE_WIDTH / 2 - 24, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await handleGetMe();
      await refetch();
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [handleGetMe, refetch]);

  const handleExchangePrize = useCallback(
    (item: any) => {
      if (userData?.balance && userData?.balance >= item?.price) {
        setLoadingItems((prev) => ({ ...prev, [item.id]: true }));

        exchangePrize(
          { prize_id: item?.id, type: 'prize' },
          {
            onSuccess: async () => {
              await handleGetMe();
              showToast('success', t('commond.success'), t('actions.scanSuccess'));
              setLoadingItems((prev) => ({ ...prev, [item.id]: false }));
            },
            onError: (error: any) => {
              console.log('error?.response?.data?.message', error?.response?.data?.message);

              showToast(
                'error',
                t('commond.error'),
                error?.response?.data?.message || t('commond.notEnoughBalance'),
              );
              setLoadingItems((prev) => ({ ...prev, [item.id]: false }));
            },
          },
        );
      } else {
        showToast('error', t('error'), t('commond.notEnoughBalance'));
      }
    },
    [userData?.balance, exchangePrize, handleGetMe, t],
  );

  const renderPrizeItem = useCallback(
    ({ item }: { item: any }) => {
      const isItemLoading = loadingItems[item.id] || false;

      return (
        <View style={[styles.productItem, { width: productCardWidth }]}>
          <Image
            source={{ uri: item?.image }}
            style={[styles.productImage, { width: productCardWidth - 30 }]}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.price}>{formatBalance(item?.price)}</Text>
            <Text style={styles.productNameText} numberOfLines={2}>
              {item?.name}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.cartButton, isItemLoading && styles.cartButtonLoading]}
            onPress={() => handleExchangePrize(item)}
            disabled={isItemLoading}
          >
            <Text style={styles.buttonText}>
              {isItemLoading ? t('commond.loading') : t('katalog.exchange')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [loadingItems, productCardWidth, handleExchangePrize, t],
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <IsLoading />
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#000" />
              <Text style={styles.headerTitle}>{t('back')}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainerStyle}
            data={data?.data.data || []}
            renderItem={renderPrizeItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#B3071A']}
                tintColor="#B3071A"
              />
            }
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            initialNumToRender={6}
            windowSize={5}
            ListEmptyComponent={<EmptyState />}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default PrizesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  productItem: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    height: 280,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    // Android shadow
    elevation: 6,
  },
  contentContainerStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 100,
  },
  productImage: {
    height: 150,
    borderRadius: 8,
  },
  cartButton: {
    backgroundColor: '#d5d5d5',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  cartButtonLoading: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    color: '#000',
    fontWeight: '500',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F4D0F',
  },
  productNameText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
});
