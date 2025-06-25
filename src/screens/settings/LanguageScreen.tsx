import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@/components/ui/Text';
import { Header } from '@/components/Header';
import { Icon } from '@/components/ui/Icon';
import { colors } from '@/constants/colors';
import GoBackHeader from '@/components/GoBackHeader';

const languages = [
  { id: 'uz', title: "O'zbek tili", selected: true },
  { id: 'ru', title: 'Русский язык', selected: false },
];

export const LanguageScreen = () => {
  const navigation = useNavigation();

  const renderLanguageItem = ({ item }: { item: (typeof languages)[0] }) => (
    <TouchableOpacity style={styles.languageItem} activeOpacity={0.7}>
      <Text style={styles.languageText}>{item.title}</Text>
      {item.selected && <Icon name="checkmark" size={24} color={colors.primary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader title="Language" />
      <FlatList
        data={languages}
        renderItem={renderLanguageItem}
        keyExtractor={(item) => item.id}
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
