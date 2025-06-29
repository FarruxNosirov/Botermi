import React, { useState, useTransition } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const STATUS_OPTIONS = ['Hammasi', "Ko'rilmoqda", 'Tasdiqlangan', 'Rad etilgan', 'Ishlatilgan'];

const OperationsFilterScreen = () => {
  const navigation = useNavigation();
  const [selectedStatus, setSelectedStatus] = useState('Hammasi');
  const { t } = useTranslation();

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.option} onPress={() => setSelectedStatus(item)}>
      <View style={styles.radioButton}>
        {selectedStatus === item ? (
          <AntDesign name="checkcircle" size={20} color="green" />
        ) : (
          <View style={styles.radioUnchecked} />
        )}
      </View>
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('katalog.filter')}</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{t('profilePage.status')}:</Text>
        <FlatList
          data={STATUS_OPTIONS}
          keyExtractor={(item) => item}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(100,100,100,0.1)',
    borderRadius: 10,
    marginLeft: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  rightPlaceholder: { width: 44 },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  option: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  radioButton: { marginRight: 10 },
  radioUnchecked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C0C0C0',
  },
  optionText: { fontSize: 16, color: '#333' },
});

export default OperationsFilterScreen;
