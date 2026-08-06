import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../constants/colors';

interface SoftUpdateModalProps {
  visible: boolean;
  currentVersion: string;
  latestVersion: string;
  onUpdate: () => void;
  onLater: () => void;
}

export const SoftUpdateModal: React.FC<SoftUpdateModalProps> = ({
  visible,
  currentVersion,
  latestVersion,
  onUpdate,
  onLater,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onLater}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>✨</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{t('updateAvailable')}</Text>

          {/* Message */}
          <Text style={styles.message}>{t('updateAvailableMessage')}</Text>

          {/* Version Info */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionLabel}>{t('currentVersion')}:</Text>
            <Text style={styles.versionValue}>{currentVersion}</Text>
          </View>

          <View style={styles.versionContainer}>
            <Text style={styles.versionLabel}>{t('newVersion')}:</Text>
            <Text style={styles.versionValue}>{latestVersion}</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.updateButton} onPress={onUpdate} activeOpacity={0.8}>
              <Text style={styles.updateButtonText}>{t('updateNow')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.laterButton} onPress={onLater} activeOpacity={0.8}>
              <Text style={styles.laterButtonText}>{t('later')}</Text>
            </TouchableOpacity>
          </View>

          {/* Info Text */}
          <Text style={styles.infoText}>{t('updateLaterInfo')}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  versionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  versionLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  versionValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 24,
    gap: 12,
  },
  updateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  laterButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
  },
  laterButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});
