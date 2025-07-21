import { Dimensions } from 'react-native';

export const DEVICE_HEIGHT = Dimensions.get('window').height;
export const DEVICE_WIDTH = Dimensions.get('window').width;

export const formatBalance = (balance: number | undefined | null): string => {
  if (!balance) return '0';
  return balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
