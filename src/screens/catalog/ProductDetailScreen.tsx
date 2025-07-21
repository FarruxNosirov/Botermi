import IsLoading from '@/components/IsLoading';
import ProductDetailItem from '@/components/ProductDetailItem';
import { useSingleProduct } from '@/hooks/querys';
import { CatalogStackParamList } from '@/types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
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

const { width } = Dimensions.get('window');

// tagsStyles'ni component tashqarisiga chiqardik - performance uchun
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
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CatalogStackParamList, 'ProductDetail'>>();
  const [isFavorite, setIsFavorite] = useState(false);

  const { width: windowWidth } = useWindowDimensions();

  const { id } = route?.params?.product;
  const { data: productAll, error, isLoading } = useSingleProduct(id);
  const product = productAll?.data?.data;

  // getItemLayout'ni useCallback bilan optimize qildik
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: 160,
      offset: 160 * index,
      index,
    }),
    [],
  );

  // renderProductDescription'ni useCallback bilan optimize qildik
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

  const { t, i18n } = useTranslation();

  const [activeIndex, setActiveIndex] = useState(0);
  const progressValue = useSharedValue(0);

  // clearText'ni useMemo bilan optimize qildik
  const clearText = useMemo(() => product?.slug?.replace(/-/g, ' '), [product?.slug]);

  // Carousel funksiyalarini optimize qildik
  const handleProgressChange = useCallback(
    (offsetProgress: number) => {
      progressValue.value = offsetProgress;
    },
    [progressValue],
  );

  const handleSnapToItem = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Carousel renderItem'ni optimize qildik
  const renderCarouselItem = useCallback(
    ({ item }: any) => (
      <Image source={{ uri: item }} style={styles.productImage} resizeMode="contain" />
    ),
    [],
  );
  const allImages = [product?.image, ...(product?.foto_gallary || [])].filter(Boolean);

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

          <View style={styles.carouselContainer}>
            <View style={styles.slideContainer}>
              {product?.foto_gallary.length > 1 ? (
                <Carousel
                  loop
                  width={width}
                  height={200}
                  autoPlay={true}
                  data={allImages}
                  scrollAnimationDuration={1500}
                  onProgressChange={handleProgressChange}
                  onSnapToItem={handleSnapToItem}
                  renderItem={renderCarouselItem}
                />
              ) : (
                <Image
                  source={{ uri: allImages[0] }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
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

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {product?.name && (
              <View style={styles.productInfo}>
                <Text style={styles.productName}>
                  {i18n.language === 'uz' ? clearText : product?.name}
                </Text>
              </View>
            )}
            <View style={styles.productInfo}>
              <Text style={styles.vendor_code}>
                <Text style={{ fontWeight: 'bold' }}>Sotuv kodi:</Text> {product?.vendor_code}
              </Text>
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.vendor_code}>
                <Text style={{ fontWeight: 'bold' }}>Ishlab chiqaruvchi:</Text> {product?.country}
              </Text>
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.vendor_code}>
                <Text style={{ fontWeight: 'bold' }}>Mahsulot haqida qisqacha:</Text>
              </Text>
              {renderProductDescription(product?.description || '')}
            </View>

            {product?.brands && product?.brands.length > 0 && (
              <View style={styles.compatibleBrandsContainer}>
                <Text style={styles.compatibleBrandsTitle}>{t('fits')}</Text>
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
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: { padding: 8 },
  favoriteButton: { padding: 8 },
  carouselContainer: {
    backgroundColor: '#fff',
    shadowColor: '#cacaca',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 10,
  },
  slideContainer: {
    width: width,
    height: 230,
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
    textTransform: 'uppercase',
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
});
