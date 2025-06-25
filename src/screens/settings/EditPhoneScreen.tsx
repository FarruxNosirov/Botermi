import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '@/navigation/SettingsNavigator';
import { Text } from '@/components/ui/Text';
import GoBackHeader from '@/components/GoBackHeader';
import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

type NavigationProp = NativeStackNavigationProp<SettingsStackParamList>;

type PhoneNumber = {
  id: string;
  number: string;
  isPrimary: boolean;
};

export const EditPhoneScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([
    {
      id: '1',
      number: '+998901039977',
      isPrimary: true,
    },
  ]);

  const handleAddPhone = () => {
    navigation.navigate('AddPhone');
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader title="Telefon raqamingiz" />
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Asosiy telefon raqam</Text>
        {phoneNumbers.map((phone) => (
          <View key={phone.id} style={styles.phoneItem}>
            <Text style={styles.phoneNumber}>{phone.number}</Text>
            {phone.isPrimary && <Icon name="checkmark-circle" size={24} color={colors.primary} />}
          </View>
        ))}

        <Text style={[styles.sectionTitle, styles.additionalTitle]}>
          Qo'shimcha telefon raqamlar
        </Text>
        <Text style={styles.noPhones}>Qo'shimcha telefon raqamlar mavjud emas</Text>

        <Button title="+ Qo'shish" onPress={handleAddPhone} style={styles.addButton} />
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
  sectionTitle: {
    fontSize: 14,
    color: colors.gray[400],
    marginBottom: 8,
  },
  additionalTitle: {
    marginTop: 24,
  },
  phoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  phoneNumber: {
    fontSize: 16,
    color: colors.gray[900],
  },
  noPhones: {
    fontSize: 16,
    color: colors.gray[400],
    marginTop: 8,
  },
  addButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
});
