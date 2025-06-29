// useCatalog.ts
import { authAPI, catalogAPI, homeApi } from '@/services/api';
import { useQuery } from './useQuery';

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
export const usePraducts = (subCategoryId: number, brandId?: number, manufacturerId?: number) => {
  return useQuery({
    queryKey: ['getPraductsSubCategoriesId', subCategoryId, brandId, manufacturerId],
    queryFn: () => catalogAPI.getPraductsSubCategoriesId(subCategoryId, brandId, manufacturerId),
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
