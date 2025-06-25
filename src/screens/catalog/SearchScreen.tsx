import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  bonus: number;
  image: string;
}

// Bu test uchun example ma'lumotlar, keyinchalik API dan keladi
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Shtativ ESH-120',
    brand: 'Bonus',
    price: 114400,
    bonus: 0,
    image: 'https://example.com/esh120.jpg',
  },
  {
    id: '2',
    name: 'EVN-7BR',
    brand: 'Bonus',
    price: 3289000,
    bonus: 89700,
    image: 'https://example.com/evn7br.jpg',
  },
  {
    id: '3',
    name: 'EOM-25-1',
    brand: 'Bonus',
    price: 3146000,
    bonus: 85800,
    image: 'https://example.com/eom251.jpg',
  },
  {
    id: '4',
    name: 'EVN-130-4',
    brand: 'Bonus',
    price: 786500,
    bonus: 21450,
    image: 'https://example.com/evn1304.jpg',
  },
  {
    id: '5',
    name: 'EASH-18-5, 18 B',
    brand: 'Bonus',
    price: 1144000,
    bonus: 31200,
    image: 'https://example.com/eash185.jpg',
  },
  {
    id: '6',
    name: 'EMSH-180-4',
    brand: 'Bonus',
    price: 715000,
    bonus: 19500,
    image: 'https://example.com/emsh1804.jpg',
  },
];

export const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts([]);
    } else {
      const filtered = mockProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery]);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      {/* <Image
        source={{ uri: item.image }}
        style={styles.productImage}
        defaultSource={require('../../assets/images/placeholder.png')}
      /> */}
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.brandName}>{item.brand}</Text>
        {item.bonus > 0 && <Text style={styles.bonusText}>{formatPrice(item.bonus)} so'm</Text>}
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>{formatPrice(item.price)} so'm</Text>
        <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="cart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Mahsulotlarni qidirish"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        style={styles.productList}
        contentContainerStyle={styles.productListContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
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
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  productList: {
    flex: 1,
  },
  productListContent: {
    padding: 16,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  brandName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bonusText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cartButton: {
    backgroundColor: '#FF3B30',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
