import GoBackHeader from '@/components/GoBackHeader';
import { colors } from '@/constants/colors';
import { AppDispatch } from '@/store';
import { useAppSelector } from '@/store/hooks';
import { loginWithSms, verifyCode } from '@/store/slices/authSlice';
import { AuthScreenProps } from '@/types/navigation';
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

const { width } = Dimensions.get('window');

type LoginScreenProps = AuthScreenProps<'Login'>;

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const top = useSafeAreaInsets().top + 5;
  const isChecked2 = useAppSelector((state) => state.auth.isAgreementChecked);

  const [isChecked, setIsChecked] = useState(false);
  useEffect(() => {
    setIsChecked(isChecked2);
  }, [isChecked2]);

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 9);

    if (cleaned.length === 0) {
      setPhone('');
      return;
    }
    let formatted = '';
    if (cleaned.length <= 2) {
      formatted = cleaned;
    } else if (cleaned.length <= 5) {
      formatted = cleaned.slice(0, 2) + ' ' + cleaned.slice(2);
    } else if (cleaned.length <= 7) {
      formatted = cleaned.slice(0, 2) + ' ' + cleaned.slice(2, 5) + ' ' + cleaned.slice(5);
    } else if (cleaned.length <= 9) {
      formatted =
        cleaned.slice(0, 2) +
        ' ' +
        cleaned.slice(2, 5) +
        ' ' +
        cleaned.slice(5, 7) +
        ' ' +
        cleaned.slice(7);
    } else {
      formatted =
        cleaned.slice(0, 2) +
        ' ' +
        cleaned.slice(2, 5) +
        ' ' +
        cleaned.slice(5, 7) +
        ' ' +
        cleaned.slice(7, 9) +
        ' ' +
        cleaned.slice(9);
    }

    setPhone(formatted);
  };
  const dispatch = useDispatch<AppDispatch>();
  const handleSubmit = async () => {
    if (!phone || phone.length < 9) {
      setError('Please enter your phone number');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const fullPhone = '998' + phone.replace(/\s/g, '');
      await dispatch(loginWithSms(fullPhone));
      navigation.navigate('OTP', { phone: fullPhone });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <ImageBackground
          style={{ flex: 1 }}
          imageStyle={{ resizeMode: 'cover' }}
          source={require('../../../assets/Apk1.png')}
        >
          <GoBackHeader
            title=""
            style={{
              borderBottomWidth: 0,
              marginTop: top,
              backgroundColor: 'transparent',
              marginLeft: 16,
            }}
            buttonStyle={{ backgroundColor: '#747373', borderRadius: 10 }}
            iconStyle={{ color: colors.white }}
          />
          <View style={[styles.content, { justifyContent: 'flex-end', flex: 1 }]}>
            <View
              style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                padding: 24,
                paddingBottom: 40,
              }}
            >
              <Text
                style={[
                  styles.title,
                  {
                    color: '#222',
                    textAlign: 'left',
                    fontSize: 22,
                    fontWeight: '700',
                    marginBottom: 8,
                  },
                ]}
              >
                {t('enterYourNumber')}
              </Text>
              <Text style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>{t('codeSend')}</Text>
              <View style={[styles.phoneInputContainer]}>
                <Text style={styles.prefix}>+998 </Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={handlePhoneChange}
                  placeholder="00 000-00-00"
                  keyboardType="number-pad"
                  maxLength={12}
                />
              </View>
              {error ? (
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <Pressable
                  onPress={() => setIsChecked(!isChecked)}
                  style={{
                    width: 24,
                    height: 24,
                    borderWidth: 1.5,
                    borderColor: isChecked ? '#b60017' : '#888',
                    borderRadius: 4,
                    marginRight: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isChecked ? '#b60017' : '#fff',
                  }}
                >
                  {isChecked && <AntDesign name="check" size={23} color="white" />}
                </Pressable>
                <Text style={{ fontSize: 13, color: '#888', flex: 1 }}>
                  {t('agreement')}{' '}
                  <Text
                    style={{ color: '#b60017', textDecorationLine: 'underline' }}
                    onPress={() => navigation.navigate('Agreement', { isRegistration: false })}
                  >
                    {t('terms')}
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.button,
                  (!phone || !isChecked || isLoading) && styles.buttonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!phone || !isChecked || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>{t('getCode')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
  },
  selectedLangItem: {
    backgroundColor: '#F5F5F5',
  },
  langFlag: {
    fontSize: 24,
    marginRight: 12,
  },
  langName: {
    fontSize: 16,
    color: '#000',
  },
  langButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  langButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  langArrow: {
    fontSize: 12,
    color: '#000',
    marginLeft: 2,
  },
  langButtonText: {
    fontSize: 16,
    color: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    gap: 8,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#fff',
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 5,
  },
  prefix: {
    fontSize: 16,
    color: '#000',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingLeft: 4,
  },
  errorText: {
    color: '#b60017',
    fontSize: 14,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#b60017',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#E2E8F0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
