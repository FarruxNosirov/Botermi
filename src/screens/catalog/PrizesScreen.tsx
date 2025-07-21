import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { usePrizes, usePrizesExchange } from '@/hooks/querys';
import { DEVICE_WIDTH, formatBalance } from '@/constants/constants';
import { showToast } from '@/utils/toastHelper';
import { UserDataType } from '@/types/userType';
import { getMe } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/store/hooks';
import IsLoading from '@/components/IsLoading';
import EmptyState from '@/components/EmptyState';

const PrizesScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [loadingItems, setLoadingItems] = useState<{ [key: number]: boolean }>({});
  const dispatch = useAppDispatch();

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

  const { data, isLoading } = usePrizes();
  const productCardWidth = DEVICE_WIDTH / 2 - 24;
  const { mutate: exchangePrize } = usePrizesExchange();

  const handleExchangePrize = (item: any) => {
    if (userData?.balance && userData?.balance >= item?.price) {
      setLoadingItems((prev) => ({ ...prev, [item.id]: true }));

      exchangePrize(item?.id, {
        onSuccess: async (data) => {
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
      });
    } else {
      showToast('error', t('error'), t('actions.notEnoughBalance'));
    }
  };

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
            renderItem={({ item }) => {
              const isItemLoading = loadingItems[item.id] || false;

              return (
                <View style={[styles.productItem, { width: productCardWidth }]}>
                  <Image
                    source={{ uri: item?.image }}
                    style={[styles.productImage, { width: productCardWidth - 30, borderWidth: 1 }]}
                    resizeMode="contain"
                  />
                  <View>
                    <Text style={styles.price}>{formatBalance(item?.price)}</Text>
                    <Text>{item?.name}</Text>
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
            }}
            ListEmptyComponent={<EmptyState />}
          />
        </>
      )}

      <View style={{ height: 50 }} />
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  productItem: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
    height: 280,
    flexDirection: 'column',
    justifyContent: 'space-between',
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
    color: 'red',
  },
});
