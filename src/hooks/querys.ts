// useCatalog.ts
import { actionsApi, authAPI, catalogAPI, getCities, homeApi, prizesApi } from '@/services/api';
import { useMutation, useQuery, useInfiniteQuery } from './useQuery';

export const useGetFirstCategories = () => {
  return useQuery({
    queryKey: ['getFirstCategories'],
    queryFn: catalogAPI.getCatalog,
  });
};
export const useGetSubCategories = (categoryId: number) => {
  return useQuery({
    queryKey: ['getSubCategories', categoryId],
    queryFn: () => catalogAPI.getSubCategories(categoryId),
  });
};
export const usePraducts = (
  subCategoryId: number,
  brandId?: number,
  manufacturerId?: number,
  selectedFilters?: number,
  perPage: number = 16,
) => {
  return useInfiniteQuery({
    queryKey: [
      'getPraductsSubCategoriesId',
      subCategoryId,
      brandId,
      manufacturerId,
      selectedFilters,
      perPage,
    ],
    queryFn: ({ pageParam = 1 }) =>
      catalogAPI.getPraductsSubCategoriesId(
        subCategoryId,
        brandId,
        manufacturerId,
        selectedFilters,
        pageParam,
        perPage,
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
export const useCities = () => {
  return useQuery({
    queryKey: ['getCities'],
    queryFn: authAPI.getCities,
  });
};
export const useManufacturers = () => {
  return useQuery({
    queryKey: ['getManufacturers'],
    queryFn: catalogAPI.getManufacturers,
  });
};
export const useSingleProduct = (praductId: any) => {
  return useQuery({
    queryKey: ['getSingleProduct', praductId],
    queryFn: () => catalogAPI.getSingleProduct(praductId),
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
export const usePrizes = () => {
  return useQuery({
    queryKey: ['getPrizes'],
    queryFn: () => prizesApi.getPrizes(),
  });
};
export const usePrizesExchange = () => {
  return useMutation({
    mutationFn: (prizeId: number) => prizesApi.prizesExchange(prizeId),
  });
};
export const useGetCities = () => {
  return useQuery({
    queryKey: ['getCities'],
    queryFn: () => getCities(),
  });
};
