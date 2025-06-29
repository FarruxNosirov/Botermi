import GoBackHeader from '@/components/GoBackHeader';
import { colors } from '@/constants/colors';
import Box from '@/shared/ui/Box';
import { Text } from '@/shared/ui/Text';
import { AppDispatch } from '@/store';
import { loginWithSms, verifyCode } from '@/store/slices/authSlice';
import { AuthStackParamList, RootStackParamList } from '@/types/navigation';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

type OTPScreenProps = CompositeScreenProps<
  NativeStackScreenProps<AuthStackParamList, 'OTP'>,
  NativeStackScreenProps<RootStackParamList>
>;

const OTP_LENGTH = 5;
const RESEND_TIMEOUT = 60;

export const OTPScreen: React.FC<OTPScreenProps> = ({ navigation, route }) => {
  const { phone } = route.params;
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(RESEND_TIMEOUT);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (text: string, index: number) => {
    let newOtp = [...otp];

    // Agar bir nechta raqam kiritilsa (paste yoki autofill)
    if (text.length > 1) {
      // Har bir raqamni inputlarga joylashtiramiz
      for (let i = 0; i < OTP_LENGTH - index && i < text.length; i++) {
        newOtp[index + i] = text[i];
      }
      setOtp(newOtp);

      // Oxirgi to‘ldirilgan inputga fokus beramiz
      const nextIndex = Math.min(index + text.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
    } else {
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length !== OTP_LENGTH) {
      setError(t('smsError'));
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const resultAction = await dispatch(verifyCode({ phone, code: otpString }));

      if (verifyCode.fulfilled.match(resultAction)) {
        const user = resultAction.payload.user;
        const userData = user.data || user;

        if (userData?.name === 'Foydalanuvchi' || !userData?.city) {
          navigation.navigate('Auth', {
            screen: 'Registration',
            params: {
              phone,
              token: resultAction?.payload?.token,
              id: resultAction?.payload?.user?.id,
            },
          });
        }
      } else {
        setError((resultAction.payload as string) || t('errorSms'));
      }
    } catch (err: any) {
      setError(err.message || t('anErrorOccurred'));
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmitResend = async () => {
    if (!phone || phone.length < 9) {
      setError(t('enterPhoneNumber'));
      return;
    }
    try {
      setTimeLeft(RESEND_TIMEOUT);
      setIsLoading(true);
      setError(null);
      const fullPhone = phone.replace(/\s/g, '');
      await dispatch(loginWithSms(fullPhone));
    } catch (err: any) {
      setError(err.message || t('somethingWentWrong'));
    } finally {
      setIsLoading(false);
    }
  };

  const top = useSafeAreaInsets().top;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let animation: Animated.CompositeAnimation;

    if (isLoading) {
      animation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          isInteraction: false,
        }),
      );
      animation.start();
    } else {
      rotateAnim.stopAnimation();
    }

    return () => {
      rotateAnim.stopAnimation();
    };
  }, [isLoading]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
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
            buttonStyle={{ backgroundColor: 'rgba(255 255 255 / 0.3)', borderRadius: 10 }}
            iconStyle={{ color: colors.white }}
          />
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <View
              style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                padding: 24,
                paddingBottom: 40,
              }}
            >
              <Text variant="title">{t('enterTheCode')}</Text>
              <Text variant="languageTitle">
                {t('confirmationCodeSentToNumber')}
                {'\n'}
                <Text variant="phone">{phone}</Text>
              </Text>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 }}
              >
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    style={{
                      width: 58,
                      height: 48,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: digit ? '#b60017' : '#E8E8E8',
                      backgroundColor: digit ? '#FFF5F6' : '#F5F5F5',
                      fontSize: 24,
                      fontWeight: '600',
                      textAlign: 'center',
                      color: '#b60017',
                    }}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                  />
                ))}
              </View>
              {timeLeft > 0 ? (
                <Text variant="timeLeft" style={{ marginVertical: 5 }}>
                  {t('resetCodeSms')} {timeLeft} {t('seconds')}
                </Text>
              ) : (
                <Text variant="error" style={{ marginVertical: 5, textAlign: 'center' }}>
                  {t('outdatedOrIncorrect')}
                </Text>
              )}

              {error && (
                <Box p="s" borderRadius="s" mb="s">
                  <Text variant="error">{error}</Text>
                </Box>
              )}
              {timeLeft > 0 ? (
                <Pressable
                  style={[
                    styles.button,
                    (otp.some((d) => !d) || isLoading) && styles.disabledButton,
                    { marginTop: 10 },
                  ]}
                  onPress={handleSubmit}
                  disabled={otp.some((d) => !d) || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text variant="buttonText">{t('confirm')}</Text>
                  )}
                </Pressable>
              ) : (
                <TouchableOpacity
                  style={[styles.resend, { marginTop: 10 }]}
                  onPress={handleSubmitResend}
                >
                  <Animated.Image
                    style={[styles.logo, { transform: [{ rotate: spin }] }]}
                    source={require(`../../../assets/resend.png`)}
                  />

                  <Text variant="buttonText" style={{ color: 'red' }}>
                    {t('resendCode')}
                  </Text>
                </TouchableOpacity>
              )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    lineHeight: 24,
  },
  phone: {
    color: '#000',
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInput: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#b60017',
    backgroundColor: '#fff',
  },
  otpInputFilled: {
    borderColor: '#b60017',
    backgroundColor: '#FFF5F6',
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontSize: 16,
    color: '#666',
  },
  timer: {
    color: '#666',
  },
  timerActive: {
    color: '#b60017',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#b60017',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  resend: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabledButton: {
    backgroundColor: '#E8E8E8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    color: '#b60017',
    fontSize: 14,
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
});
