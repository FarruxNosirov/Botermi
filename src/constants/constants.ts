import { Dimensions } from 'react-native';
import { Alert, Linking } from 'react-native';

export type UrlType = 'phone' | 'email' | 'web' | 'sms';

export interface OpenUrlOptions {
  onError?: (error: string) => void;
  confirmTitle?: string;
  confirmMessage?: string;
}
export const DEVICE_HEIGHT = Dimensions.get('window').height;
export const DEVICE_WIDTH = Dimensions.get('window').width;

export const formatBalance = (balance: number | undefined | null): string => {
  if (!balance) return '0';
  return balance?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const openUrl = async (
  url: string,
  type: UrlType = 'web',
  options: OpenUrlOptions = {},
): Promise<void> => {
  const { onError, confirmTitle, confirmMessage } = options;

  try {
    let formattedUrl = url;

    switch (type) {
      case 'phone':
        const cleanedPhone = url.replace(/[^+\d]/g, '');
        formattedUrl = `tel:${cleanedPhone}`;
        break;
      case 'email':
        formattedUrl = url.startsWith('mailto:') ? url : `mailto:${url}`;
        break;
      case 'sms':
        const cleanedSms = url.replace(/[^+\d]/g, '');
        formattedUrl = `sms:${cleanedSms}`;
        break;
      case 'web':
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          formattedUrl = `https://${url}`;
        }
        break;
    }

    const canOpen = await Linking.canOpenURL(formattedUrl);

    if (!canOpen) {
      const errorMessage = `Cannot open ${type} link: ${url}`;
      if (onError) {
        onError(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
      return;
    }

    if (confirmTitle && confirmMessage) {
      Alert.alert(confirmTitle, confirmMessage, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open',
          onPress: () => Linking.openURL(formattedUrl),
        },
      ]);
    } else {
      await Linking.openURL(formattedUrl);
    }
  } catch (error) {
    const errorMessage = `Failed to open ${type} link: ${error instanceof Error ? error.message : 'Unknown error'}`; // eslint-disable-line max-len

    if (onError) {
      onError(errorMessage);
    } else {
      Alert.alert('Error', errorMessage);
    }
  }
};
export const makePhoneCall = (phoneNumber: string, options?: OpenUrlOptions) => {
  return openUrl(phoneNumber, 'phone', options);
};
export const formatPrice = (price: number | string) => {
  const num = Number(String(price).replace(/\s/g, ''));
  if (isNaN(num) || num === 0) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};
