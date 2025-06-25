import { useSingleProduct } from '@/hooks/querys';
import { CatalogStackParamList } from '@/types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useRef, useState, useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import IsLoading from '@/components/IsLoading';
import ProductDetailItem from '@/components/ProductDetailItem';

const { width } = Dimensions.get('window');

export const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<CatalogStackParamList, 'ProductDetail'>>();
  const [isFavorite, setIsFavorite] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const productListRef = useRef<FlatList>(null);
  const { width: windowWidth } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);

  const { id } = route?.params?.product;
  const { data: productAll, error, isLoading } = useSingleProduct(id);
  const product = productAll?.data?.data;

  const getItemLayout = (_: any, index: number) => ({
    length: 160, // approximate width + margin
    offset: 160 * index,
    index,
  });

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
  } as any;

  const renderProductTitle = (htmlString: string) => (
    <RenderHTML contentWidth={windowWidth} tagsStyles={tagsStyles} source={{ html: htmlString }} />
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
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>

          <View style={styles.carouselContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              style={styles.imageSlider}
            >
              <View style={styles.slideContainer}>
                <Image
                  source={{ uri: product?.image }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              </View>
            </ScrollView>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {product?.name && (
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product?.name}</Text>
              </View>
            )}

            <View style={{ paddingHorizontal: 16 }}>
              {renderProductTitle(product?.description || '')}
            </View>

            {product?.brands && product?.brands.length > 0 && (
              <View style={styles.compatibleBrandsContainer}>
                <Text style={styles.compatibleBrandsTitle}>Mos keladi</Text>
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
                <Text style={styles.compatibleBrandsTitle}>O'xshash mahsulotlar</Text>
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
  carouselContainer: { backgroundColor: '#fff' },
  imageSlider: { height: 200, backgroundColor: '#fff' },
  slideContainer: {
    width: width,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: { width: '100%', height: '100%' },
  content: { flex: 1 },
  productInfo: {
    padding: 16,
    backgroundColor: '#fff',
  },
  productName: {
    fontSize: 20,
    fontWeight: '500',
    color: '#333',
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
});
