import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI, getUserData } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  isFullyRegistered: boolean;
  isLoading: boolean;
  user: any | null;
  token: string | null;
  error: string | null;
  userExists: boolean | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isFullyRegistered: false,
  isLoading: false,
  user: null,
  token: null,
  error: null,
  userExists: null,
};

// PHONE yuborish (login-sms)
export const loginWithSms = createAsyncThunk(
  'auth/loginWithSms',
  async (phone: string, { rejectWithValue }) => {
    try {
      const response = await authAPI.loginWithSms(phone); // { user_exists: true/false }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Telefon yuborishda xatolik');
    }
  },
);

// KODni verify qilish
export const verifyCode = createAsyncThunk(
  'auth/verifyCode',
  async ({ phone, code }: { phone: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyCode(phone, code);
      console.log('response', JSON.stringify(response, null, 2));

      if (response?.token && response?.user) {
        await AsyncStorage.setItem('@auth_token', response.token);
        return {
          token: response.token,
          user: response.user,
        };
      } else {
        return rejectWithValue("Foydalanuvchi ma'lumotlari topilmadi");
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Kodni tekshirishda xatolik');
    }
  },
);

// Ro'yxatdan o'tish
export const register = createAsyncThunk(
  'auth/register',
  async ({ data, id }: { data: any; id: number }, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(data, id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Ro'yxatdan o'tishda xatolik");
    }
  },
);

// Me'ni olish (token bilan)
export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const response = await getUserData();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Foydalanuvchini olishda xatolik');
  }
});

const isUserFullyRegistered = (user: any): boolean => {
  console.log('Checking user registration status:', JSON.stringify(user, null, 2));

  // Agar user null yoki undefined bo'lsa
  if (!user) {
    console.log('User is null or undefined');
    return false;
  }

  // API dan qaytayotgan ma'lumotlar data obyekti ichida bo'lishi mumkin
  const userData = user.data || user;

  // Asosiy maydonlarni tekshirish
  const hasName = !!userData?.name && userData?.name !== 'Foydalanuvchi';
  const hasCity = !!userData?.city;
  const hasPhone = !!userData?.phone;

  console.log('User fields check:', {
    hasName,
    hasCity,
    hasPhone,
    name: userData?.name,
    city: userData?.city,
    phone: userData?.phone,
  });

  // Foydalanuvchi to'liq ro'yxatdan o'tgan deb hisoblanishi uchun:
  // 1. Telefon raqami bo'lishi kerak
  // 2. Ism to'ldirilgan bo'lishi kerak (va 'Foydalanuvchi' bo'lmasligi kerak)
  // 3. Shahar to'ldirilgan bo'lishi kerak
  const isFullyRegistered = hasPhone && hasName && hasCity;

  console.log('Is user fully registered:', isFullyRegistered);

  return isFullyRegistered;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
      state.isFullyRegistered = false;
      state.user = null;
      state.token = null;
      AsyncStorage.removeItem('@auth_token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithSms.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.userExists = null;
      })
      .addCase(loginWithSms.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userExists = action.payload.user_exists;
      })
      .addCase(loginWithSms.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // verifyCode
      .addCase(verifyCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyCode.fulfilled, (state, action) => {
        const user = action.payload.user;
        const token = action.payload.token;
        const isFull = isUserFullyRegistered(user);

        state.isLoading = false;
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        state.isFullyRegistered = isFull;
      })
      .addCase(verifyCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        const user = action.payload;
        const token = state.token;
        const isFull = isUserFullyRegistered(user);

        state.isLoading = false;
        state.user = user;
        state.isAuthenticated = true;
        state.isFullyRegistered = isFull;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // getMe
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        const user = action.payload;
        const isFull = isUserFullyRegistered(user);

        state.isLoading = false;
        state.user = user;
        state.isAuthenticated = true;
        state.isFullyRegistered = isFull;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.isFullyRegistered = false;
        state.user = null;
        state.token = null;
        AsyncStorage.removeItem('@auth_token');
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
