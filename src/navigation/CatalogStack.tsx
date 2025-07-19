import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CatalogScreen from '@/screens/catalog/CatalogScreen';
import { EpaScreen } from '@/screens/catalog/EpaScreen';
import { SearchScreen } from '@/screens/catalog/SearchScreen';
import { ProductDetailScreen } from '@/screens/catalog/ProductDetailScreen';
import { Product } from '@/types/product';
import CatalogPraductScreen from '@/screens/catalog/CatalogPraductScreen';
import PrizesScreen from '@/screens/catalog/PrizesScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';

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
  PrizesScreen: undefined;
  CatalogPraductScreen: {
    subCatalogId: number;
    categoryId: number;
  };
};

const Stack = createNativeStackNavigator<CatalogStackParamList>();

export const CatalogStack = () => {
  return (
    <ErrorBoundary>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CatalogMain" component={CatalogScreen} />
        <Stack.Screen name="EPA" component={EpaScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="CatalogPraductScreen" component={CatalogPraductScreen} />
        <Stack.Screen name="PrizesScreen" component={PrizesScreen} />
      </Stack.Navigator>
    </ErrorBoundary>
  );
};
