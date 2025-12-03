import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  getCities: async (language?: string) => {
    const response = await api.get('/getCities', {
      headers: {
        'Accept-Language': language,
      },
    });
    return response;
  },
};
export const getUserData = async () => {
  const token = await AsyncStorage.getItem('@auth_token');
  if (!token) {
    throw new Error('No token found');
  }
  const response = await api.get('/getMe', {
    headers: {
      'Accept-Language': i18n.language,
    },
  });
  return response.data.data;
};
export const profileApi = {
  deleteProfile: async (userId: number | string) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

export const catalogAPI = {
  getCatalog: async (language: string) => {
    const response = await api.get('/getFirstCategories', {
      headers: {
        'Accept-Language': language,
      },
    });
    return response.data;
  },
  getSubCategories: async (categoryId: number, language: string) => {
    const response = await api.get(`/filterSubCategory?category_id=${categoryId}`, {
      headers: {
        'Accept-Language': language,
      },
    });
    return response.data;
  },
  getSearchProducts: async (
    search: string,
    language?: string,
  ) => {
    const response = await api.get(`/searchProducts`, {
      params: { search },
      headers: {
        'Accept-Language': language,
      },
    });
    return response.data;
  },
  getPraductsSubCategoriesId: async (
    subCategoryId: number,
    brandId?: number,
    manufacturerId?: number,
    selectedFilters?: number,
    page?: number,
    perPage?: number,
    language?: string,
  ) => {
    const params: any = {
      sub_category_id: subCategoryId,
      page: page || 1,
      perPage: perPage || 16,
    };
    if (brandId) params.brand_id = brandId;
    if (manufacturerId) params.manufacturer_id = manufacturerId;
    if (selectedFilters) params.filter_id = selectedFilters;
    const response = await api.get(`/filterProducts`, {
      params,
      headers: {
        'Accept-Language': language,
      },
    });
    return response.data;
  },
  getPraductsFirstCategoriesId: async (
    firstCategoryId: number,
    brandId?: number,
    manufacturerId?: number,
    selectedFilters?: number,
    page?: number,
    perPage?: number,
    language?: string,
  ) => {
    const params: any = {
      first_category_id: firstCategoryId,
      page: page || 1,
      perPage: perPage || 16,
    };
    if (brandId) params.brand_id = brandId;
    if (manufacturerId) params.manufacturer_id = manufacturerId;
    if (selectedFilters) params.filter_id = selectedFilters;
    const response = await api.get(`/filterProducts`, {
      params,
      headers: {
        'Accept-Language': language,
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
  getSingleProduct: async (praductId: number, language?: string) => {
    const response = await api.get(`/getSingleProduct/${praductId}`, {
      headers: {
        'Accept-Language': language,
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
  getStatuses: async (userId: number) => {
    const response = await api.get(`/users/${userId}/stats`);
    return response?.data?.data;
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
  getBarCodeByBarcode: async (userId: number) => {
    try {
      const response = await api.get(`/users/${userId}/exchanges`);
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
  prizesExchange: async (product_id?: number, prize_id?: number, type?: string) => {
    try {
      const response = await api.post(`/prizes/exchange`, { product_id, prize_id, type });
      return response?.data?.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
export const getCities = async (language?: string) => {
  try {
    const response = await api.get('/getCities', {
      headers: {
        'Accept-Language': language,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getReviews = async (language?: string) => {
  try {
    const response = await api.get(`/getStaticText`, {
      headers: {
        'Accept-Language': language,
      },
    });
    return response?.data?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const notificationsApi = {
  getNotifications: async (userId: number) => {
    try {
      const response = await api.get(`/users/${userId}/notifications`);
      return response?.data?.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
