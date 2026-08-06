import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '../constants/colors';

interface ForceUpdateModalProps {
  visible: boolean;
  currentVersion: string;
  latestVersion: string;
  onUpdate: () => void;
}

export const ForceUpdateModal: React.FC<ForceUpdateModalProps> = ({
  visible,
  currentVersion,
  latestVersion,
  onUpdate,
}) => {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>🚀</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{t('updateRequired')}</Text>

          {/* Message */}
          <Text style={styles.message}>{t('updateRequiredMessage')}</Text>

          {/* Version Info */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionLabel}>{t('currentVersion')}:</Text>
            <Text style={styles.versionValue}>{currentVersion}</Text>
          </View>

          <View style={styles.versionContainer}>
            <Text style={styles.versionLabel}>{t('latestVersion')}:</Text>
            <Text style={styles.versionValue}>{latestVersion}</Text>
          </View>

          {/* Update Button */}
          <TouchableOpacity style={styles.updateButton} onPress={onUpdate} activeOpacity={0.8}>
            <Text style={styles.updateButtonText}>{t('updateNow')}</Text>
          </TouchableOpacity>

          {/* Info Text */}
          <Text style={styles.infoText}>{t('updateRequiredInfo')}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
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
  updateButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    marginTop: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
