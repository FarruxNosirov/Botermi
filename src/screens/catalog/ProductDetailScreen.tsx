import IsLoading from '@/components/IsLoading';
import ProductDetailItem from '@/components/ProductDetailItem';
import { formatPrice } from '@/constants/constants';
import { usePrizesExchange, useSingleProduct } from '@/hooks/querys';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getMe } from '@/store/slices/authSlice';
import { CatalogStackParamList } from '@/types/navigation';
import { showToast } from '@/utils/toastHelper';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import RenderHTML from 'react-native-render-html';
import RelatedProductsItem from './components/RelatedProductsItem';

const { width } = Dimensions.get('window');

const tagsStyles = {
  p: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 10,
  },
  h1: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  table: {
    width: '100%',
    marginVertical: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  th: {
    backgroundColor: '#3498db',
    padding: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#2980b9',
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  td: {
    padding: 12,
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    borderRightWidth: 1,
    borderRightColor: '#bdc3c7',
    borderBottomWidth: 1,
    borderBottomColor: '#bdc3c7',
    backgroundColor: '#fff',
    flex: 1,
    textAlign: 'left',
  },
  tr: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    width: '100%',
    borderBottomWidth: 0,
  },
  tbody: {
    backgroundColor: '#fff',
    width: '100%',
  },
  colgroup: {
    display: 'none',
  },
  col: {
    display: 'none',
  },
  strong: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  span: {
    fontSize: 14,
  },
  img: {
    width: '100%',
    height: 450,
    resizeMode: 'contain',
    marginVertical: 15,
  },
} as any;

export const ProductDetailScreen = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CatalogStackParamList, 'ProductDetail'>>();
  const [isFavorite, setIsFavorite] = useState(false);

  const { width: windowWidth } = useWindowDimensions();

  const { id } = route?.params?.product;
  const { data: productAll, isLoading } = useSingleProduct(id, i18n.language);
  const product = productAll?.data?.data;
  console.log('product', JSON.stringify(product, null, 2));

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 160,
      offset: 160 * index,
      index,
    }),
    [],
  );

  const renderProductDescription = useCallback(
    (htmlString: string) => (
      <RenderHTML
        contentWidth={windowWidth}
        tagsStyles={tagsStyles}
        source={{ html: htmlString }}
      />
    ),
    [windowWidth],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const progressValue = useSharedValue(0);

  const handleProgressChange = useCallback(
    (offsetProgress: number) => {
      progressValue.value = offsetProgress;
    },
    [progressValue],
  );
  const authUser = useAppSelector((state) => state.auth.user?.data || state.auth.user);
  const handleSnapToItem = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);
  const priceNum = Number(String(product?.price).replace(/\s/g, ''));
  const customerPriceNum = Number(String(product?.customer_price).replace(/\s/g, ''));

  const discountPercentage =
    priceNum > 0 && customerPriceNum > 0 && priceNum > customerPriceNum
      ? Math.round(((priceNum - customerPriceNum) / priceNum) * 100)
      : 0;
  const renderCarouselItem = useCallback(
    ({ item }: any) => (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',

          position: 'relative',
        }}
      >
        <Image source={{ uri: item }} style={styles.productImage} resizeMode="contain" />
        {discountPercentage > 0 && authUser?.vip > 0 && (
          <View style={styles.discountContainer}>
            <Text style={styles.discountText}>-{discountPercentage}%</Text>
          </View>
        )}
      </View>
    ),
    [discountPercentage, authUser?.vip],
  );

  const allImages = [
    product?.image,
    ...(Array.isArray(product?.foto_gallary) ? product.foto_gallary : []),
  ].filter(Boolean);

  const percentage_of_bonus =
    product?.percentage_of_bonus > 0 ? (customerPriceNum / 100) * product?.percentage_of_bonus : 0;
  const { mutate: exchangePrize } = usePrizesExchange();

  const [loadingItems, setLoadingItems] = useState<{ [key: number]: boolean }>({});
  const dispatch = useAppDispatch();

  const userBalance = authUser?.balance;

  const handleExchangePrize = (item: any) => {
    const hasEnoughBalance = userBalance && Number(userBalance) >= customerPriceNum;
    const hasVip = authUser?.vip && authUser?.vip > 0;

    if (!hasEnoughBalance) {
      showToast('error', t('commond.error'), t('commond.notEnoughBalance'));
      return;
    }

    if (!hasVip) {
      showToast('error', t('commond.error'), 'VIP status required');
      return;
    }

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
  };

  const canExchange =
    Number(userBalance) >= customerPriceNum &&
    customerPriceNum > 0 &&
    authUser?.vip > 0 &&
    !loadingItems[product?.id] &&
    userBalance !== undefined &&
    authUser?.vip !== undefined;

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <IsLoading />
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.carouselContainer}>
              <View style={styles.slideContainer}>
                {allImages.length > 1 ? (
                  <Carousel
                    loop
                    width={width}
                    height={250}
                    autoPlay={false}
                    data={allImages}
                    onProgressChange={handleProgressChange}
                    onSnapToItem={handleSnapToItem}
                    renderItem={renderCarouselItem}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',

                      position: 'relative',
                    }}
                  >
                    <Image
                      source={{ uri: allImages[0] }}
                      style={styles.productImage}
                      resizeMode="contain"
                    />
                    {discountPercentage > 0 && authUser?.vip > 0 && (
                      <View style={styles.discountContainer}>
                        <Text style={styles.discountText}>-{discountPercentage}%</Text>
                      </View>
                    )}
                  </View>
                )}
                {allImages.length > 1 ? (
                  <View style={styles.dotsContainer}>
                    {allImages?.map((_: any, index: React.Key | null | undefined) => (
                      <View
                        key={index}
                        style={[styles.dot, activeIndex === index && styles.activeDot]}
                      />
                    ))}
                  </View>
                ) : null}
              </View>
            </View>
            {product?.name && (
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product?.name}</Text>
              </View>
            )}
            {product?.vendor_code && (
              <View style={styles.productInfo}>
                <Text style={styles.vendor_code}>
                  <Text style={{ fontWeight: 'bold' }}>{t('homePage.vendor_code')}:</Text>{' '}
                  {product?.vendor_code}
                </Text>
              </View>
            )}
            {product?.country && (
              <View style={styles.productInfo}>
                <Text style={styles.vendor_code}>
                  <Text style={{ fontWeight: 'bold' }}>{t('katalog.manufacturer')}:</Text>{' '}
                  {product?.country}
                </Text>
              </View>
            )}
            {priceNum > 0 || customerPriceNum > 0 ? (
              <View style={styles.priceContainer}>
                {authUser?.vip > 0 ? (
                  <>
                    <View style={styles.priceContant}>
                      <Text style={[styles.vendor_code, { fontWeight: 'bold' }]}>
                        {t('katalog.retailPrice')}:
                      </Text>
                      <Text style={styles.priceOldText}>
                        {formatPrice(product?.price)} {t('homePage.currency')}
                      </Text>
                    </View>
                    <View style={styles.priceContant}>
                      <Text style={[styles.vendor_code, { fontWeight: 'bold' }]}>
                        {t('katalog.masterPrice')}:
                      </Text>
                      <Text style={styles.priceText}>
                        {formatPrice(product?.customer_price)} {t('homePage.currency')}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.priceContant}>
                    <Text style={[styles.vendor_code, { fontWeight: 'bold' }]}>
                      {t('katalog.masterPrice')}:
                    </Text>
                    <Text style={styles.priceText}>
                      {formatPrice(product?.price)} {t('homePage.currency')}
                    </Text>
                  </View>
                )}
              </View>
            ) : null}
            {percentage_of_bonus > 0 && authUser?.vip > 0 && (
              <View style={styles.cashbackContainer}>
                <Text style={[styles.vendor_code, { fontWeight: 'bold' }]}>
                  {t('katalog.cashback')}:
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    backgroundColor: '#eceef0',
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: '#1373e7',
                  }}
                >
                  <Text style={styles.cashbackValue}>
                    {formatPrice(percentage_of_bonus)} {t('homePage.currency')}
                  </Text>
                </View>
              </View>
            )}
            <View
              style={{
                paddingHorizontal: 16,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                marginVertical: 10,
              }}
            >
              <TouchableOpacity
                style={[
                  styles.cartButton,
                  {
                    backgroundColor: canExchange ? '#FF3B30' : '#d5d5d5',
                  },
                ]}
                onPress={() => handleExchangePrize(product)}
                disabled={!canExchange}
              >
                <Text style={styles.cartButtonText}>
                  {loadingItems[product?.id] ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    t('homePage.exchange')
                  )}
                </Text>
              </TouchableOpacity>
            </View>

            {product?.description && (
              <View style={styles.productInfo}>
                <Text style={styles.vendor_code}>
                  <Text style={{ fontWeight: 'bold' }}>{t('katalog.productDescription')}:</Text>
                </Text>
                {renderProductDescription(product?.description || '')}
              </View>
            )}
            {product?.related_products && (
              <View style={{ padding: 16 }}>
                <Text style={styles.compatibleBrandsTitle}>{t('similarProducts')}</Text>
                <FlatList
                  horizontal
                  data={product?.related_products}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  getItemLayout={getItemLayout}
                  style={{ paddingVertical: 5, paddingLeft: 10 }}
                  renderItem={({ item }) => (
                    <View style={{ marginRight: 10 }}>
                      <RelatedProductsItem item={item} />
                    </View>
                  )}
                />
              </View>
            )}

            {product?.brands && product?.brands.length > 0 && (
              <View style={styles.compatibleBrandsContainer}>
                <Text style={styles.compatibleBrandsTitle}>{t('fits')}:</Text>
                <FlatList
                  style={{ paddingVertical: 5, paddingLeft: 10 }}
                  horizontal
                  data={product?.brands || []}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  renderItem={({ item }) => (
                    <View style={styles.brandItem}>
                      <Image
                        source={{ uri: item?.image }}
                        style={styles.brandImage}
                        resizeMode="contain"
                      />
                    </View>
                  )}
                />
              </View>
            )}

            {product?.category_products && (
              <View style={{ padding: 16 }}>
                <Text style={styles.compatibleBrandsTitle}>{t('similarProducts')}</Text>
                <FlatList
                  horizontal
                  data={product?.category_products}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  getItemLayout={getItemLayout}
                  style={{ paddingVertical: 5, paddingLeft: 10 }}
                  renderItem={({ item }) => (
                    <View style={{ marginRight: 10 }}>
                      <ProductDetailItem item={item} />
                    </View>
                  )}
                />
              </View>
            )}

            <View style={{ height: 100 }} />
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  backButton: { padding: 8 },
  favoriteButton: { padding: 8 },
  carouselContainer: {
    backgroundColor: '#fff',

    marginBottom: 10,
  },
  slideContainer: {
    width: width,
    height: 250,
  },
  productImage: { width: '100%', height: '100%' },
  content: { flex: 1 },
  productInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textTransform: 'capitalize',
    marginTop: 20,
  },
  compatibleBrandsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  compatibleBrandsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  brandItem: {
    width: 120,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 6,
    backgroundColor: '#f5f5f5',
  },
  brandImage: { width: '90%', height: '90%' },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
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
  vendor_code: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  discountContainer: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopLeftRadius: 6,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F4D0F',
  },

  priceOld: {},
  priceOldText: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#434242',
    textDecorationColor: 'red',
  },
  priceContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 10,
  },
  priceContant: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cashbackContainer: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },

  cashbackValue: {
    fontSize: 14,
    color: '#1373e7',
    fontWeight: '600',
  },
  cartButton: {
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    minWidth: 135,
  },
  cartButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
