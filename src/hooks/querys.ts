// useCatalog.ts
import {
  actionsApi,
  authAPI,
  catalogAPI,
  getCities,
  getReviews,
  getUserData,
  homeApi,
  notificationsApi,
  prizesApi,
  profileApi,
} from '@/services/api';
import { useMutation, useQuery, useInfiniteQuery } from './useQuery';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '@/store/slices/authSlice';
import { useDispatch } from 'react-redux';

export const useGetFirstCategories = (language: string) => {
  return useQuery({
    queryKey: ['getFirstCategories', language],
    queryFn: () => catalogAPI.getCatalog(language),
    enabled: !!language && language.length > 0,
  });
};
export const useGetSubCategories = (categoryId: number, language: string) => {
  return useQuery({
    queryKey: ['getSubCategories', categoryId, language],
    queryFn: () => catalogAPI.getSubCategories(categoryId, language),
    enabled: !!categoryId && !!language && categoryId > 0,
  });
};
export const useGetSearchProducts = (search: string, language: string) => {
  return useQuery({
    queryKey: ['getSearchProducts', search, language],
    queryFn: () => catalogAPI.getSearchProducts(search, language),
    enabled: !!search && !!language && search.length > 0,
  });
};
export const usePraducts = (
  subCategoryId: number,
  brandId?: number,
  manufacturerId?: number,
  selectedFilters?: number,
  perPage?: number,
  language?: string,
) => {
  return useInfiniteQuery({
    queryKey: [
      'getPraductsSubCategoriesId',
      subCategoryId,
      brandId,
      manufacturerId,
      selectedFilters,
      perPage,
      language,
    ],
    queryFn: ({ pageParam = 1 }) =>
      catalogAPI.getPraductsSubCategoriesId(
        subCategoryId,
        brandId,
        manufacturerId,
        selectedFilters,
        pageParam,
        perPage,
        language,
      ),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.products?.meta?.current_page || 1;
      const lastPageNum = lastPage.products?.meta?.last_page || 1;
      return currentPage < lastPageNum ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
export const usePraductsFirstCategoriesId = (
  firstCategoryId: number,
  brandId?: number,
  manufacturerId?: number,
  selectedFilters?: number,
  perPage?: number,
  language?: string,
) => {
  return useInfiniteQuery({
    queryKey: [
      'getPraductsFirstCategoriesId',
      firstCategoryId,
      brandId,
      manufacturerId,
      selectedFilters,
      perPage,
      language,
    ],
    queryFn: ({ pageParam = 1 }) =>
      catalogAPI.getPraductsFirstCategoriesId(
        firstCategoryId,
        brandId,
        manufacturerId,
        selectedFilters,
        pageParam,
        perPage,
        language,
      ),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.products?.meta?.current_page || 1;
      const lastPageNum = lastPage.products?.meta?.last_page || 1;
      return currentPage < lastPageNum ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useBrands = () => {
  return useQuery({
    queryKey: ['getFirstBrands'],
    queryFn: catalogAPI.getBrands,
  });
};
export const useCities = (language?: string) => {
  return useQuery({
    queryKey: ['getCities', language],
    queryFn: () => authAPI.getCities(language),
    enabled: !!language,
  });
};
export const useManufacturers = () => {
  return useQuery({
    queryKey: ['getManufacturers'],
    queryFn: catalogAPI.getManufacturers,
  });
};
export const useSingleProduct = (praductId: any, language?: string) => {
  return useQuery({
    queryKey: ['getSingleProduct', praductId, language],
    queryFn: () => catalogAPI.getSingleProduct(praductId, language),
    enabled: !!praductId && !!language && praductId > 0,
  });
};
export const useBlogs = () => {
  return useQuery({
    queryKey: ['getBlogs'],
    queryFn: () => homeApi.getBlogs(),
  });
};

export const useScanBarcode = () => {
  return useMutation({
    mutationFn: (data: any) => actionsApi.scanBarcode(data),
  });
};
export const useBarcodeAll = (userId: number) => {
  return useQuery({
    queryKey: ['getBarCode'],
    queryFn: () => actionsApi.getBarCode(userId),
    enabled: !!userId,
  });
};
export const useBarcodeByBarcode = (userId: number) => {
  return useQuery({
    queryKey: ['getBarCodeByBarcode'],
    queryFn: () => actionsApi.getBarCodeByBarcode(userId),
    enabled: !!userId,
  });
};
export const usePrizes = () => {
  return useQuery({
    queryKey: ['getPrizes'],
    queryFn: () => prizesApi.getPrizes(),
  });
};
export const usePrizesExchange = () => {
  return useMutation({
    mutationFn: (data: { product_id?: number; type?: string; prize_id?: number }) => {
      console.log('data', JSON.stringify(data, null, 2));
      return prizesApi.prizesExchange(data.product_id, data.prize_id, data.type);
    },
  });
};
export const useGetCities = (language?: string) => {
  return useQuery({
    queryKey: ['getCities', language],
    queryFn: () => getCities(language),
    enabled: !!language,
  });
};
export const useGetStatuses = (userId: number) => {
  return useQuery({
    queryKey: ['getStatuses', userId],
    queryFn: () => homeApi.getStatuses(userId),
    enabled: !!userId,
  });
};
export const useDeleteProfile = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (userId: number | string) => profileApi.deleteProfile(userId),
    onSuccess: (data) => {
      AsyncStorage.removeItem('@auth_token');
      dispatch(logout());
    },
    onError: (error) => {
      console.log(error);
    },
  });
};
export const useGetMe = () => {
  return useQuery({
    queryKey: ['getMe'],
    queryFn: () => getUserData(),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
};

export const useGetReviews = (language?: string) => {
  return useQuery({
    queryKey: ['getReviews', language],
    queryFn: () => getReviews(language),
    enabled: !!language,
  });
};

export const useGetNotifications = (userId: number) => {
  return useQuery({
    queryKey: ['getNotifications', userId],
    queryFn: () => notificationsApi.getNotifications(userId),
    enabled: !!userId,
  });
};
