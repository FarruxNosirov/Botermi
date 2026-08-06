import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { NoInternetBanner } from './NoInternetBanner';

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const { isConnected, hasBeenConnected } = useNetworkStatus();

  return (
    <View style={styles.container}>
      {hasBeenConnected && isConnected === false && (
        <View style={styles.bannerContainer}>
          <NoInternetBanner />
        </View>
      )}

      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  content: {
    flex: 1,
  },
});
