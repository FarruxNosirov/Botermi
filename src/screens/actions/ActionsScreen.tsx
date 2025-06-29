import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export const ActionsScreen = () => {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [showScanner, setShowScanner] = useState(false);
  const [shopCode, setShopCode] = useState('');

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setShopCode(data);
    setShowScanner(false);
  };

  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>{t('newPurchase')}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('enterCodeProductPackaging')}</Text>
          <TextInput style={styles.input} placeholder="_ _ _ _ _ _ _" placeholderTextColor="#999" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('enterStoreCode')}</Text>
          <View style={styles.scanInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="_ _ _ _ _ _"
              placeholderTextColor="#999"
              value={shopCode}
              onChangeText={setShopCode}
            />
            <TouchableOpacity style={styles.scanButton} onPress={() => setShowScanner(true)}>
              <Ionicons name="qr-code-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.submitButton}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
          <Text style={styles.submitButtonText}>{t('confirm')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sampleButton}>
          <Text style={styles.sampleButtonText}>{t('sample')}</Text>
        </TouchableOpacity>

        <View style={styles.sampleImageContainer}>
          {/* <Image
            source={require('@/assets/images/bonus-code-sample.png')}
            style={styles.sampleImage}
            resizeMode="contain"
          /> */}
        </View>
      </View>

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
                style={styles.scanner}
              />
            )}
          </SafeAreaView>
        </View>
      </Modal>
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
});
