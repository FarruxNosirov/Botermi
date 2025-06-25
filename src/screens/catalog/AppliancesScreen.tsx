import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const categories = [
  {
    title: 'Maishiy texnika',
    subcategories: [
      'Muzlatgichlar',
      'Kir yuvish mashinalari',
      'Gaz plitalari',
      'Konditsionerlar',
      'Changyutgichlar',
      "Mikroto'lqinli pechlar",
      'Idish yuvish mashinalari',
      'Dazmollar',
      'Ventilyatorlar',
      'Isitgichlar',
      'Havo tozalagichlar',
      'Mini pechlar',
      'Blenderlar',
      'Multivarkalar',
    ],
  },
  {
    title: 'Telefonlar va gadjetlar',
    subcategories: [
      'Smartfonlar',
      'Planshetlar',
      'Noutbuklar',
      'Smartsoatlar',
      'Quloqchinlar',
      'Powerbank',
      'Simsiz quloqchinlar',
      'Quvvatlagichlar',
      'Himoya oynalari',
      "G'iloflar",
      'Xotira kartalari',
      'USB kabellar',
    ],
  },
  {
    title: 'Televizorlar, video va audio',
    subcategories: [
      'Televizorlar',
      'Proyektorlar',
      'Akustika tizimlari',
      'Media playerlar',
      'Uy kinoteatrlari',
      'Mikrofonlar',
      'Video registratorlar',
      'DVD playerlar',
      'TV kronshteynlar',
      'Antenna va resiverslar',
      'Ovoz kuchaytirgichlar',
      'Karaoke tizimlari',
    ],
  },
];

export const AppliancesScreen = () => {
  const navigation = useNavigation();
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const toggleCategory = (index: number) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Maishiy texnika</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Mahsulotlarni qidirish"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.content}>
        {categories.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <TouchableOpacity style={styles.categoryHeader} onPress={() => toggleCategory(index)}>
              <Text style={styles.categoryText}>{category.title}</Text>
              <Ionicons
                name={expandedCategory === index ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>

            {expandedCategory === index && (
              <ScrollView style={styles.subcategoriesList} nestedScrollEnabled={true}>
                {category.subcategories.map((subcategory, subIndex) => (
                  <TouchableOpacity key={subIndex} style={styles.subcategoryItem}>
                    <Text style={styles.subcategoryText}>{subcategory}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        ))}
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
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
  categoryText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  subcategoriesList: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    maxHeight: 8 * 52,
  },
  subcategoryItem: {
    padding: 16,
    paddingLeft: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  subcategoryText: {
    fontSize: 14,
    color: '#666',
  },
});
