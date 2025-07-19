import { OperationItemTypes } from '@/types/operation';
import { useTranslation } from 'react-i18next';
import { View, Image, Text } from 'react-native';

interface ScanItem {
  id: number;
  barcode: string;
  image: string;
  status: 'waiting' | 'approved' | 'rejected';
  created_at: string;
}

const OperationItem: React.FC<{ item: OperationItemTypes }> = ({ item }) => {
  const { t } = useTranslation();

  const statusColor = {
    waiting: 'orange',
    approved: 'green',
    rejected: 'red',
  }[item.status];

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginVertical: 8,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
      }}
    >
      <Image
        source={{ uri: item.image }}
        style={{ width: 80, height: 80, borderRadius: 8 }}
        resizeMode="cover"
      />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000' }}>
          {t('barcode')}: {item.barcode}
        </Text>
        <Text style={{ fontSize: 13, marginTop: 4, color: '#666' }}>
          {t('uploadedAt')}: {item.created_at}
        </Text>
        <Text style={{ marginTop: 4, color: statusColor }}>
          {t('status')}: {t(item.status)}
        </Text>
      </View>
    </View>
  );
};
export default OperationItem;
