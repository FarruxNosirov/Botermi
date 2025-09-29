import { DEVICE_WIDTH, formatPrice } from '@/constants/constants';
import { useGetMe, usePrizesExchange } from '@/hooks/querys';
import { CatalogStackParamList } from '@/navigation/CatalogStack';
import { useAppDispatch } from '@/store/hooks';
import { getMe } from '@/store/slices/authSlice';
import { showToast } from '@/utils/toastHelper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

const ProductDetailItem = ({ item }: { item: any }) => {
  const navigation = useNavigation<NativeStackNavigationProp<CatalogStackParamList>>();
  const productCardWidth = DEVICE_WIDTH / 2 - 24;
  const planNameLength = item?.name;

  const priceNum = Number(String(item?.price).replace(/\s/g, ''));
  const customerPriceNum = Number(String(item?.customer_price).replace(/\s/g, ''));

  const discountPercentage =
    priceNum > 0 && customerPriceNum > 0
      ? Math.round(((customerPriceNum - priceNum) / customerPriceNum) * 100)
      : 0;

  const { t } = useTranslation();

  const [activeIndex, setActiveIndex] = useState(0);
  const progressValue = useSharedValue(0);

  const allImages = [item?.image, ...(item?.foto_gallary || [])].filter(Boolean);

  const percentage_of_bonus =
    item?.percentage_of_bonus > 0 ? (customerPriceNum / 100) * item?.percentage_of_bonus : 0;
  const { mutate: exchangePrize } = usePrizesExchange();

  const [loadingItems, setLoadingItems] = useState<{ [key: number]: boolean }>({});
  let { data: userData } = useGetMe();
  const dispatch = useAppDispatch();

  const handleExchangePrize = (item: any) => {
    if (userData?.balance) {
      setLoadingItems((prev) => ({ ...prev, [item.id]: true }));

      exchangePrize(
        { product_id: item?.id, type: 'product' },
        {
          onSuccess: async (data) => {
            await dispatch(getMe());
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
  };
  const disabled =
    (Number(userData.balance) >= Number(item?.customer_price) &&
      Number(item?.customer_price) > 0 &&
      userData.vip > 0) ||
    loadingItems[item?.id];

  return (
    <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
      <View style={[styles.productItem, { width: productCardWidth }]}>
        <View style={{ position: 'relative' }}>
          {allImages.length > 1 ? (
            <Carousel
              loop
              width={productCardWidth - 30}
              height={150}
              autoPlay={false}
              data={allImages}
              scrollAnimationDuration={1500}
              onProgressChange={(offsetProgress) => {
                progressValue.value = offsetProgress;
              }}
              onSnapToItem={(index) => setActiveIndex(index)}
              renderItem={({ item: imageUrl }: any) => (
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              )}
            />
          ) : (
            <Image
              source={{ uri: allImages[0] || item?.image }}
              style={[styles.productImage, { width: productCardWidth - 30 }]}
              resizeMode="contain"
            />
          )}
          {allImages.length > 1 ? (
            <View style={styles.dotsContainer}>
              {allImages?.map((_: any, index: React.Key | null | undefined) => (
                <View key={index} style={[styles.dot, activeIndex === index && styles.activeDot]} />
              ))}
            </View>
          ) : null}

          <View style={styles.productDetails}>
            <Text style={styles.productName} numberOfLines={3}>
              {planNameLength}
            </Text>
            {item?.vendor_code && (
              <View style={styles.vendorCodeContainer}>
                <Text style={styles.bonusText}>{t('homePage.vendor_code')}:</Text>
                <Text style={styles.bonusText}>{item?.vendor_code}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.priceContainer}>
          {percentage_of_bonus > 0 && (
            <View style={styles.cashbackContainer}>
              <Text style={styles.cashbackText}>{t('katalog.cashback')}:</Text>
              <Text style={styles.cashbackValue}>
                {percentage_of_bonus} {t('homePage.currency')}
              </Text>
            </View>
          )}
          {priceNum > 0 || customerPriceNum > 0 ? (
            <>
              {userData?.vip > 0 ? (
                <View>
                  <Text style={styles.priceText}>
                    {formatPrice(item?.customer_price)} {t('homePage.currency')}
                  </Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.priceText}>
                    {formatPrice(item?.price)} {t('homePage.currency')}
                  </Text>
                </View>
              )}
            </>
          ) : null}

          <TouchableOpacity
            style={[
              styles.cartButton,
              {
                backgroundColor:
                  Number(userData?.balance) >= Number(item?.customer_price) &&
                  Number(item?.customer_price) > 0 &&
                  userData?.vip > 0
                    ? '#FF3B30'
                    : '#d5d5d5',
              },
            ]}
            onPress={() => handleExchangePrize(item)}
            disabled={!disabled}
          >
            <Text style={styles.cartButtonText}>
              {loadingItems[item?.id] ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                t('homePage.exchange')
              )}
            </Text>
          </TouchableOpacity>
        </View>
        {discountPercentage < 0 && (
          <View style={styles.discountContainer}>
            <Text style={styles.discountText}>{discountPercentage}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ProductDetailItem;

const styles = StyleSheet.create({
  productItem: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 7,
    marginBottom: 12,
    // iOS shadow
    shadowColor: '#dddddd',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android shadow
    elevation: 5,
    height: 370,
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    backgroundColor: '#fff',
  },

  productImage: {
    height: 150,
    borderRadius: 8,
  },
  productDetails: {
    marginTop: 20,
    height: 70,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
  },
  brandName: {
    fontSize: 14,
    color: '#666',
  },
  bonusText: {
    fontSize: 12,
    color: '#999',
  },
  priceContainer: {
    gap: 7,
    height: 100,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F4D0F',
  },
  cartButton: {
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceOld: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  priceOldText: {
    fontSize: 13,
    textDecorationLine: 'line-through',
    color: '#434242',
    textDecorationColor: 'red',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
  },
  dot: {
    width: 10,
    height: 5,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#ff4d4d',
    width: 11,
    height: 6,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  vendorCodeContainer: {
    flexDirection: 'row',
    gap: 5,
  },
  discountContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 6,
    alignSelf: 'flex-start',
    borderBottomRightRadius: 6,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cashbackContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  cashbackText: {
    fontSize: 12,
    color: '#999',
  },
  cashbackValue: {
    fontSize: 12,
    color: '#1373e7',
    fontWeight: '500',
  },
});
