import { DEVICE_WIDTH, formatPrice } from '@/constants/constants';
import { CatalogStackParamList } from '@/navigation/CatalogStack';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

const RelatedProductsItem = ({ item }: { item: any }) => {
  const navigation = useNavigation<NativeStackNavigationProp<CatalogStackParamList>>();
  const productCardWidth = DEVICE_WIDTH / 2 - 24;

  const priceNum = Number(String(item?.price).replace(/\s/g, ''));

  const { t } = useTranslation();

  const allImages = [
    item?.image,
    ...(Array.isArray(item?.foto_gallary) ? item.foto_gallary : []),
  ].filter(Boolean);

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <View style={[styles.productItem, { width: productCardWidth - 15 }]}>
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: allImages[0] || item?.image }}
            style={[styles.productImage, { width: productCardWidth - 30 }]}
            resizeMode="contain"
          />
        </View>
        <View style={styles.priceContainer}>
          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Text style={styles.priceText}>{item?.country}</Text>
            {priceNum > 0 && (
              <Text style={styles.priceText}>
                {formatPrice(item?.price)} {t('homePage.currency')}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RelatedProductsItem;

const styles = StyleSheet.create({
  productItem: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 7,
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    backgroundColor: '#fff',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    // Android shadow
    elevation: 6,
  },
  productImage: {
    height: 100,
    borderRadius: 8,
  },
  priceContainer: {
    gap: 7,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
});
