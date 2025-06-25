import GoBackHeader from '@/components/GoBackHeader';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { CatalogStackParamList } from '@/navigation/CatalogStack';
import { AppDrawerScreenProps } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

type FavoritesScreenProps = AppDrawerScreenProps<'Favorites'>;

type FavoriteProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: number;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  bonus: number;
};

const mockFavorites: FavoriteProduct[] = [
  {
    id: '1',
    name: '3EGN4/12-0,55',
    description: 'Elektr nasos',
    price: 850000,
    image: require(''),
    category: 'Nasoslar',
    brand: 'EPA',
    rating: 4.5,
    reviews: 12,
    inStock: true,
    bonus: 42900,
  },
];

export const FavoritesScreen: React.FC<FavoritesScreenProps> = () => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>(mockFavorites);
  const navigation = useNavigation<NativeStackNavigationProp<CatalogStackParamList>>();

  const handleDelete = (id: string) => {
    Alert.alert("O'chirish", 'Ushbu mahsulotni sevimlilardan olib tashlamoqchimisiz?', [
      {
        text: 'Bekor qilish',
        style: 'cancel',
      },
      {
        text: "O'chirish",
        style: 'destructive',
        onPress: () => {
          setFavorites(favorites.filter((item) => item.id !== id));
        },
      },
    ]);
  };

  const handleProductPress = (product: FavoriteProduct) => {
    navigation.navigate('ProductDetail', { product });
  };

  const renderItem = ({ item }: { item: FavoriteProduct }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.7}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.productImage} />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <View style={styles.bonusContainer}>
          <Text style={styles.bonusLabel}>Bonus:</Text>
          <Text style={styles.bonusAmount}>{item.bonus.toLocaleString()}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon name="trash-outline" size={24} color={colors.red[500]} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader title="Sevimlilar" />
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="heart-outline" size={64} color={colors.gray[400]} />
          <Text style={styles.emptyText}>Sevimli mahsulotlar mavjud emas</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 12,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    color: colors.gray[900],
    marginBottom: 4,
  },
  bonusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bonusLabel: {
    fontSize: 14,
    color: colors.gray[400],
    marginRight: 4,
  },
  bonusAmount: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray[400],
    textAlign: 'center',
    marginTop: 16,
  },
});
