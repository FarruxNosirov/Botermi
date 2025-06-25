import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CatalogScreen } from '@/screens/catalog/CatalogScreen';
import { EpaScreen } from '@/screens/catalog/EpaScreen';
import { AppliancesScreen } from '@/screens/catalog/AppliancesScreen';
import { SearchScreen } from '@/screens/catalog/SearchScreen';
import { ProductDetailScreen } from '@/screens/catalog/ProductDetailScreen';
import { Product } from '@/types/product';
import CatalogPraductScreen from '@/screens/catalog/CatalogPraductScreen';

export type CatalogStackParamList = {
  CatalogMain: undefined;
  EPA: {
    categoryId: number;
  };
  EPAMerch: undefined;
  Appliances: undefined;
  Search: undefined;
  ProductDetail: {
    product: Product;
  };
  CatalogPraductScreen: {
    subCatalogId: number;
    categoryId: number;
  };
};

const Stack = createNativeStackNavigator<CatalogStackParamList>();

export const CatalogStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CatalogMain" component={CatalogScreen} />
      <Stack.Screen name="EPA" component={EpaScreen} />
      <Stack.Screen name="Appliances" component={AppliancesScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="CatalogPraductScreen" component={CatalogPraductScreen} />
    </Stack.Navigator>
  );
};
