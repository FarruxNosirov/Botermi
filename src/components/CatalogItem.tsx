import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  ImageBackground,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
interface ItemType {
  id: number;
  name: string;
  slug: string;
  order: number;
  image: string;
  categories: Category[];
}

interface Category {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  image: string;
}

interface BoilerPartsCardProps {
  item: ItemType;
  onPress?: () => void;
}
const CatalogCard: React.FC<BoilerPartsCardProps> = ({ item, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuItemContent}>
          <View style={{ width: '90%' }}>
            <Text style={styles.menuItemText}>{item?.name}</Text>
          </View>
          <View>
            <Image source={{ uri: item?.image }} width={24} height={24} />
          </View>
        </View>
      </TouchableOpacity>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAF6F2',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 10,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },
  image: {
    width: '100%',
    height: 180,
  },
  container: {
    height: 250,
    marginBottom: 10,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'relative',
    padding: 10,
    borderRadius: 10,
    boxShadow: '0px 0px 5px #cacaca',
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 14,
    color: '#333',
  },
});

export default CatalogCard;
