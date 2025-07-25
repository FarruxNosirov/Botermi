import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import i18n from '@/i18n';

const BASE_URL = 'https://administration.wottex.uz/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('No internet connection');
    }

    const token = await AsyncStorage.getItem('@auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('@auth_token');
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  loginWithSms: async (phone: string) => {
    const formData = new FormData();
    formData.append('phone', phone);
    const response = await api.post('/login-sms', formData, {});
    return response.data;
  },

  verifyCode: async (phone: string, code: string) => {
    const formData = new FormData();
    formData.append('phone', phone);
    formData.append('code', code);
    const response = await api.post('/verifyCode', formData, {});
    return response.data;
  },

  register: async (data: {}, id: number) => {
    const response = await api.patch(`/update/${id}`, data);
    return response.data;
  },
  getCities: async () => {
    const response = await api.get('/getCities');
    return response;
  },
};
export const getUserData = async () => {
  const token = await AsyncStorage.getItem('@auth_token');
  if (!token) {
    throw new Error('No token found');
  }
  const response = await api.get('/getMe');
  return response.data;
};

export const catalogAPI = {
  getCatalog: async () => {
    const response = await api.get('/getFirstCategories');
    return response.data;
  },
  getSubCategories: async (categoryId: number) => {
    const response = await api.get(`/filterSubCategory?category_id=${categoryId}`);
    return response.data;
  },
  getPraductsSubCategoriesId: async (
    subCategoryId: number,
    brandId?: number,
    manufacturerId?: number,
    selectedFilters?: number,
    page?: number,
    perPage?: number,
  ) => {
    const params: any = { sub_category_id: subCategoryId, page: page, perPage: perPage };
    if (brandId) params.brand_id = brandId;
    if (manufacturerId) params.manufacturer_id = manufacturerId;
    if (selectedFilters) params.filter_id = selectedFilters;
    const response = await api.get(`/filterProducts`, {
      params,
      headers: {
        'Accept-Language': i18n.language,
      },
    });
    return response.data;
  },

  getBrands: async () => {
    const response = await api.get('/getBrands');
    return response.data;
  },
  getManufacturers: async () => {
    const response = await api.get('/getManufacturers');
    return response.data;
  },
  getSingleProduct: async (praductId: number) => {
    const response = await api.get(`/getSingleProduct/${praductId}`, {
      headers: {
        'Accept-Language': i18n.language,
      },
    });
    return response;
  },
};
export const homeApi = {
  getBlogs: async () => {
    const response = await api.get('/getBlogs');
    return response;
  },
};
export const actionsApi = {
  scanBarcode: async (data: any) => {
    try {
      const response = await api.post('/scanBarcode', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response;
    } catch (error: any) {
      throw error;
    }
  },
  getBarCode: async (userId: number) => {
    try {
      const response = await api.get(`/users/${userId}/barcodes`);
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
export const prizesApi = {
  getPrizes: async () => {
    try {
      const response = await api.get('/prizes');
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  prizesExchange: async (prizeId: number) => {
    try {
      const response = await api.post(`/prizes/${prizeId}/exchange`);
      return response?.data?.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
export const getCities = async () => {
  try {
    const response = await api.get('/getCities');
    return response?.data?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
