import { queryClient } from '@/config/query';
import { ThemeProvider } from '@shopify/restyle';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import './src/i18n';
import RootNavigator from './src/navigation/RootNavigator';
import theme from './src/shared/theme/theme';
import { persistor, store } from './src/store';
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <PersistGate loading={null} persistor={persistor}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <SafeAreaProvider>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <RootNavigator />
              </SafeAreaProvider>
            </GestureHandlerRootView>
          </PersistGate>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
}
