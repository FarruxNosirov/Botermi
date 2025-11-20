import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [hasBeenConnected, setHasBeenConnected] = useState(false);

  useEffect(() => {
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        setHasBeenConnected(true);
      }
    });

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        setHasBeenConnected(true);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    isConnected,
    hasBeenConnected,
  };
};
