import { DEVICE_WIDTH } from '@/constants/constants';
import React, { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import type { CatalogStackParamList } from '../../navigation/CatalogStack';

import IsLoading from '@/components/IsLoading';
import { useBrands, useManufacturers, usePraducts } from '@/hooks/querys';
import { Product } from '@/types/product';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DrawerLayout } from 'react-native-gesture-handler';
import { CatalogPraductItemType, ManufacturerItemType } from '@/types/catalogItem';
import ProductDetailItem from '@/components/ProductDetailItem';

const { width } = Dimensions.get('window');

const BrandItem = ({
  brand,
  isSelected,
  onSelect,
}: {
  brand: CatalogPraductItemType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => (
  <TouchableOpacity style={styles.optionItem} onPress={() => onSelect(String(brand.id))}>
    <View style={styles.radioCircle}>
      {isSelected && <View style={styles.selectedRadioFill} />}
    </View>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '95%',
      }}
    >
      <Text style={styles.optionText}>{brand.name}</Text>
      <Image source={{ uri: brand.image }} style={styles.logo} resizeMode="contain" />
    </View>
  </TouchableOpacity>
);

const ManufacturerItem = ({
  manufacturer,
  isSelected,
  onSelect,
}: {
  manufacturer: ManufacturerItemType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => (
  <TouchableOpacity style={styles.optionItem} onPress={() => onSelect(String(manufacturer.id))}>
    <View style={styles.radioCircle}>
      {isSelected && <View style={styles.selectedRadioFill} />}
    </View>
    <View
      style={{
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text style={styles.optionText}>{manufacturer.name}</Text>
      <Image
        source={{ uri: manufacturer.image }}
        style={{ width: 100, height: 25 }}
        resizeMode="contain"
      />
    </View>
  </TouchableOpacity>
);

const CatalogPraductScreen = () => {
  const route = useRoute<RouteProp<CatalogStackParamList, 'CatalogPraductScreen'>>();
  const categoryId = route?.params?.categoryId;
  const { data, isLoading } = usePraducts(categoryId);
  const { data: brandData } = useBrands();
  const { data: manufacturersData } = useManufacturers();

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const drawerRef = useRef<DrawerLayout>(null);

  const navigation = useNavigation<NativeStackNavigationProp<CatalogStackParamList>>();

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
  const productCardWidth = DEVICE_WIDTH / 2 - 24;

  const renderProduct = ({ item }: { item: Product }) => {
    const planNameLength =
      item.name?.length && item.name?.length > 34 ? item.name?.slice(0, 40) + '...' : item.name;

    return (
      <TouchableOpacity
        style={[styles.productItem, { width: productCardWidth }]}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <View>
          <Image
            source={{ uri: item.image }}
            style={[styles.productImage, { width: productCardWidth - 30 }]}
            resizeMode="contain"
          />
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{planNameLength}</Text>
            <Text style={styles.brandName}>{item.brand}</Text>
            {item.bonus > 0 && <Text style={styles.bonusText}>{formatPrice(item.bonus)} so'm</Text>}
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{formatPrice(item.price)} so'm</Text>
          <TouchableOpacity style={styles.cartButton}>
            <Ionicons name="cart-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredProducts = useMemo(() => {
    if (!data?.products?.data) return [];
    let products: Product[] = data.products.data;

    if (selectedBrands.length > 0) {
      products = products.filter((product: Product) =>
        selectedBrands.includes(String(product.brand_id)),
      );
    }

    if (selectedManufacturers.length > 0) {
      products = products.filter((product: Product) =>
        selectedManufacturers.includes(String(product.manufacturer_id)),
      );
    }
    return products;
  }, [data?.products?.data, selectedBrands, selectedManufacturers]);

  const renderNavigationView = () => {
    const handleBrandSelect = (brandId: string) => {
      setSelectedBrands((prev) =>
        prev.includes(brandId) ? prev.filter((id) => id !== brandId) : [...prev, brandId],
      );
    };

    const handleManufacturerSelect = (manufacturerId: string) => {
      setSelectedManufacturers((prev) =>
        prev.includes(manufacturerId)
          ? prev.filter((id) => id !== manufacturerId)
          : [...prev, manufacturerId],
      );
    };

    const handleReset = () => {
      setSelectedBrands([]);
      setSelectedManufacturers([]);
      drawerRef.current?.closeDrawer();
    };

    return (
      <View style={[styles.drawerContainer]}>
        <View style={styles.drawerHeader}>
          <Text style={styles.drawerTitle}>Filtrlar</Text>
          <TouchableOpacity
            onPress={() => drawerRef.current?.closeDrawer()}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.filterSection}>
          <Text style={styles.sectionTitle}>Brend</Text>
          <FlatList
            data={brandData?.data}
            renderItem={({ item }) => (
              <BrandItem
                brand={item}
                isSelected={selectedBrands.includes(String(item.id))}
                onSelect={handleBrandSelect}
              />
            )}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
          />

          <Text style={styles.sectionTitle}>Ishlab chiqaruvchi</Text>
          <FlatList
            data={manufacturersData?.data}
            renderItem={({ item }) => (
              <ManufacturerItem
                manufacturer={item}
                isSelected={selectedManufacturers.includes(String(item.id))}
                onSelect={handleManufacturerSelect}
              />
            )}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
          />
        </ScrollView>

        <View style={styles.drawerFooter}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Сбросить</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <DrawerLayout
        ref={drawerRef}
        drawerWidth={width}
        drawerPosition={'right'}
        renderNavigationView={renderNavigationView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mahsulotlar</Text>
          <TouchableOpacity
            onPress={() => drawerRef.current?.openDrawer()}
            style={styles.filterButton}
          >
            <AntDesign name="filter" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <>
            {isLoading ? (
              <IsLoading />
            ) : (
              <FlatList
                data={filteredProducts || []}
                renderItem={(item) => <ProductDetailItem {...item} />}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainerStyle}
              />
            )}
          </>
          <View style={{ height: 100 }} />
        </ScrollView>
      </DrawerLayout>
    </SafeAreaView>
  );
};

export default CatalogPraductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },

  contentContainerStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  productItem: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
    height: 290,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  productImage: {
    height: 150,
    borderRadius: 8,
  },
  productDetails: {
    marginTop: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  brandName: {
    fontSize: 14,
    color: '#666',
  },
  bonusText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cartButton: {
    backgroundColor: '#FF3B30',
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    padding: 8,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    marginBottom: Platform.OS === 'ios' ? 20 : 70,
    paddingBottom: 20,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    padding: 5,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRadioFill: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
  drawerFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resetButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
    paddingHorizontal: 30,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
