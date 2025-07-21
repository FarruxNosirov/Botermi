import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

type StatusType = 'all' | 'waiting' | 'approved' | 'rejected';

interface StatusOption {
  id: StatusType;
  labelKey: string;
}

const OperationsFilterScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { t } = useTranslation();

  const currentSelectedStatus = route.params?.selectedStatus || 'all';
  const [selectedStatus, setSelectedStatus] = useState<StatusType>(currentSelectedStatus);

  const STATUS_OPTIONS: StatusOption[] = [
    { id: 'all', labelKey: 'all' },
    { id: 'waiting', labelKey: 'waiting' },
    { id: 'approved', labelKey: 'approved' },
    { id: 'rejected', labelKey: 'rejected' },
  ];

  const getStatusLabel = (status: StatusType) => {
    switch (status) {
      case 'all':
        return t('all');
      case 'waiting':
        return t('waiting');
      case 'approved':
        return t('approved');
      case 'rejected':
        return t('rejected');
      default:
        return t('all');
    }
  };

  const applyFilter = () => {
    const onApplyFilter = route.params?.onApplyFilter;
    if (onApplyFilter) {
      onApplyFilter(selectedStatus);
    }
    navigation.goBack();
  };

  const resetFilter = () => {
    setSelectedStatus('all');
  };

  const renderItem = ({ item }: { item: StatusOption }) => (
    <TouchableOpacity style={styles.option} onPress={() => setSelectedStatus(item.id)}>
      <View style={styles.radioButton}>
        {selectedStatus === item.id ? (
          <AntDesign name="checkcircle" size={20} color="#4CAF50" />
        ) : (
          <View style={styles.radioUnchecked} />
        )}
      </View>
      <Text style={styles.optionText}>{getStatusLabel(item.id)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('katalog.filter')}</Text>
        <TouchableOpacity onPress={resetFilter} style={styles.resetButton}>
          <AntDesign name="reload1" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{t('profilePage.status')}:</Text>
        <FlatList
          data={STATUS_OPTIONS}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
          <Text style={styles.applyButtonText}>{t('apply')}</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(100,100,100,0.1)',
    borderRadius: 10,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  resetButton: {
    padding: 10,
  },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
  },
  radioButton: { marginRight: 12 },
  radioUnchecked: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C0C0C0',
  },
  optionText: { fontSize: 16, color: '#333' },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OperationsFilterScreen;
