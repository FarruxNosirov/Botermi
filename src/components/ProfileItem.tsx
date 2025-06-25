import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { FC } from 'react';
import { Icon } from './ui/Icon';
type ItemProps = {
  item: any;
  arr: any;
  idx: any;
};
const ProfileItem: FC<ItemProps> = ({ item, idx, arr }) => {
  return (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.button,
        {
          borderBottomWidth: idx !== arr.length - 1 ? 1 : 0,
        },
      ]}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <Icon name={item.icon} size={22} color="#222" />
      <Text style={styles.title}>{item.title}</Text>
      {item.value && <Text style={[styles.text, { color: item.valueColor }]}>{item.value}</Text>}
      <Icon name="chevron-forward-outline" size={22} color="#B0B0B0" />
    </TouchableOpacity>
  );
};

export default ProfileItem;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomColor: '#F0F0F0',
  },
  text: { fontWeight: 'bold', fontSize: 16 },
  title: {
    fontSize: 16,
    color: '#222',
    marginLeft: 16,
    flex: 1,
  },
});
