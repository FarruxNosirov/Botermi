import { Text } from '@/shared/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleProp, StyleSheet, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

type GoBacHeaderProps = {
  title: string;
  style?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<TextStyle>;
};
const GoBackHeader: React.FC<GoBacHeaderProps> = ({ title, style, buttonStyle, iconStyle }) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.backButton, buttonStyle]}
      >
        <Ionicons name="chevron-back" size={24} color="#000" style={[iconStyle]} />
      </TouchableOpacity>
      <Text variant="goBackHeader">{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
});

export default GoBackHeader;
