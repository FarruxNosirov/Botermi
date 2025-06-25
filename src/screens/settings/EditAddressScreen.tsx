import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@/components/ui/Text';
import GoBackHeader from '@/components/GoBackHeader';
import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { TextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '@/navigation/SettingsNavigator';

type Region = (typeof regions)[number];
type Districts = typeof districts;

const regions = [
  'Toshkent shahri',
  'Toshkent viloyati',
  'Andijon viloyati',
  'Buxoro viloyati',
  "Farg'ona viloyati",
  'Jizzax viloyati',
  'Xorazm viloyati',
  'Namangan viloyati',
  'Navoiy viloyati',
  'Qashqadaryo viloyati',
  "Qoraqalpog'iston Respublikasi",
  'Samarqand viloyati',
  'Sirdaryo viloyati',
  'Surxondaryo viloyati',
] as const;

const districts = {
  'Samarqand viloyati': [
    "Bulung'ur tumani",
    'Ishtixon tumani',
    'Jomboy tumani',
    "Kattaqo'rg'on tumani",
    "Qo'shrabot tumani",
    'Narpay tumani',
    'Nurobod tumani',
    'Oqdaryo tumani',
    "Pastdarg'om tumani",
    'Paxtachi tumani',
    'Payariq tumani',
    'Samarqand tumani',
    'Toyloq tumani',
    'Urgut tumani',
  ],
} as const;

type ModalType = 'region' | 'district' | null;
type NavigationProp = NativeStackNavigationProp<SettingsStackParamList>;
export const EditAddressScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [modalType, setModalType] = useState<ModalType>(null);

  const handleSelect = (value: string) => {
    if (modalType === 'region') {
      setSelectedRegion(value as Region);
      setSelectedDistrict('');
    } else if (modalType === 'district') {
      setSelectedDistrict(value);
    }
    setModalType(null);
  };

  const handleSave = () => {
    // TODO: Implement save logic
    navigation.goBack();
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.item,
        ((modalType === 'region' && selectedRegion === item) ||
          (modalType === 'district' && selectedDistrict === item)) &&
          styles.selectedItem,
      ]}
      onPress={() => handleSelect(item)}
    >
      <Text
        style={[
          styles.itemText,
          ((modalType === 'region' && selectedRegion === item) ||
            (modalType === 'district' && selectedDistrict === item)) &&
            styles.selectedItemText,
        ]}
      >
        {item}
      </Text>
      {((modalType === 'region' && selectedRegion === item) ||
        (modalType === 'district' && selectedDistrict === item)) && (
        <Icon name="checkmark" size={24} color={colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader title="Yashash manzilingiz" />
      <View style={styles.content}>
        <Text style={styles.label}>Viloyat*</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setModalType('region')}>
          <Text style={styles.selectorText}>{selectedRegion || 'Viloyatni tanlang'}</Text>
          <Icon name="chevron-down-outline" size={24} color={colors.gray[400]} />
        </TouchableOpacity>

        <Text style={[styles.label, styles.districtLabel]}>Tuman / Shahar*</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setModalType('district')}
          disabled={!selectedRegion}
        >
          <Text style={styles.selectorText}>{selectedDistrict || 'Tumanni tanlang'}</Text>
          <Icon name="chevron-down-outline" size={24} color={colors.gray[400]} />
        </TouchableOpacity>

        <Text style={[styles.label, styles.districtLabel]}>
          MFY / Ko'cha / Uy raqami (Ixtiyoriy)
        </Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Manzilni kiriting"
          placeholderTextColor={colors.gray[400]}
        />

        <Modal
          visible={modalType !== null}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalType(null)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {modalType === 'region' ? 'Viloyatni tanlang' : 'Tumanni tanlang'}
                </Text>
                <TouchableOpacity
                  onPress={() => setModalType(null)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon name="close" size={24} color={colors.gray[400]} />
                </TouchableOpacity>
              </View>
              <FlatList
                data={
                  modalType === 'region'
                    ? regions
                    : selectedRegion && selectedRegion in districts
                      ? districts[selectedRegion as keyof Districts]
                      : []
                }
                renderItem={renderItem}
                keyExtractor={(item) => item}
                style={styles.list}
              />
            </View>
          </View>
        </Modal>
      </View>
      <Button
        title="Saqlash"
        onPress={handleSave}
        style={styles.button}
        disabled={!selectedRegion || !selectedDistrict}
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
  districtLabel: {
    marginTop: 16,
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
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: 16,
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
  list: {
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  selectedItem: {
    backgroundColor: colors.gray[200] + '20',
  },
  itemText: {
    fontSize: 16,
    color: colors.gray[900],
  },
  selectedItemText: {
    color: colors.primary,
    fontWeight: '500',
  },
});
