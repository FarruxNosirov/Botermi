import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';

interface NoInternetScreenProps {
  onRetry: () => void;
}

export const NoInternetScreen: React.FC<NoInternetScreenProps> = ({ onRetry }) => {
  const { t } = useTranslation();
  const [isChecking, setIsChecking] = useState(false);

  const handleRetry = async () => {
    setIsChecking(true);
    const state = await NetInfo.fetch();

    if (state.isConnected) {
      onRetry();
    } else {
      // Still no internet - show feedback
      setTimeout(() => setIsChecking(false), 1000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="cloud-offline" size={80} color="#ccc" style={styles.icon} />

        <Text style={styles.title}>{t('noInternetTitle')}</Text>
        <Text style={styles.subtitle}>{t('noInternetMessage')}</Text>

        <TouchableOpacity
          style={[styles.retryButton, isChecking && styles.retryButtonDisabled]}
          onPress={handleRetry}
          disabled={isChecking}
        >
          {isChecking ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.retryButtonText}>{t('retry')}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
  },
  retryButtonDisabled: {
    backgroundColor: '#ccc',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
