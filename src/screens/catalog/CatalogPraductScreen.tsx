import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AntDesign, Ionicons } from '@expo/vector-icons';
import { DrawerLayout } from 'react-native-gesture-handler';
import RenderNavigationView from './components/RenderNavigationView';
import CatalogPraductScreenHook from './model/CatalogPraductScreenHook';

const { width } = Dimensions.get('window');

const CatalogPraductScreen = () => {
  const {
    renderBrandItem,
    renderManufacturerItem,
    renderProductItem,
    brandKeyExtractor,
    manufacturerKeyExtractor,
    productKeyExtractor,
    handleEndReached,
    handleReset,
    brandsFromFilters,
    manufacturersFromFilters,
    isLoading,
    allProducts,
    drawerRef,
    navigation,
    route,
    t,
    transformedFilters,
    renderFilterItem,
    isFetchingNextPage,
    hasNextPage,
    error,
  } = CatalogPraductScreenHook();

  return (
    <SafeAreaView style={styles.container}>
      <DrawerLayout
        ref={drawerRef}
        drawerWidth={width}
        drawerPosition={'right'}
        renderNavigationView={() => (
          <RenderNavigationView
            t={t}
            drawerRef={drawerRef}
            brandsFromFilters={brandsFromFilters}
            manufacturersFromFilters={manufacturersFromFilters}
            renderBrandItem={renderBrandItem}
            renderManufacturerItem={renderManufacturerItem}
            brandKeyExtractor={brandKeyExtractor}
            manufacturerKeyExtractor={manufacturerKeyExtractor}
            handleReset={handleReset}
            transformedFilters={transformedFilters}
            renderFilterItem={renderFilterItem}
          />
        )}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
            <Text style={{ fontSize: 20, fontWeight: '600' }}>{t('back')}</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '40%',
              justifyContent: 'flex-start',
            }}
          >
            <Text style={styles.headerTitle}>{t('products')}</Text>
          </View>
          <TouchableOpacity
            onPress={() => drawerRef.current?.openDrawer()}
            style={styles.filterButton}
          >
            <AntDesign name="filter" size={20} color="black" />
          </TouchableOpacity>
        </View>

        <FlatList
          data={allProducts}
          renderItem={renderProductItem}
          keyExtractor={productKeyExtractor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => {
            if (error && allProducts.length === 0) {
              return (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: '#FF3B30', fontSize: 16, textAlign: 'center' }}>
                    {t('error.loadingFailed') || "Ma'lumotlarni yuklashda xatolik"}
                  </Text>
                  <TouchableOpacity
                    style={{
                      marginTop: 10,
                      padding: 10,
                      backgroundColor: '#FF3B30',
                      borderRadius: 8,
                    }}
                    onPress={() => {
                      navigation.goBack();
                    }}
                  >
                    <Text style={{ color: 'white' }}>{t('retry') || 'Qayta urinish'}</Text>
                  </TouchableOpacity>
                </View>
              );
            }

            if (isLoading && allProducts.length === 0) {
              return (
                <View style={styles.loading}>
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF3B30" />
                  </View>
                </View>
              );
            }

            if (isFetchingNextPage) {
              return (
                <View style={styles.loading}>
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#FF3B30" />
                  </View>
                </View>
              );
            }

            if (!hasNextPage && allProducts.length > 0) {
              return (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: '#666', fontSize: 14 }}></Text>
                </View>
              );
            }

            if (allProducts.length === 0 && !isLoading) {
              // Ma'lumot topilmadi
              return (
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <Text style={{ color: '#666', fontSize: 16, textAlign: 'center' }}>
                    {t('katalog.noProducts') || 'Hech qanday mahsulot topilmadi'}
                  </Text>
                </View>
              );
            }

            return null;
          }}
          ListFooterComponentStyle={{ paddingBottom: 100 }}
        />
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
  loading: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
