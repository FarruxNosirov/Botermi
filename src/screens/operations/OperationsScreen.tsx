import IsLoading from '@/components/IsLoading';
import EmptyState from '@/components/EmptyState';
import { DEVICE_HEIGHT } from '@/constants/constants';
import { useBarcodeAll } from '@/hooks/querys';
import { useAppDispatch } from '@/store/hooks';
import { getMe } from '@/store/slices/authSlice';
import { MainTabScreenProps } from '@/types/navigation';
import { UserDataType } from '@/types/userType';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import OperationItem from './components/OperationItem';

type OperationsScreenProps = MainTabScreenProps<'Operations'>;

export const OperationsScreen: React.FC<OperationsScreenProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'waiting' | 'approved' | 'rejected'>(
    'all',
  );
  const searchQueryRef = useRef('');
  const searchInputRef = useRef<TextInput>(null);
  const [userData, setUserData] = useState<UserDataType | null>(null);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const { data, isLoading, refetch, isFetching } = useBarcodeAll(userData?.id || 117);

  const handleGetMe = async () => {
    const resultAction = await dispatch(getMe());
    if (getMe.fulfilled.match(resultAction)) {
      const user = resultAction?.payload?.data;
      setUserData(user);
    }
  };

  const handleSearchQueryChange = useCallback((text: string) => {
    setSearchQuery(text);
    searchQueryRef.current = text;
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await refetch();
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  const handleFilterApply = useCallback((status: 'all' | 'waiting' | 'approved' | 'rejected') => {
    setFilterStatus(status);
  }, []);

  useEffect(() => {
    handleGetMe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userData?.id) {
        refetch();
      }
    }, [userData?.id, refetch]),
  );

  const filteredData = (data?.data?.data || []).filter(
    (item: { barcode: string; status?: string }) => {
      // Search bo'yicha filter
      const matchesSearch = item.barcode.toLowerCase().includes(searchQuery.toLowerCase());

      // Status bo'yicha filter
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;

      return matchesSearch && matchesStatus;
    },
  );

  if (isLoading || isFetching) {
    return (
      <View style={styles.loadingContainer}>
        <IsLoading />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 10 }}>
        <View style={{ paddingHorizontal: 2 }}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInput}>
              <TouchableOpacity onPress={() => searchInputRef.current?.focus()}>
                <AntDesign name="search1" size={20} color="black" style={{ marginRight: 6 }} />
              </TouchableOpacity>
              <TextInput
                ref={searchInputRef}
                placeholder={t('search')}
                style={{ flex: 1 }}
                value={searchQuery}
                onChangeText={handleSearchQueryChange}
              />
            </View>

            <TouchableOpacity
              style={[styles.filterIcon, filterStatus !== 'all' && styles.filterIconActive]}
              onPress={() =>
                (navigation as any).navigate('OperationsFilter', {
                  selectedStatus: filterStatus,
                  onApplyFilter: handleFilterApply,
                })
              }
            >
              <AntDesign
                name="filter"
                size={20}
                color={filterStatus !== 'all' ? '#4CAF50' : 'black'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {filterStatus !== 'all' && (
          <View style={styles.filterIndicator}>
            <Text style={styles.filterIndicatorText}>
              Filter:{' '}
              {filterStatus === 'waiting'
                ? t('waiting')
                : filterStatus === 'approved'
                  ? t('approved')
                  : filterStatus === 'rejected'
                    ? t('rejected')
                    : ''}
            </Text>
            <TouchableOpacity
              onPress={() => setFilterStatus('all')}
              style={styles.clearFilterButton}
            >
              <AntDesign name="close" size={16} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        {filteredData.length > 0 ? (
          <View style={{ height: DEVICE_HEIGHT - 200 }}>
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id?.toString() || item.barcode}
              contentContainerStyle={{ gap: 10, paddingBottom: 100, paddingHorizontal: 2 }}
              renderItem={(item) => <OperationItem {...item} />}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#FF3B30']}
                  tintColor="#FF3B30"
                />
              }
            />
          </View>
        ) : (
          <EmptyState />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 8,
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginLeft: 10,
  },
  filterIconActive: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  filterIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  filterIndicatorText: {
    fontSize: 14,
    color: '#1976D2',
    flex: 1,
  },
  clearFilterButton: {
    padding: 4,
  },
});

export default OperationsScreen;
