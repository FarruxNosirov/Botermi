import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { Product } from './product';
import { CompositeScreenProps } from '@react-navigation/native';
import { UserDataType } from './userType';

// Auth stack parameter list
export type AuthStackParamList = {
  Login: undefined;
  Registration: {
    phone: string;
    isRegistration?: boolean;
    token?: string;
    id?: number;
  };
  OTP: {
    phone: string;
    isRegistration?: boolean;
  };
  Agreement: {
    isRegistration: boolean;
  };
  Welcome: undefined;
};

// Main tab parameter list
export type MainTabParamList = {
  Home: undefined;
  Catalog: undefined;
  Actions: undefined;
  Operations: UserDataType;
  Cart: undefined;
  EPA: undefined;
  EPAMerch: undefined;
  Appliances: undefined;
  Profile: undefined;
};

// Drawer parameter list
export type DrawerParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  Settings: undefined;
  Favorites: undefined;
  Share: undefined;
  Support: undefined;
};

// Root stack parameter list
export type RootStackParamList = {
  Auth: { screen: keyof AuthStackParamList; params?: any };
  MainApp: undefined;
  Branches: undefined;
  Notifications: undefined;
  NotificationDetail: undefined;
  OperationsFilter: undefined;
};

// Navigation prop types
export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

export type AppDrawerScreenProps<T extends keyof DrawerParamList> = DrawerScreenProps<
  DrawerParamList,
  T
>;

// Utility type for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type CatalogStackParamList = {
  CatalogMain: undefined;
  EPA: undefined;
  Appliances: undefined;
  EpaMerch: undefined;
  ProductDetail: {
    product: Product;
  };
  Search: undefined;
};
export type HomeStackParamList = {
  HomeMain: undefined;
  Blogs: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  Profile: undefined;
  // ... other screens
};
