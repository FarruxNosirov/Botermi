import IsLoading from '@/components/IsLoading';
import EmptyState from '@/components/EmptyState';
import { DEVICE_HEIGHT } from '@/constants/constants';
import { useBarcodeAll, useBarcodeByBarcode } from '@/hooks/querys';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getMe } from '@/store/slices/authSlice';
import { MainTabScreenProps } from '@/types/navigation';
import { UserDataType } from '@/types/userType';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const [initialLoading, setInitialLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'waiting' | 'approved' | 'rejected' | 'new'
  >('all');
  const searchQueryRef = useRef('');
  const searchInputRef = useRef<TextInput>(null);
  const authUser = useAppSelector((state) => state.auth.user?.data || state.auth.user);
  const [userData, setUserData] = useState<UserDataType | null>(authUser || null);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const { data, isLoading, refetch, isFetching } = useBarcodeAll(userData?.id || 117);

  const {
    data: barcodeByBarcode,
    isLoading: isLoadingBarcodeByBarcode,
    refetch: refetchBarcodeByBarcode,
    isFetching: isFetchingBarcodeByBarcode,
  } = useBarcodeByBarcode(userData?.id || 117);

  const handleGetMe = useCallback(async () => {
    const resultAction = await dispatch(getMe());
    if (getMe.fulfilled.match(resultAction)) {
      const user = (resultAction?.payload as any)?.data || resultAction?.payload;
      setUserData(user);
    }
  }, []);

  const handleSearchQueryChange = useCallback((text: string) => {
    setSearchQuery(text);
    searchQueryRef.current = text;
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await refetch();
      await refetchBarcodeByBarcode();
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch, refetchBarcodeByBarcode]);

  const handleFilterApply = useCallback(
    (status: 'all' | 'waiting' | 'approved' | 'rejected' | 'new') => {
      setFilterStatus(status);
    },
    [],
  );

  const renderOperationItem = useCallback((item: any) => <OperationItem {...item} />, []);

  useEffect(() => {
    if (!authUser) {
      handleGetMe();
    }
  }, [authUser, handleGetMe]);

  // Initial loading tracking
  useEffect(() => {
    if (!isLoading && !isLoadingBarcodeByBarcode && initialLoading) {
      setInitialLoading(false);
    }
  }, [isLoading, isLoadingBarcodeByBarcode, initialLoading]);

  useFocusEffect(
    useCallback(() => {
      if (userData?.id) {
        refetch();
        refetchBarcodeByBarcode();
      }
    }, [userData?.id, refetch, refetchBarcodeByBarcode]),
  );

  const dataAll = useMemo(() => {
    const barcodeData = barcodeByBarcode?.data?.data || [];
    const regularData = data?.data?.data || [];
    return barcodeData.concat(regularData);
  }, [barcodeByBarcode?.data?.data, data?.data?.data]);

  const filteredData = useMemo(() => {
    return dataAll?.filter((item: { barcode: string; status?: string }) => {
      const matchesSearch = item?.barcode
        ? item?.barcode?.toLowerCase().includes(searchQuery.toLowerCase())
        : item.status?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === 'all' || item?.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [dataAll, searchQuery, filterStatus]);

  // Show loading only on initial load
  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <IsLoading />
        </View>
      </SafeAreaView>
    );
  }

  const hasData = dataAll && dataAll.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {/* Search va Filter - faqat data bo'lganda ko'rsat */}
        {hasData && (
          <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
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
                        : filterStatus === 'new'
                          ? t('new')
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
          </View>
        )}

        {/* Data mavjudligi tekshiruvi */}
        {hasData ? (
          filteredData && filteredData.length > 0 ? (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.id?.toString() || item.barcode}
              contentContainerStyle={{ gap: 10, paddingBottom: 100, paddingHorizontal: 18 }}
              renderItem={renderOperationItem}
              keyboardShouldPersistTaps="handled"
              removeClippedSubviews={true}
              maxToRenderPerBatch={15}
              updateCellsBatchingPeriod={50}
              initialNumToRender={10}
              windowSize={5}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#FF3B30']}
                  tintColor="#FF3B30"
                />
              }
            />
          ) : (
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
              <EmptyState />
            </View>
          )
        ) : (
          <View style={{ flex: 1, paddingHorizontal: 16, justifyContent: 'center' }}>
            <EmptyState />
          </View>
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
