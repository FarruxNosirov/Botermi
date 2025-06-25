import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@/components/ui/Text';
import GoBackHeader from '@/components/GoBackHeader';
import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';

export const AddPhoneScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('+998');

  const handleAddPhone = () => {
    // TODO: Implement phone number validation and addition logic
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader title="Telefon raqam qo'shish" />
      <View style={styles.content}>
        <Text style={styles.label}>Yangi telefon raqamingiz</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholder="+998 __ ___ __ __"
          placeholderTextColor={colors.gray[400]}
        />
        <Button
          title="Qo'shish"
          onPress={handleAddPhone}
          style={styles.button}
          disabled={phoneNumber.length < 13}
        />
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
  label: {
    fontSize: 14,
    color: colors.gray[400],
    marginBottom: 8,
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
    marginTop: 16,
  },
});
