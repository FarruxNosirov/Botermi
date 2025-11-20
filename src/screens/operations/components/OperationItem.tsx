import { OperationItemTypes } from '@/types/operation';
import { useTranslation } from 'react-i18next';
import { View, Image, Text } from 'react-native';
import { formatDateCompact } from '@/utils/dateHelper';
import { formatBalance } from '@/constants/constants';

interface ScanItem {
  id: number;
  barcode: string;
  image: string;
  status: 'waiting' | 'approved' | 'rejected' | 'new';
  created_at: string;
}

const OperationItem: React.FC<{ item: OperationItemTypes }> = ({ item }) => {
  const { t } = useTranslation();

  const displayStatus = item.status === 'new' ? 'waiting' : item.status;

  const statusColor = {
    waiting: 'orange',
    approved: 'green',
    rejected: 'red',
  }[displayStatus];

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
        source={{ uri: item.image ? item.image : item?.product?.image || item?.prize?.image }}
        style={{ width: 80, height: 80, borderRadius: 8 }}
        resizeMode="contain"
      />
      <View style={{ marginLeft: 12, flex: 1 }}>
        {item.barcode ? (
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000' }}>
            {t('barcode')}: {item.barcode}
          </Text>
        ) : (
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000' }}>
            {t('price')}: {formatBalance(item.price)}
          </Text>
        )}
        <Text style={{ fontSize: 13, marginTop: 4, color: '#666' }}>
          {t('uploadedAt')}: {formatDateCompact(item?.created_at || '')}
        </Text>
        <Text style={{ marginTop: 4, color: statusColor }}>
          {t('status')}: {t(displayStatus)}
        </Text>
      </View>
    </View>
  );
};
export default OperationItem;
