import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FilterItem = ({
  filter,
  isSelected,
  onSelect,
}: {
  filter: any;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => (
  <TouchableOpacity style={styles.optionItem} onPress={() => onSelect(String(filter.id))}>
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
      <Text style={styles.optionText}>{filter.title}</Text>
    </View>
  </TouchableOpacity>
);
export default FilterItem;
export const styles = StyleSheet.create({
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
    marginLeft: 10,
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
