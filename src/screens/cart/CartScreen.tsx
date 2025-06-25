import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MainTabScreenProps } from '@/types/navigation';

type CartScreenProps = MainTabScreenProps<'Cart'>;

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: '3EGN4/12-0,55',
      price: 1573000,
      image: 'https://example.com/image.jpg', // Replace with actual image URL
      quantity: 3,
    },
  ]);

  const handleLocationSelect = () => {
    navigation.navigate('Branches', {
      onSelect: (location: string) => {
        setSelectedLocation(location);
      },
    });
  };

  const updateQuantity = (id: string, change: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item,
      ),
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Savat</Text>
        <View style={{ width: 24 }} />
      </View>
      <Text style={styles.locationTitle}>Qaysi do'kondan olib ketiladi?</Text>

      <TouchableOpacity style={styles.locationButton} onPress={handleLocationSelect}>
        <Ionicons name="location-outline" size={24} color="red" />
        <Text style={styles.locationButtonText}>{selectedLocation || 'Tanlash'}</Text>
      </TouchableOpacity>
      <ScrollView style={styles.content}>
        {cartItems.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>Narxi {formatPrice(item.price)}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, -1)}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => updateQuantity(item.id, 1)}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Jami:</Text>
          <Text style={styles.totalPrice}>{formatPrice(getTotalPrice())} so'm</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Buyurtmani rasmiylashtirish</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 16,
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  locationButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#374151',
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    backgroundColor: '#EF4444',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    position: 'absolute',
    bottom: 100,
    width: '100%',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CartScreen;
