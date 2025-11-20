import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';

interface NoInternetBannerProps {
  onRetry?: () => void;
}

export const NoInternetBanner: React.FC<NoInternetBannerProps> = ({ onRetry }) => {
  const { t } = useTranslation();

  const handleRetry = async () => {
    const state = await NetInfo.fetch();
    if (state.isConnected && onRetry) {
      onRetry();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="cloud-offline-outline" size={18} color="#fff" />
        <Text style={styles.text}>{t('noInternet')}</Text>
      </View>
      {onRetry && (
        <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
          <Ionicons name="refresh" size={18} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ff4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  retryButton: {
    padding: 4,
  },
});
