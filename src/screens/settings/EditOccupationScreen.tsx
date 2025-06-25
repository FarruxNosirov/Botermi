import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@/components/ui/Text';
import GoBackHeader from '@/components/GoBackHeader';
import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

const occupations = [
  'Payvandlovchi',
  'Elektrik',
  'Santexnik',
  'Duradgor',
  'Quruvchi',
  'Haydovchi',
  'Boshqa',
];

export const EditOccupationScreen = () => {
  const navigation = useNavigation();
  const [selectedOccupation, setSelectedOccupation] = useState('Payvandlovchi');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSelect = (occupation: string) => {
    setSelectedOccupation(occupation);
    setIsModalVisible(false);
  };

  const handleSave = () => {
    // TODO: Implement save logic
    navigation.goBack();
  };

  const renderOccupationItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.occupationItem, selectedOccupation === item && styles.selectedOccupation]}
      onPress={() => handleSelect(item)}
    >
      <Text
        style={[
          styles.occupationText,
          selectedOccupation === item && styles.selectedOccupationText,
        ]}
      >
        {item}
      </Text>
      {selectedOccupation === item && <Icon name="checkmark" size={24} color={colors.primary} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader title="Kasbingiz" />
      <View style={styles.content}>
        <Text style={styles.label}>Kasbingizni tanlang</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.selectorText}>{selectedOccupation}</Text>
          <Icon name="chevron-down-outline" size={24} color={colors.gray[400]} />
        </TouchableOpacity>

        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Kasbni tanlang</Text>
                <TouchableOpacity
                  onPress={() => setIsModalVisible(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon name="close" size={24} color={colors.gray[400]} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={occupations}
                renderItem={renderOccupationItem}
                keyExtractor={(item) => item}
                style={styles.occupationsList}
              />
            </View>
          </View>
        </Modal>
      </View>
      <Button
        title="Saqlash"
        onPress={handleSave}
        style={styles.button}
        disabled={!selectedOccupation}
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
  label: {
    fontSize: 14,
    color: colors.gray[400],
    marginBottom: 8,
  },
  selector: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorText: {
    fontSize: 16,
    color: colors.gray[900],
  },
  button: {
    margin: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[900],
  },
  occupationsList: {
    paddingHorizontal: 16,
  },
  occupationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  selectedOccupation: {
    backgroundColor: colors.gray[200] + '20',
  },
  occupationText: {
    fontSize: 16,
    color: colors.gray[900],
  },
  selectedOccupationText: {
    color: colors.primary,
    fontWeight: '500',
  },
});
