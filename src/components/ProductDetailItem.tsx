import { DEVICE_WIDTH } from '@/constants/constants';
import { CatalogStackParamList } from '@/navigation/CatalogStack';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProductDetailItem = ({ item }: { item: any }) => {
  const navigation = useNavigation<NativeStackNavigationProp<CatalogStackParamList>>();
  const productCardWidth = DEVICE_WIDTH / 2 - 24;
  const planNameLength =
    item.name?.length && item.name?.length > 34 ? item.name?.slice(0, 40) + '...' : item.name;
  const formatPrice = (price: number | string) => {
    const num = Number(String(price).replace(/\s/g, ''));
    if (isNaN(num) || num === 0) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
  const priceNum = Number(String(item?.price).replace(/\s/g, ''));
  const customerPriceNum = Number(String(item?.customer_price).replace(/\s/g, ''));
  const { t } = useTranslation();
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
          {item.bonus > 0 && (
            <Text style={styles.bonusText}>
              {formatPrice(item.bonus)} {t('homePage.currency')}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.priceContainer}>
        {priceNum > 0 || customerPriceNum > 0 ? (
          <>
            <View>
              <Text style={styles.priceText}>
                {formatPrice(item?.price)} {t('homePage.currency')}
              </Text>
            </View>
            <View style={styles.priceOld}>
              <Text style={styles.priceOldText}>
                {formatPrice(item?.customer_price)} {t('homePage.currency')}
              </Text>
            </View>
          </>
        ) : null}

        {/* <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="cart-outline" size={20} color="#fff" />
        </TouchableOpacity> */}
      </View>
    </TouchableOpacity>
  );
};

export default ProductDetailItem;

const styles = StyleSheet.create({
  productItem: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
    height: 300,
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
  priceContainer: {},
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F4D0F',
  },
  cartButton: {
    backgroundColor: '#FF3B30',
    width: 35,
    height: 35,
    borderRadius: 20,
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
});
