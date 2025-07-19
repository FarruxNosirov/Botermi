import { DEVICE_HEIGHT } from '@/constants/constants';
import { useBrands, useManufacturers } from '@/hooks/querys';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerLayout } from 'react-native-gesture-handler';
import BrandItem from './BrandItem';
import ManufacturerItem from './ManufacturerItem';

const RenderNavigationView = () => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);

  const { data: brandData } = useBrands();
  const { data: manufacturersData } = useManufacturers();
  const { t } = useTranslation();

  const drawerRef = useRef<DrawerLayout>(null);

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
        <Text style={styles.drawerTitle}>{t('filters')}</Text>
        <TouchableOpacity
          onPress={() => drawerRef.current?.closeDrawer()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <View style={{ height: DEVICE_HEIGHT / 3 }}>
          <Text style={styles.sectionTitle}>{t('brand')}</Text>
          <FlatList
            data={brandData?.data}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <BrandItem
                brand={item}
                isSelected={selectedBrands.includes(String(item.id))}
                onSelect={handleBrandSelect}
              />
            )}
            keyExtractor={(item) => String(item.id)}
          />
        </View>
        <View style={{ height: DEVICE_HEIGHT / 3, marginTop: 10 }}>
          <Text style={styles.sectionTitle}>{t('manufacturer')}</Text>
          <FlatList
            data={manufacturersData?.data}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <ManufacturerItem
                manufacturer={item}
                isSelected={selectedManufacturers.includes(String(item.id))}
                onSelect={handleManufacturerSelect}
              />
            )}
            keyExtractor={(item) => String(item.id)}
          />
        </View>
      </View>

      <View style={styles.drawerFooter}>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>{t('reset')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RenderNavigationView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    width: '30%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
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
  },
  sectionTitle: {
    fontSize: 20,
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
    width: 100,
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
