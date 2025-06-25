import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from '@/components/ui/Text';
import GoBackHeader from '@/components/GoBackHeader';
import { colors } from '@/constants/colors';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '@/navigation/SettingsNavigator';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Dropdown } from 'react-native-element-dropdown';

type NavigationProp = NativeStackNavigationProp<SettingsStackParamList>;

export const EditProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [region, setRegion] = useState('Samarqand vil.');
  const regions = [
    { label: 'Toshkent vil.', value: 'Toshkent vil.' },
    { label: 'Samarqand vil.', value: 'Samarqand vil.' },
    { label: 'Buxoro vil.', value: 'Buxoro vil.' },
    { label: 'Farg‘ona vil.', value: 'Farg‘ona vil.' },
    { label: 'Andijon vil.', value: 'Andijon vil.' },
    { label: 'Namangan vil.', value: 'Namangan vil.' },
    { label: 'Qashqadaryo vil.', value: 'Qashqadaryo vil.' },
    { label: 'Surxondaryo vil.', value: 'Surxondaryo vil.' },
    { label: 'Jizzax vil.', value: 'Jizzax vil.' },
    { label: 'Sirdaryo vil.', value: 'Sirdaryo vil.' },
    { label: 'Navoiy vil.', value: 'Navoiy vil.' },
    { label: 'Xorazm vil.', value: 'Xorazm vil.' },
    { label: 'Qoraqalpog‘iston R.', value: 'Qoraqalpog‘iston R.' },
  ];
  const districtMap: Record<string, { label: string; value: string }[]> = {
    'Toshkent vil.': [{ label: 'Chirchiq tumani', value: 'Chirchiq tumani' }],
    'Samarqand vil.': [{ label: 'Pastdarg‘om tumani', value: 'Pastdarg‘om tumani' }],
    'Buxoro vil.': [{ label: 'Vobkent tumani', value: 'Vobkent tumani' }],
    'Farg‘ona vil.': [{ label: 'Qo‘qon tumani', value: 'Qo‘qon tumani' }],
    'Andijon vil.': [{ label: 'Asaka tumani', value: 'Asaka tumani' }],
    'Namangan vil.': [{ label: 'Chust tumani', value: 'Chust tumani' }],
    'Qashqadaryo vil.': [{ label: 'Qarshi tumani', value: 'Qarshi tumani' }],
    'Surxondaryo vil.': [{ label: 'Termiz tumani', value: 'Termiz tumani' }],
    'Jizzax vil.': [{ label: 'Zomin tumani', value: 'Zomin tumani' }],
    'Sirdaryo vil.': [{ label: 'Guliston tumani', value: 'Guliston tumani' }],
    'Navoiy vil.': [{ label: 'Karmana tumani', value: 'Karmana tumani' }],
    'Xorazm vil.': [{ label: 'Urganch tumani', value: 'Urganch tumani' }],
    'Qoraqalpog‘iston R.': [{ label: 'Nukus tumani', value: 'Nukus tumani' }],
  };
  const [district, setDistrict] = useState('Pastdarg‘om tumani');
  const [fullName, setFullName] = useState('Nosirov Farrux');
  const [invitePhone, setInvitePhone] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [regionModalVisible, setRegionModalVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await ImagePicker.requestCameraPermissionsAsync();
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    navigation.goBack();
  };
  const bottom = useSafeAreaInsets().bottom;

  const handleImagePick = () => {
    Alert.alert(
      'Rasm tanlash',
      'Rasmni qayerdan tanlaysiz?',
      [
        { text: 'Galereyadan', onPress: pickImage },
        { text: 'Kameradan', onPress: takePhoto },
        { text: 'Bekor qilish', style: 'cancel' },
      ],
      { cancelable: true },
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 8,
          paddingTop: 8,
          paddingBottom: 12,
        }}
      >
        <GoBackHeader title="" style={{ borderBottomColor: '#fff', flex: 1 }} />
        <Text
          style={{ flex: 2, textAlign: 'center', fontSize: 20, fontWeight: '600', color: '#222' }}
        >
          Mening profilim
        </Text>
        <View style={{ flex: 1 }} />
      </View>
      <View style={{ alignItems: 'center', marginTop: 12, marginBottom: 24 }}>
        <View
          style={{
            position: 'relative',
            width: 80,
            height: 80,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
          ) : (
            <Ionicons name="person-circle-outline" size={80} color={colors.gray[200]} />
          )}
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 6,
              bottom: 6,
              backgroundColor: '#222',
              borderRadius: 16,
              width: 28,
              height: 28,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#fff',
            }}
            onPress={handleImagePick}
          >
            <Ionicons name="pencil" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={styles.label}>Viloyat</Text>
        <Dropdown
          style={{
            backgroundColor: colors.gray[100],
            borderRadius: 12,
            height: 48,
            paddingHorizontal: 16,
            borderWidth: 0,
            marginBottom: 18,
          }}
          containerStyle={{
            backgroundColor: '#fff',
            borderRadius: 12,
            elevation: 4,
            borderWidth: 0,
          }}
          data={regions}
          labelField="label"
          valueField="value"
          placeholder="Viloyatni tanlang"
          value={region}
          onChange={(item) => {
            setRegion(item.value);
            setDistrict(districtMap[item.value][0].value);
          }}
          itemTextStyle={{ fontSize: 16, color: colors.gray[900] }}
          selectedTextStyle={{ fontSize: 16, color: colors.primary, fontWeight: 'bold' }}
          placeholderStyle={{ color: colors.gray[400], fontSize: 16 }}
          activeColor={colors.gray[100]}
          renderRightIcon={() => (
            <Ionicons name="chevron-down-outline" size={20} color={colors.gray[400]} />
          )}
        />
        <Text style={[styles.label, { marginTop: 18 }]}>Tuman</Text>
        <Dropdown
          style={{
            backgroundColor: colors.gray[100],
            borderRadius: 12,
            height: 48,
            paddingHorizontal: 16,
            borderWidth: 0,
            marginBottom: 18,
          }}
          containerStyle={{
            backgroundColor: '#fff',
            borderRadius: 12,
            elevation: 4,
            borderWidth: 0,
          }}
          data={districtMap[region]}
          labelField="label"
          valueField="value"
          placeholder="Tuman tanlang"
          value={district}
          onChange={(item) => setDistrict(item.value)}
          itemTextStyle={{ fontSize: 16, color: colors.gray[900] }}
          selectedTextStyle={{ fontSize: 16, color: colors.primary, fontWeight: 'bold' }}
          placeholderStyle={{ color: colors.gray[400], fontSize: 16 }}
          activeColor={colors.gray[100]}
          renderRightIcon={() => (
            <Ionicons name="chevron-down-outline" size={20} color={colors.gray[400]} />
          )}
        />
        <Text style={[styles.label, { marginTop: 18 }]}>Familiya va Ism</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Familiya va ism"
          placeholderTextColor={colors.gray[400]}
        />
      </View>
      <View style={[styles.saveButtonContainer, { bottom: bottom + 60 }]}>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Saqlash</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  label: {
    fontSize: 15,
    color: colors.gray[900],
    marginBottom: 8,
    fontWeight: '400',
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 16,
    color: colors.gray[900],
  },
  input: {
    height: 48,
    borderWidth: 0,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.gray[900],
  },
  inviteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 12,
  },
  saveButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
