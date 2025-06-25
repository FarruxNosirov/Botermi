import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Pressable, FlatList } from 'react-native';
import { Language, languages } from '@/types/language';

type LanguageModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (language: Language) => void;
  selectedCode: string;
};

export const LanguageModal: React.FC<LanguageModalProps> = ({
  visible,
  onClose,
  onSelect,
  selectedCode,
}) => {
  const renderLanguageItem = ({ item }: { item: Language }) => (
    <Pressable
      style={[styles.languageItem, item.code === selectedCode && styles.selectedLanguageItem]}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      <Text style={styles.flag}>{item.flag}</Text>
      <Text
        style={[styles.languageName, item.code === selectedCode && styles.selectedLanguageText]}
      >
        {item.name}
      </Text>
    </Pressable>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <FlatList
            data={languages}
            renderItem={renderLanguageItem}
            keyExtractor={(item) => item.code}
            style={styles.list}
          />
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    marginTop: 100,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    width: 150,
  },
  list: {
    maxHeight: 200,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  selectedLanguageItem: {
    backgroundColor: '#f0f0f0',
  },
  flag: {
    fontSize: 20,
    marginRight: 12,
  },
  languageName: {
    fontSize: 16,
    color: '#333',
  },
  selectedLanguageText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
