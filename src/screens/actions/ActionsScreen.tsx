import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useScanBarcode } from '@/hooks/querys';
import { showToast } from '@/utils/toastHelper';

export const ActionsScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [showScanner, setShowScanner] = useState(false);
  const [shopCode, setShopCode] = useState('');
  const [avatarUri, setAvatarUri] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setShopCode(data);
    setShowScanner(false);
  };
  const isValidShopCode = shopCode.length >= 13;
  const { mutate: scanBarcode } = useScanBarcode();
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      const asset = result.assets[0];

      const file = {
        uri: asset.uri,
        name: asset.fileName || 'photo.jpg',
        type: asset.type || 'image/jpeg',
      };

      setAvatarUri(file);
    }
  };
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const fileExtension = asset.uri.split('.').pop()?.toLowerCase();

      const mimeType =
        fileExtension === 'png'
          ? 'image/png'
          : fileExtension === 'jpg' || fileExtension === 'jpeg'
            ? 'image/jpeg'
            : 'image/jpeg';

      const file = {
        uri: asset.uri,
        name: `photo.${fileExtension}`,
        type: mimeType,
      };

      setAvatarUri(file);
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
  const handleScanBarcode = () => {
    if (!avatarUri) {
      alert('Iltimos, rasm tanlang!');
      return;
    }
    setIsSubmitting(true);
    const getFileInfo = (uri: string) => {
      const fileExtension = uri?.split('.')?.pop()?.toLowerCase();

      let mimeType = 'image/jpeg';
      if (fileExtension === 'png') mimeType = 'image/png';
      if (fileExtension === 'jpg' || fileExtension === 'jpeg') mimeType = 'image/jpeg';

      return { mimeType, fileExtension };
    };
    const { mimeType } = getFileInfo(avatarUri.uri);
    const formData: any = new FormData();
    formData.append('barcode', shopCode);
    formData.append('image', {
      uri: avatarUri.uri,
      name: `photo.${avatarUri?.uri?.split('.')?.pop()}`,
      type: mimeType,
    });

    scanBarcode(formData, {
      onSuccess: (data) => {
        showToast('success', t('success'), t('actions.scanSuccess'));
        setShopCode('');
        setAvatarUri(null);
        setIsSubmitting(false);
        navigation.navigate('Operations' as any, { data });
      },
      onError: (error: any) => {
        showToast('error', t('error'), t('actions.barcodeAlreadyScanned'));
        setShopCode('');
        setAvatarUri(null);
        setIsSubmitting(false);
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </Pressable>
          <Text style={styles.headerTitle}>{t('newPurchase')}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View>
              <Text style={{ color: 'black', fontSize: 18 }}>
                {t('actions.uploadBoilerPhotoInstruction')}
              </Text>
            </View>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ marginVertical: 10, fontWeight: '600', fontSize: 18 }}>
                {t('actions.photoExampleLabel')}:
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  height: 150,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ height: 150, width: '48%' }}>
                  <Image
                    style={{ width: '100%', height: 150 }}
                    source={require('../../../assets/1.jpg')}
                  />
                </View>
                <View style={{ height: 150, width: '48%' }}>
                  <Image
                    style={{ width: '100%', height: 150 }}
                    source={require('../../../assets/2.webp')}
                  />
                </View>
              </View>
            </View>
            <View style={{ gap: 10 }}>
              <Text style={{ marginVertical: 10, fontWeight: '600', fontSize: 18 }}>
                <Text>{t('actions.uploadProductPhoto')}</Text>
              </Text>
              <View
                style={{
                  width: '100%',
                  height: 180,
                  borderWidth: 3,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: 'red',
                  borderStyle: 'dashed',
                  backgroundColor: !avatarUri?.uri ? 'rgba(250, 230, 230, 0.6)90' : '',
                  marginBottom: 15,
                  padding: 5,
                }}
              >
                {!avatarUri?.uri ? (
                  <TouchableOpacity
                    style={{ flexDirection: 'column', alignItems: 'center', gap: 10 }}
                    onPress={handleImagePick}
                  >
                    <MaterialCommunityIcons name="image-plus" size={28} color="red" />
                    <Text style={{ color: 'red', fontSize: 20, textAlign: 'center' }}>
                      {t('actions.uploadImage')}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Image
                    style={{ width: '95%', height: '100%', objectFit: 'cover', borderRadius: 10 }}
                    source={{ uri: avatarUri?.uri }}
                  />
                )}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('enterStoreCode')}</Text>
              <View style={styles.scanInputContainer}>
                <View style={{ width: '80%' }}>
                  <TextInput
                    style={styles.input}
                    placeholder="_ _ _ _ _ _ _ _ _"
                    placeholderTextColor="#999"
                    value={shopCode}
                    onChangeText={setShopCode}
                  />
                </View>
                <TouchableOpacity style={styles.scanButton} onPress={() => setShowScanner(true)}>
                  <Ionicons name="qr-code-outline" size={40} color="#000" />
                </TouchableOpacity>
              </View>
              {shopCode.length > 0 && !isValidShopCode && (
                <Text style={{ color: 'red', marginTop: 4 }}>
                  {t('storeCodeMinLength', { count: 13 }) /* i18n uchun */}
                </Text>
              )}
            </View>

            {/* <TouchableOpacity style={styles.cameraUploadButton} >
          <Ionicons name="camera-outline" size={24} color="#fff" />
          <Text style={styles.cameraUploadText}>Maxsulot rasmini yuklang</Text>
        </TouchableOpacity> */}

            <TouchableOpacity
              style={[
                styles.submitButton,
                {
                  backgroundColor: isValidShopCode && avatarUri ? '#2cbd15' : '#A9A9A9',
                },
              ]}
              disabled={!(isValidShopCode && avatarUri)}
              onPress={handleScanBarcode}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
                  <Text style={styles.submitButtonText}>{t('confirm')}</Text>
                </>
              )}
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.sampleButton}>
          <Text style={styles.sampleButtonText}>{t('sample')}</Text>
        </TouchableOpacity> */}

            <View style={styles.sampleImageContainer}>
              {/* <Image
            source={require('@/assets/images/bonus-code-sample.png')}
            style={styles.sampleImage}
            resizeMode="contain"
          /> */}
            </View>
          </View>
        </ScrollView>
        <Modal visible={showScanner} transparent={true} animationType="slide">
          <View style={styles.scannerContainer}>
            <SafeAreaView style={styles.scannerContent}>
              <View style={styles.scannerHeader}>
                <TouchableOpacity onPress={() => setShowScanner(false)} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.scannerTitle}>{t('scanQRCode')}</Text>
              </View>
              {permission?.granted && (
                <CameraView
                  facing="back"
                  onBarcodeScanned={handleBarCodeScanned}
                  barcodeScannerSettings={{
                    barcodeTypes: ['ean13', 'code128', 'upc_a'],
                  }}
                  style={styles.scanner}
                />
              )}
            </SafeAreaView>
          </View>
        </Modal>
      </SafeAreaView>
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 100,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 18,
    letterSpacing: 8,
  },
  scanInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanButton: {
    position: 'absolute',
    right: 16,
    height: 56,
    justifyContent: 'center',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A9A9A9',
    height: 56,
    borderRadius: 12,
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sampleButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E32F45',
  },
  sampleButtonText: {
    color: '#E32F45',
    fontSize: 16,
    fontWeight: '600',
  },
  sampleImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  sampleImage: {
    width: '100%',
    height: 200,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scannerContent: {
    flex: 1,
  },
  scannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  closeButton: {
    padding: 8,
  },
  scannerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  scanner: {
    flex: 1,
    height: Dimensions.get('window').height,
  },
  cameraUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E32F45',
    height: 56,
    borderRadius: 12,
    marginBottom: 16,
  },
  cameraUploadText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
