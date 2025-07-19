import GoBackHeader from '@/components/GoBackHeader';
import { Text } from '@/components/ui/Text';
import { colors } from '@/constants/colors';
import { useCities } from '@/hooks/querys';
import { SettingsStackParamList } from '@/navigation/SettingsNavigator';
import { useAppDispatch } from '@/store/hooks';
import { getMe, register } from '@/store/slices/authSlice';
import { UserDataType } from '@/types/userType';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { showToast } from '@/utils/toastHelper';

type NavigationProp = NativeStackNavigationProp<SettingsStackParamList>;

type FormValues = {
  name: string;
  surname: string;
  phone: string;
  region: string;
  date_of_birth: string;
};

export const EditProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const bottom = useSafeAreaInsets().bottom;
  const { t } = useTranslation();

  const [avatarUri, setAvatarUri] = useState<string | undefined>(undefined);
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      surname: '',
      phone: '',
      region: '',
      date_of_birth: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    (async () => {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      await ImagePicker.requestCameraPermissionsAsync();
    })();
  }, []);

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
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
      setValue('name', user?.name || '');
      setValue('surname', user?.surname || '');
      setValue('phone', user?.phone || '');
      setValue('region', user?.city || '');
      setValue('date_of_birth', user?.date_of_birth || '');
    }
  };

  useEffect(() => {
    handleGetMe();
  }, []);
  useEffect(() => {
    //@ts-ignore
    if (userData?.date_of_birth) {
      //@ts-ignore
      const [day, month, year] = userData?.date_of_birth.split('.');
      const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
      setSelectedDate(parsedDate);
    }
  }, [userData]);

  const onSubmit = async (data: FormValues) => {
    const city = regions?.find((item: { name: string }) => item.name === data.region);
    const newData = {
      name: data?.name,
      surname: data?.surname,
      phone: data?.phone,
      date_of_birth: data?.date_of_birth,
      city_id: city?.id || null,
    };

    const resultAction = await dispatch(
      register({
        data: newData,
        id: userData?.id || 0,
      }),
    );
    if (register.fulfilled.match(resultAction)) {
      showToast('success', t('success'), t('profileUpdated'));
    } else {
      showToast('error', t('error'), t('profileUpdateFailed'));
    }
    setTimeout(() => {
      navigation.goBack();
    }, 1000);
  };
  const watchedValues = useWatch({ control });
  const [isFormChanged, setIsFormChanged] = useState(false);
  useEffect(() => {
    if (!userData) return;

    const isChanged =
      watchedValues.name !== userData.name ||
      watchedValues.surname !== userData.surname ||
      watchedValues.phone !== userData.phone ||
      watchedValues.region !== userData.city ||
      watchedValues.date_of_birth !== userData?.date_of_birth;

    setIsFormChanged(isChanged);
  }, [watchedValues, userData]);

  const renderDatePickerIOS = (onChange: (value: string) => void) => (
    <Modal visible={showDatePicker} transparent={true} animationType="slide">
      <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('selectBirthDate')}</Text>
              <TouchableOpacity
                onPress={() => {
                  onChange(formatDate(selectedDate));
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.modalDone}>{t('done')}</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner"
              onChange={(event, date) => {
                if (date) setSelectedDate(date);
              }}
              style={{ backgroundColor: 'white' }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <GoBackHeader title="" style={{ borderBottomColor: '#fff', flex: 1 }} />
        <Text style={styles.headerTitle}>{t('profilePage.myProfile')}</Text>
        <View style={{ flex: 1 }} />
      </View>

      <ScrollView style={{ paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>{t('profilePage.name')}</Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} value={value} onChangeText={onChange} />
          )}
        />
        {errors.name && (
          <Text style={{ color: 'red', marginTop: -12, marginBottom: 12 }}>
            {errors.name.message || t('profilePage.nameIsRequired')}
          </Text>
        )}
        <Text style={styles.label}>{t('profilePage.surname')}</Text>
        <Controller
          control={control}
          name="surname"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} value={value} onChangeText={onChange} />
          )}
        />
        {errors.surname && (
          <Text style={{ color: 'red', marginTop: -12, marginBottom: 12 }}>
            {errors.surname.message || t('profilePage.surnameIsRequired')}
          </Text>
        )}

        <Text style={styles.label}>{t('profilePage.phoneNumber')}</Text>
        <Controller
          control={control}
          name="phone"
          rules={{ required: t('profilePage.phoneIsRequired') }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onChange}
              keyboardType="phone-pad"
            />
          )}
        />
        {errors.phone && (
          <Text style={{ color: 'red', marginTop: -12, marginBottom: 12 }}>
            {errors.phone.message}
          </Text>
        )}

        <Text style={styles.label}>{t('profilePage.province')}</Text>
        <Controller
          control={control}
          name="region"
          rules={{ required: t('profilePage.provinceIsRequired') }}
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
        {errors.region && (
          <Text style={{ color: 'red', marginTop: -12, marginBottom: 12 }}>
            {errors.region.message}
          </Text>
        )}

        <Text style={styles.label}>{t('birthDate')}</Text>
        <Controller
          control={control}
          rules={{ required: t('profilePage.dateOfBirthIsRequired') }}
          name="date_of_birth"
          render={({ field: { value, onChange } }) => (
            <>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.input}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    color: value ? '#000' : colors.gray[400],
                    fontSize: 16,
                    alignItems: 'center',
                  }}
                >
                  {value || t('selectBirthDate')}
                </Text>
              </TouchableOpacity>
              {Platform.OS === 'ios'
                ? renderDatePickerIOS(onChange)
                : showDatePicker && (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="default"
                      onChange={(event, date) => {
                        setShowDatePicker(false);
                        if (date) {
                          onChange(formatDate(date));
                          setSelectedDate(date);
                        }
                      }}
                      maximumDate={new Date()}
                      minimumDate={new Date(1900, 0, 1)}
                    />
                  )}
            </>
          )}
        />
        {errors.date_of_birth && (
          <Text style={{ color: 'red', marginTop: -12, marginBottom: 12 }}>
            {errors.date_of_birth.message || t('profilePage.dateOfBirthIsRequired')}
          </Text>
        )}

        <View style={styles.saveButtonContainer}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={[
              styles.saveButton,
              (!isFormChanged || !isValid) && { backgroundColor: colors.gray[300] },
            ]}
            disabled={!isFormChanged || !isValid}
          >
            <Text style={styles.saveButtonText}>{t('save')}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
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
    justifyContent: 'center',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  modalDone: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
