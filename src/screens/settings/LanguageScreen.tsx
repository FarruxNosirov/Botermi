import GoBackHeader from '@/components/GoBackHeader';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { useAppDispatch } from '@/store/hooks';
import { setLanguage } from '@/store/slices/languageSlice';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

export const LanguageScreen = () => {
  const { i18n, t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const handleLanguageSelect = (lang: any) => {
    dispatch(setLanguage(lang.code));
    navigation.goBack();
  };
  const languages = [
    { code: 'uz', title: "O'zbek tili", selected: i18n.language === 'uz' },
    { code: 'ru', title: 'Русский язык', selected: i18n.language === 'ru' },
  ];

  const renderLanguageItem = ({ item }: { item: (typeof languages)[0] }) => (
    <TouchableOpacity
      style={styles.languageItem}
      activeOpacity={0.7}
      onPress={() => handleLanguageSelect(item)}
    >
      <Text style={styles.languageText}>{item.title}</Text>
      {item.selected && <Icon name="checkmark" size={24} color={colors.primary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader title={t('profilePage.language')} />
      <FlatList
        data={languages}
        renderItem={renderLanguageItem}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.content}
      />
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
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  languageText: {
    fontSize: 16,
    color: colors.gray[900],
  },
});
