import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { usePraducts, usePraductsFirstCategoriesId } from '@/hooks/querys';
import { CatalogPraductItemType } from '@/types/catalogItem';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import { DrawerLayout } from 'react-native-gesture-handler';
import { CatalogStackParamList } from '@/navigation/CatalogStack';
import ManufacturerItem from '../components/ManufacturerItem';
import ProductDetailItem from '@/components/ProductDetailItem';
import BrandItem from '../components/BrandItem';
import FilterItem from '../components/FilterItem';

const FirstCatalogPraductScreenHook = () => {
  const transformFilters = (filters: any[]) => {
    if (!filters || !Array.isArray(filters)) return [];

    // Barcha filter itemlarni tekis ro'yxatga aylantirish
    const flatFilters: any[] = [];
    filters.forEach((filterGroup) => {
      if (Array.isArray(filterGroup)) {
        flatFilters.push(...filterGroup);
      }
    });

    // filter_name bo'yicha guruhlash
    const groupedFilters: { [key: string]: any[] } = {};
    flatFilters.forEach((filter) => {
      const filterName = filter.filter_name;
      if (!groupedFilters[filterName]) {
        groupedFilters[filterName] = [];
      }

      // Takrorlanishni oldini olish
      const exists = groupedFilters[filterName].some(
        (existingFilter) =>
          existingFilter.id === filter.id && existingFilter.title === filter.title,
      );

      if (!exists) {
        groupedFilters[filterName].push(filter);
      }
    });

    return Object.keys(groupedFilters).map((filterName) => ({
      filter_name: filterName,
      data: groupedFilters[filterName],
    }));
  };

  const navigation = useNavigation<NativeStackNavigationProp<CatalogStackParamList>>();
  const route = useRoute<RouteProp<CatalogStackParamList, 'FirstCatalogPraductScreen'>>();
  const firstCategoryId = route?.params?.categoryId;
  const [selectedBrand, setSelectedBrand] = useState<number | undefined>(undefined);
  const [selectedManufacturer, setSelectedManufacturer] = useState<number | undefined>(undefined);
  const [selectedFilters, setSelectedFilters] = useState<number | undefined>(undefined);
  const brandId = selectedBrand;
  const { i18n } = useTranslation();
  const manufacturerId = selectedManufacturer;
  const language = i18n.language;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    usePraductsFirstCategoriesId(
      firstCategoryId!,
      brandId,
      manufacturerId,
      selectedFilters,
      16,
      language,
    );

  const { t } = useTranslation();
  const drawerRef = useRef<DrawerLayout>(null);
  const isEndReachedCalled = useRef(false);

  const allProducts = useMemo(() => {
    if (!data?.pages) {
      console.log('FirstCatalog: No data pages');
      return [];
    }

    const products: CatalogPraductItemType[] = [];
    data.pages.forEach((page) => {
      if (page?.products?.data) {
        page.products.data.forEach((product: any) => {
          if (product && product.id && !products.some((p) => p.id === product.id)) {
            products.push(product);
          }
        });
      }
    });

    console.log('FirstCatalog allProducts length:', products.length);
    return products;
  }, [data?.pages]);

  const firstPageData = data?.pages?.[0];

  const transformedFilters = useMemo(() => {
    const result = transformFilters(firstPageData?.filters || []);
    return result;
  }, [firstPageData?.filters]);

  const brandsFromFilters = useMemo(() => {
    if (!firstPageData?.brands) return [];

    const uniqueBrands = firstPageData.brands.filter(
      (brand: any, index: number, self: any[]) =>
        brand && brand.id && self.findIndex((b: any) => b.id === brand.id) === index,
    );

    return uniqueBrands.map((brand: any) => ({
      id: brand.id,
      name: brand.name,
      image: brand.image,
    }));
  }, [firstPageData?.brands]);

  const manufacturersFromFilters = useMemo(() => {
    if (!firstPageData?.manufacturers) return [];
    const uniqueManufacturers = firstPageData.manufacturers.filter(
      (manufacturer: any, index: number, self: any[]) =>
        manufacturer &&
        manufacturer.id &&
        self.findIndex((m: any) => m.id === manufacturer.id) === index,
    );

    return uniqueManufacturers.map((manufacturer: any) => ({
      id: manufacturer.id,
      name: manufacturer.name,
      image: manufacturer.image,
    }));
  }, [firstPageData?.manufacturers]);

  const handleBrandSelect = useCallback((brandId: string) => {
    const brandIdNum = Number(brandId);
    setSelectedBrand((prev) => (prev === brandIdNum ? undefined : brandIdNum));
    drawerRef.current?.closeDrawer();
  }, []);

  const handleManufacturerSelect = useCallback((manufacturerId: string) => {
    const manufacturerIdNum = Number(manufacturerId);
    setSelectedManufacturer((prev) => (prev === manufacturerIdNum ? undefined : manufacturerIdNum));
    drawerRef.current?.closeDrawer();
  }, []);

  const handleReset = useCallback(() => {
    setSelectedBrand(undefined);
    setSelectedManufacturer(undefined);
    setSelectedFilters(undefined);
    drawerRef.current?.closeDrawer();
  }, []);

  const handleFilterSelect = useCallback((filterId: string) => {
    const filterIdNum = Number(filterId);
    setSelectedFilters((prev) => (prev === filterIdNum ? undefined : filterIdNum));
    drawerRef.current?.closeDrawer();
  }, []);

  const renderBrandItem = useCallback(
    ({ item }: { item: any }) => (
      <BrandItem brand={item} isSelected={selectedBrand === item.id} onSelect={handleBrandSelect} />
    ),
    [selectedBrand, handleBrandSelect],
  );

  const renderManufacturerItem = useCallback(
    ({ item }: { item: any }) => (
      <ManufacturerItem
        manufacturer={item}
        isSelected={selectedManufacturer === item.id}
        onSelect={handleManufacturerSelect}
      />
    ),
    [selectedManufacturer, handleManufacturerSelect],
  );

  const renderFilterItem = useCallback(
    ({ item }: { item: any }) => (
      <FilterItem
        filter={item}
        isSelected={selectedFilters === item.id}
        onSelect={handleFilterSelect}
      />
    ),
    [selectedFilters, handleFilterSelect],
  );

  const renderProductItem = useCallback(
    ({ item }: { item: any }) => <ProductDetailItem item={item} />,
    [],
  );

  const brandKeyExtractor = useCallback((item: any, index: number) => {
    if (!item) return `brand-empty-${index}`;
    return item.id ? String(item.id) : `brand-${index}`;
  }, []);

  const manufacturerKeyExtractor = useCallback((item: any, index: number) => {
    if (!item) return `manufacturer-empty-${index}`;
    return item.id ? String(item.id) : `manufacturer-${index}`;
  }, []);

  const productKeyExtractor = useCallback((item: any, index: number) => {
    if (!item) return `product-empty-${index}`;
    return item.id ? item.id.toString() : `product-${index}`;
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isEndReachedCalled.current) {
      isEndReachedCalled.current = true;
      fetchNextPage();

      // Reset flag after a delay
      setTimeout(() => {
        isEndReachedCalled.current = false;
      }, 3000);
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Reset flag when data changes
  useEffect(() => {
    isEndReachedCalled.current = false;
  }, [data?.pages]);

  return {
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
  };
};

export default FirstCatalogPraductScreenHook;
