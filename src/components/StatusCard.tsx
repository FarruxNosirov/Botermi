import React from 'react';
import { View, Text } from 'react-native';
import {
  Feather,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
  FontAwesome5,
} from '@expo/vector-icons';

type Props = {
  iconLib?: 'Feather' | 'AntDesign' | 'Entypo' | 'MaterialCommunityIcons' | 'FontAwesome5';
  iconName: string;
  color: string;
  value: number | string;
  label: string;
  title: string;
};

const StatusCard: React.FC<Props> = ({
  iconLib = 'AntDesign',
  iconName,
  color,
  value,
  title,
  label,
}) => {
  const Icon =
    iconLib === 'Feather'
      ? Feather
      : iconLib === 'AntDesign'
        ? AntDesign
        : iconLib === 'Entypo'
          ? Entypo
          : iconLib === 'MaterialCommunityIcons'
            ? MaterialCommunityIcons
            : iconLib === 'FontAwesome5'
              ? FontAwesome5
              : Feather;

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 5,
        justifyContent: 'space-between',
      }}
    >
      <Icon name={iconName as any} size={24} color={color} />
      <View style={{ marginLeft: 10, alignItems: 'flex-end' }}>
        <Text style={{ color: '#000' }}>{label}</Text>
        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
          {value} {title}
        </Text>
      </View>
    </View>
  );
};

export default StatusCard;
