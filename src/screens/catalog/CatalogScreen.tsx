import CatalogCard from '@/components/CatalogItem';
import { useGetFirstCategories, useGetSubCategories } from '@/hooks/querys';
import { catalogAPI } from '@/services/api';
import { CatalogStackParamList } from '@/navigation/CatalogStack';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IsLoading from '@/components/IsLoading';

export const CatalogScreen = () => {
  const navigation = useNavigation<NavigationProp<CatalogStackParamList>>();

  const handleEpamarketPress = () => {
    Linking.openURL('https://botermi.uz/');
  };
  const { t, i18n } = useTranslation();

  const { data, isLoading } = useGetFirstCategories(i18n.language);

  const navigationHandler = async (categoryId: number) => {
    try {
      const response = await catalogAPI.getSubCategories(categoryId, i18n.language);
      const hasSubCategories = response?.sub_categories?.length > 0;
      if (hasSubCategories) {
        navigation.navigate('EPA', { categoryId });
      } else {
        navigation.navigate('FirstCatalogPraductScreen', {
          categoryId: categoryId,
        });
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const keyExtractor = useCallback((item: any) => item.id.toString(), []);

  const filterData = useMemo(() => {
    if (!data?.data) return [];

    const validData = data.data.filter((item: any) => item && item.id);

    const sortedData = validData.sort((a: { id: number }, b: { id: number }) => a.id - b.id);
    return sortedData.filter((filter: { id: number }) => ![3, 4, 5].includes(filter?.id));
  }, [data?.data]);

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <IsLoading />
      ) : (
        <>
          <Text style={styles.header}>{t('katalog.title')}</Text>
          <FlatList
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10 }}
            data={filterData || []}
            keyExtractor={keyExtractor}
            renderItem={(item) => (
              <CatalogCard {...item} onPress={() => navigationHandler(item?.item?.id)} />
            )}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => navigation.navigate('PrizesScreen')}
                >
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemText}>{t('katalog.householdAppliances')}</Text>

                    <Ionicons name="tv-outline" size={28} color="#4B5563" />
                  </View>
                </TouchableOpacity>
                <View style={styles.epamarketSection}>
                  <Text style={styles.epamarketLabel}>{t('katalog.description')}</Text>
                  <TouchableOpacity style={styles.epamarketButton} onPress={handleEpamarketPress}>
                    <Text style={styles.epamarketButtonText}>botermi.uz</Text>
                    <Ionicons
                      name="cart-outline"
                      size={28}
                      color="#fff"
                      style={{ marginLeft: 8 }}
                    />
                  </TouchableOpacity>
                </View>
              </>
            }
          />
        </>
      )}

      {/* <View style={styles.content}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EPA')}>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>EPA</Text>
            <Ionicons name="construct-outline" size={28} color="#4B5563" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('EPAMerch')}>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>EPA Мерч</Text>
            <Ionicons name="shirt-outline" size={28} color="#4B5563" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Appliances')}>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Бытовая техника</Text>
            <Ionicons name="tv-outline" size={28} color="#4B5563" />
          </View>
        </TouchableOpacity>

        <View style={styles.epamarketSection}>
          <Text style={styles.epamarketLabel}>Перейти в интернет магазин</Text>
          <TouchableOpacity style={styles.epamarketButton} onPress={phandleEpamarketPress}>
            <Text style={styles.epamarketButtonText}>epamarket.uz</Text>
            <Ionicons name="cart-outline" size={28} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 16,
    marginVertical: 18,
    color: '#000',
  },
  content: {
    paddingHorizontal: 0,
    marginTop: 8,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '400',
    textTransform: 'uppercase',
  },
  epamarketSection: {
    marginTop: 16,
    marginBottom: 110,
  },
  epamarketLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  epamarketButton: {
    backgroundColor: '#E32F45',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  epamarketButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});

export default CatalogScreen;
