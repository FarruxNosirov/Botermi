import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '@/navigation/SettingsNavigator';
import { Text } from '@/components/ui/Text';
import GoBackHeader from '@/components/GoBackHeader';
import { colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

type NavigationProp = NativeStackNavigationProp<SettingsStackParamList>;

export const EditBirthdayScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSave = () => {
    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader title="Tug'ilgan kun" onPress={handleSave} />
      <View style={styles.content}>
        <Text style={styles.label}>Tug'ilgan kuningizni tanlang</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setShow(true)}>
          <Text style={styles.selectorText}>{format(date, 'dd.MM.yyyy')}</Text>
        </TouchableOpacity>

        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
            maximumDate={new Date()}
          />
        )}
      </View>
      <Button title="Saqlash" onPress={handleSave} style={styles.button} />
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
});
