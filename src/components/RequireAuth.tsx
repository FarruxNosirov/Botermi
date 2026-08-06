import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { useTranslation } from 'react-i18next';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface RequireAuthProps {
  children: React.ReactNode;
  fallbackMessage?: string;
}

/**
 * Agar user login qilmagan bo'lsa, login qilish taklifi ko'rsatadi
 * Aks holda children'ni render qiladi
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({ children, fallbackMessage }) => {
  const { isAuthenticated, isFullyRegistered } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigation<NavigationProp>();
  const { t } = useTranslation();

  // Agar user login qilmagan yoki to'liq ro'yxatdan o'tmagan bo'lsa
  if (!isAuthenticated || !isFullyRegistered) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.icon}>🔒</Text>
          <Text style={styles.title}>{t('auth.loginRequired') || 'Kirish talab qilinadi'}</Text>
          <Text style={styles.message}>
            {fallbackMessage ||
              t('auth.loginRequiredMessage') ||
              'Ushbu funksiyadan foydalanish uchun tizimga kirishingiz kerak'}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Auth' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>{t('auth.login') || 'Kirish'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    maxWidth: 400,
    width: '100%',
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    minWidth: 200,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
