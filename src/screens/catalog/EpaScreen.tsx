import EmptyState from '@/components/EmptyState';
import IsLoading from '@/components/IsLoading';
import { useGetSubCategories } from '@/hooks/querys';
import { CatalogItemType } from '@/types/catalogItem';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { CatalogStackParamList } from '../../navigation/CatalogStack';

export const EpaScreen = () => {
  const route = useRoute<RouteProp<CatalogStackParamList, 'EPA'>>();
  const { t, i18n } = useTranslation();
  const categoryId = route?.params?.categoryId;
  const { data, isLoading } = useGetSubCategories(categoryId);
  const navigation = useNavigation<NativeStackNavigationProp<CatalogStackParamList>>();
  const [searchText, setSearchText] = useState('');
  const filteredCategories = data?.sub_categories.filter((category: CatalogItemType) =>
    category?.name?.toLowerCase().includes(searchText.toLowerCase()),
  );
  const animation = useRef<LottieView>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
          <Text style={styles.headerTitle}>{t('back')}</Text>
        </TouchableOpacity>
      </View>
      <>
        {isLoading ? (
          <IsLoading />
        ) : (
          <>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={t('searchProducts')}
                placeholderTextColor="#666"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
            {filteredCategories && filteredCategories.length > 0 ? (
              <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {filteredCategories?.map((category: CatalogItemType, index: number) => {
                  const clearText = category.slug.replace(/-/g, ' ');
                  return (
                    <View key={index} style={styles.categoryContainer}>
                      <TouchableOpacity
                        style={styles.categoryHeader}
                        onPress={() =>
                          navigation.navigate('CatalogPraductScreen', {
                            subCatalogId: category?.category_id,
                            categoryId: category?.id,
                          })
                        }
                      >
                        <View style={styles.categoryTitleContainer}>
                          <View style={styles.iconContainer}>
                            <Image
                              source={{ uri: category?.image }}
                              resizeMode="contain"
                              style={{ width: 40, height: 40 }}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.categoryText}>
                              {i18n.language === 'uz' ? clearText : category?.name}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
                <View style={{ height: 100 }} />
              </ScrollView>
            ) : (
              <EmptyState />
            )}
          </>
        )}
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    flexDirection: 'row',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    justifyContent: 'center',
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    paddingHorizontal: 16,
  },
  categoryContainer: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  subcategoriesList: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    maxHeight: 8 * 52,
  },
  subcategoryItem: {
    padding: 16,
    paddingLeft: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  subcategoryText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 20,
    textAlign: 'center',
  },
});
