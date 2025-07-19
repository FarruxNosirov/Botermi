import { ManufacturerItemType } from '@/types/catalogItem';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

const ManufacturerItem = ({
  manufacturer,
  isSelected,
  onSelect,
}: {
  manufacturer: ManufacturerItemType;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => (
  <TouchableOpacity style={styles.optionItem} onPress={() => onSelect(String(manufacturer.id))}>
    <View style={styles.radioCircle}>
      {isSelected && <View style={styles.selectedRadioFill} />}
    </View>
    <View
      style={{
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text style={styles.optionText}>{manufacturer.name}</Text>
      <Image
        source={{ uri: manufacturer.image }}
        style={{ width: 100, height: 25 }}
        resizeMode="contain"
      />
    </View>
  </TouchableOpacity>
);
export default ManufacturerItem;
export const styles = StyleSheet.create({
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRadioFill: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
  },
  logo: {
    width: 100,
    height: 30,
    marginRight: 10,
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
});
