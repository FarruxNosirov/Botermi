import GoBackHeader from '@/components/GoBackHeader';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { useCities } from '@/hooks/querys';
import { SettingsStackParamList } from '@/navigation/SettingsNavigator';
import { useAppDispatch } from '@/store/hooks';
import { getMe } from '@/store/slices/authSlice';
import { UserDataType } from '@/types/userType';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type NavigationProp = NativeStackNavigationProp<SettingsStackParamList>;

type FormValues = {
  fullName: string;
  phone: string;
  profession: string;
  region: string;
  birthDate: string;
};

export const EditProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const bottom = useSafeAreaInsets().bottom;
  const { t } = useTranslation();

  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [userData, setUserData] = useState<UserDataType | null>(null);
  console.log('userData', JSON.stringify(userData, null, 2));

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: '',
      phone: '',
      profession: '',
      region: '',
      birthDate: '',
    },
  });

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

  const handleImagePick = () => {
    Alert.alert(
      t('imageSelection'),
      t('whereDoYouChoosePicture'),
      [
        { text: t('fromgGallery'), onPress: pickImage },
        { text: t('fromCamera'), onPress: takePhoto },
        { text: t('cancel'), style: 'cancel' },
      ],
      { cancelable: true },
    );
  };

  const { data } = useCities();
  const regions = data?.data?.data;
  const regionDropdownData = useMemo(() => {
    if (!regions) return [];
    return regions.map((region: { id: any; name: any }) => ({
      label: region.name,
      value: region.name,
    }));
  }, [regions]);

  const handleGetMe = async () => {
    const resultAction = await dispatch(getMe());
    if (getMe.fulfilled.match(resultAction)) {
      const user = resultAction?.payload?.data;
      setUserData(user);
      setValue('fullName', `${user?.surname || ''} ${user?.name || ''}`);
      setValue('phone', user?.phone || '');
      setValue('profession', user?.positions?.[0]?.name || '');
      setValue('region', user?.city || '');
      setValue('birthDate', user?.birth_date || '');
    } else {
      console.log('Xatolik:', resultAction.payload);
    }
  };

  useEffect(() => {
    handleGetMe();
  }, []);

  const onSubmit = (data: FormValues) => {
    console.log('Form data:', data);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <GoBackHeader title="" style={{ borderBottomColor: '#fff', flex: 1 }} />
        <Text style={styles.headerTitle}>{t('profilePage.myProfile')}</Text>
        <View style={{ flex: 1 }} />
      </View>

      <View style={styles.avatarWrapper}>
        <View style={styles.avatarContainer}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={80} color={colors.gray[200]} />
          )}
          <TouchableOpacity style={styles.avatarEditButton} onPress={handleImagePick}>
            <Ionicons name="pencil" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>{t('profilePage.lastNameAndFirstName')}</Text>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} value={value} onChangeText={onChange} />
          )}
        />

        <Text style={styles.label}>{t('profilePage.phoneNumber')}</Text>
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              keyboardType="phone-pad"
            />
          )}
        />

        <Text style={styles.label}>{t('profilePage.profession')}</Text>
        <Controller
          control={control}
          name="profession"
          render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} value={value} onChangeText={onChange} />
          )}
        />

        <Text style={styles.label}>{t('profilePage.province')}</Text>
        <Controller
          control={control}
          name="region"
          render={({ field: { onChange, value } }) => (
            <Dropdown
              style={styles.input}
              data={regionDropdownData}
              labelField="label"
              valueField="value"
              value={value}
              onChange={(item) => onChange(item.value)}
              placeholder={t('profilePage.selectRegion')}
              maxHeight={250}
              renderRightIcon={() => (
                <Ionicons name="chevron-down-outline" size={20} color={colors.gray[400]} />
              )}
            />
          )}
        />

        <Text style={styles.label}>{t('birthDate')}</Text>
        <Controller
          control={control}
          name="birthDate"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              placeholder="YYYY-MM-DD"
            />
          )}
        />

        <View style={[styles.saveButtonContainer, { height: 140 }]}>
          <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>{t('save')}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    flex: 2,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },
  avatarWrapper: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarEditButton: {
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
  },
  label: {
    fontSize: 15,
    color: colors.gray[900],
    marginBottom: 8,
    fontWeight: '400',
  },
  input: {
    height: 48,
    borderWidth: 0,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.gray[900],
    marginBottom: 18,
  },
  saveButtonContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    marginTop: 16,
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
