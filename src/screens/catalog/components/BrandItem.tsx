import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import { CatalogPraductItemType } from '@/types/catalogItem';

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

export default BrandItem;

const styles = StyleSheet.create({
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
});
