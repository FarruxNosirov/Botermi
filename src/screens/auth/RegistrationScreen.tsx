import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { useCities } from '@/hooks/querys';
import { AppDispatch } from '@/store';
import { register } from '@/store/slices/authSlice';
import { AuthStackParamList, RootStackParamList } from '@/types/navigation';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  FlatList,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch } from 'react-redux';

const { height } = Dimensions.get('window');

type FormData = {
  firstName: string;
  lastName: string;
  birthDate: string;
  region: string;
  phone: string;
};

type FieldType = {
  key: keyof FormData;
  label: string;
  value: string;
  type?: 'text' | 'select';
  placeholder?: string;
  multiline?: boolean;
};

type Step = {
  title: string;
  fields: FieldType[];
};

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

type SelectPickerProps = {
  visible: boolean;
  title: string;
  items: string[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  onClose: () => void;
};

const SelectPicker: React.FC<SelectPickerProps> = ({
  visible,
  title,
  items,
  selectedValue,
  onValueChange,
  onClose,
}) => {
  if (!visible) return null;

  return (
    <>
      <Pressable style={styles.overlay} onPress={onClose} />
      <View style={styles.bottomSheet}>
        <Text style={styles.pickerTitle}>{title}</Text>
        <ScrollView style={styles.optionsList}>
          {items.map((item) => (
            <Pressable
              key={item}
              style={styles.optionItem}
              onPress={() => {
                onValueChange(item);
                onClose();
              }}
            >
              <Text style={styles.optionText}>{item}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList & RootStackParamList>;
};

export const RegistrationScreen = ({ navigation }: Props) => {
  const route = useRoute<RouteProp<AuthStackParamList, 'Registration'>>();
  const { data } = useCities();

  const regions = data?.data?.data;

  const regionDropdownData = useMemo(() => {
    if (!regions) return [];
    return regions.map((region: { id: any; name: any }) => ({
      label: region.name,
      value: region.id,
    }));
  }, [regions]);

  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    birthDate: '',
    region: '',
    phone: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(1990, 0, 1));
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const steps: Step[] = [
    {
      title: t('personalInformation'),
      fields: [
        { key: 'firstName', label: t('firstName'), value: formData.firstName, type: 'text' },
        { key: 'lastName', label: t('lastName'), value: formData.lastName, type: 'text' },
        {
          key: 'birthDate',
          label: t('birthDate'),
          value: formData.birthDate,
          type: 'text',
          placeholder: 'DD-MM-YYYY',
        },

        {
          key: 'region',
          label: t('region'),
          value: formData.region,
          type: 'select',
        },
      ],
    },
  ];

  const carouselRef = useRef<any>(null);
  const handleInputChange = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleBack = () => {
    if (currentStep > 0) {
      carouselRef.current?.scrollTo({ index: currentStep - 1 });
      setCurrentStep((prev) => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      setFormData((prev) => ({
        ...prev,
        birthDate: formatDate(date),
      }));
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleRegionSelect = (region: string) => {
    setFormData((prev) => ({ ...prev, region }));
  };
  const handleSubmit = async () => {
    if (!route.params?.id) {
      setError(t('userIDRegistration'));
      return;
    }

    setLoading(true);
    setError(null);
    const newData = {
      name: formData.firstName,
      surname: formData.lastName,
      date_of_birth: formData.birthDate,
      city_id: formData.region,
    };

    try {
      const resultAction = await dispatch(
        register({
          data: newData,
          id: route?.params?.id,
        }),
      );
      if (register.fulfilled.match(resultAction)) {
      } else {
        setError((resultAction.payload as string) || t('registrationError'));
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(t('registrationError'));
    } finally {
      setLoading(false);
    }
  };

  const renderDatePicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <Modal visible={showDatePicker} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('selectBirthDate')}</Text>
                <Pressable onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.modalDoneButton}>{t('done')}</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            </View>
          </View>
        </Modal>
      );
    }

    return (
      showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )
    );
  };

  const renderStep = ({ item: step }: { item: Step }) => {
    return (
      <View style={styles.stepContainer}>
        <View style={styles.form}>
          {step.fields.map((field) => (
            <View key={field.key} style={styles.inputContainer}>
              <Text style={styles.label}>{field.label}</Text>
              {field.key === 'birthDate' ? (
                <Pressable style={[styles.input, styles.dateInput]} onPress={showDatePickerModal}>
                  <Text style={styles.dateText}>{formData.birthDate || t('selectBirthDate')}</Text>
                  <Ionicons name="calendar-outline" size={24} color="#666" />
                </Pressable>
              ) : field.type === 'select' ? (
                <Dropdown
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={field.key === 'region' ? regionDropdownData : []}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={field.label}
                  value={formData.region}
                  onChange={(item) => {
                    switch (field.key) {
                      case 'region':
                        handleRegionSelect(item.value);
                        break;
                    }
                  }}
                />
              ) : (
                <TextInput
                  style={[styles.input, field.multiline && styles.multilineInput]}
                  value={field.value}
                  onChangeText={(value) => handleInputChange(field.key, value)}
                  placeholder={field.placeholder || field.label}
                  multiline={field.multiline}
                  numberOfLines={field.multiline ? 3 : 1}
                />
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
      </View>
      <View style={styles.content}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <FlatList
          ref={carouselRef}
          data={steps}
          renderItem={renderStep}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View style={styles.footer}>
        <Button title={t('register')} onPress={handleSubmit} loading={loading} />
      </View>

      <SelectPicker
        visible={showRegionModal}
        title={t('selectRegion')}
        items={regions}
        selectedValue={formData.region}
        onValueChange={handleRegionSelect}
        onClose={() => setShowRegionModal(false)}
      />

      {renderDatePicker()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },

  content: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#000',
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 8,
  },
  errorText: {
    color: '#E32F45',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  modalDoneButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    color: colors.gray[300],
  },
  modalList: {
    maxHeight: height * 0.6,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    maxHeight: height * 0.7,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  optionsList: {
    maxHeight: height * 0.6,
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  dropdown: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#666',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  footer: {
    padding: 16,
    borderColor: '#E8E8E8',
  },
});
