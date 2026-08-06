import { DEVICE_HEIGHT } from '@/constants/constants';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
type RenderNavigationViewProps = {
  t: any;
  drawerRef: any;
  brandsFromFilters: any;
  manufacturersFromFilters: any;
  renderBrandItem: any;
  renderManufacturerItem: any;
  brandKeyExtractor: any;
  manufacturerKeyExtractor: any;
  handleReset: any;
  transformedFilters: any;
  renderFilterItem: any;
};
const RenderNavigationView = ({
  t,
  drawerRef,
  brandsFromFilters,
  manufacturersFromFilters,
  renderBrandItem,
  renderManufacturerItem,
  brandKeyExtractor,
  manufacturerKeyExtractor,
  handleReset,
  transformedFilters,
  renderFilterItem,
}: RenderNavigationViewProps) => {
  const hasBrands = brandsFromFilters?.length > 0;
  const hasManufacturers = manufacturersFromFilters?.length > 0;
  const transformedFiltersMaxHeight =
    hasBrands && hasManufacturers ? DEVICE_HEIGHT / 3 : DEVICE_HEIGHT / 2;

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

      <ScrollView style={styles.filterSection}>
        {hasBrands ? (
          <View style={{ maxHeight: DEVICE_HEIGHT / 3, marginBottom: 10 }}>
            <Text style={styles.sectionTitle}>{t('brand')}</Text>
            <FlatList
              data={brandsFromFilters}
              showsVerticalScrollIndicator={false}
              renderItem={renderBrandItem}
              keyExtractor={brandKeyExtractor}
              nestedScrollEnabled
            />
          </View>
        ) : null}
        {hasManufacturers ? (
          <View style={{ maxHeight: DEVICE_HEIGHT / 3, marginBottom: 10 }}>
            <Text style={styles.sectionTitle}>{t('manufacturer')}</Text>
            <FlatList
              data={manufacturersFromFilters}
              showsVerticalScrollIndicator={false}
              renderItem={renderManufacturerItem}
              keyExtractor={manufacturerKeyExtractor}
              nestedScrollEnabled
            />
          </View>
        ) : null}

        {transformedFilters?.length > 0 ? (
          <ScrollView style={{ maxHeight: transformedFiltersMaxHeight }}>
            {transformedFilters?.map((filter: any) => (
              <View key={filter?.filter_name} style={{ marginTop: 10 }}>
                <Text style={styles.sectionTitle}>{filter?.filter_name}</Text>
                <FlatList
                  data={filter.data}
                  renderItem={renderFilterItem}
                  keyExtractor={(item) => item.id.toString()}
                  nestedScrollEnabled
                />
              </View>
            ))}
          </ScrollView>
        ) : null}
      </ScrollView>

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
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
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
  drawerFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
    paddingBottom: 50,
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
});
