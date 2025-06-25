import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { Text } from '@/components/ui/Text';
import GoBackHeader from '@/components/GoBackHeader';
import { colors } from '@/constants/colors';
import { Icon } from '@/components/ui/Icon';
import { AppDrawerScreenProps } from '@/types/navigation';

type SupportScreenProps = AppDrawerScreenProps<'Support'>;

const SUPPORT_PHONE = '+998 95 400 04 00';
const TELEGRAM_URL = '';

export const SupportScreen: React.FC<SupportScreenProps> = () => {
  const handlePhonePress = () => {
    Linking.openURL(`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`);
  };

  const handleTelegramPress = () => {
    Linking.openURL(TELEGRAM_URL);
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader title="Qo'llab-quvvatlash markazi" />
      <View style={styles.content}>
        <TouchableOpacity style={styles.option}>
          <Icon name="paper-plane-outline" size={24} color={colors.gray[900]} />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>Telegram orqali yozing</Text>
          </View>
          <Icon name="chevron-forward-outline" size={24} color={colors.gray[400]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={handlePhonePress}>
          <Icon name="call-outline" size={24} color={colors.gray[900]} />
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>{SUPPORT_PHONE}</Text>
            <Text style={styles.optionSubtitle}>Qo'llab-quvvatlash raqami</Text>
          </View>
          <Icon name="chevron-forward-outline" size={24} color={colors.gray[400]} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    color: colors.gray[900],
  },
  optionSubtitle: {
    fontSize: 14,
    color: colors.gray[400],
    marginTop: 2,
  },
});
