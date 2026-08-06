import IsLoading from '@/components/IsLoading';
import EmptyState from '@/components/EmptyState';
import { RequireAuth } from '@/components/RequireAuth';
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
  const [filterStatus, setFilterStatus] = useState<'all' | 'waiting' | 'approved' | 'rejected'>(
    'all',
  );
  const [activeTab, setActiveTab] = useState<'orders' | 'cashback'>('cashback');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const searchQueryRef = useRef('');
  const searchInputRef = useRef<TextInput>(null);
  const authUser = useAppSelector((state) => state.auth.user?.data || state.auth.user);
  const [userData, setUserData] = useState<UserDataType | null>(authUser || null);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  // Cashback tab: useBarcodeAll
  const {
    data: cashbackData,
    isLoading: isCashbackLoading,
    refetch: refetchCashback,
    isFetching: isCashbackFetching,
  } = useBarcodeAll(userData?.id || 117);

  // Orders tab: useBarcodeByBarcode
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    refetch: refetchOrders,
    isFetching: isOrdersFetching,
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
      // Refresh only the active tab's data
      if (activeTab === 'cashback') {
        await refetchCashback();
      } else {
        await refetchOrders();
      }
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [activeTab, refetchCashback, refetchOrders]);

  const handleFilterApply = useCallback((status: 'all' | 'waiting' | 'approved' | 'rejected') => {
    setFilterStatus(status);
  }, []);

  const handleTabChange = useCallback((tab: 'orders' | 'cashback') => {
    setActiveTab(tab);
    setSearchQuery('');
    searchQueryRef.current = '';
    setFilterStatus('all');
    setIsSearchExpanded(false);
  }, []);

  const handleSearchExpand = useCallback(() => {
    setIsSearchExpanded(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  }, []);

  const handleSearchCollapse = useCallback(() => {
    setIsSearchExpanded(false);
    setSearchQuery('');
    searchQueryRef.current = '';
  }, []);

  const renderOperationItem = useCallback((item: any) => <OperationItem {...item} />, []);

  useEffect(() => {
    if (!authUser) {
      handleGetMe();
    }
  }, [authUser, handleGetMe]);

  useEffect(() => {
    // Check loading state based on active tab
    const isLoadingData =
      activeTab === 'cashback'
        ? (isCashbackLoading || isCashbackFetching) && !cashbackData?.data?.data
        : (isOrdersLoading || isOrdersFetching) && !ordersData?.data?.data;

    if (!isLoadingData && initialLoading) {
      setInitialLoading(false);
    }
  }, [
    activeTab,
    isCashbackLoading,
    isOrdersLoading,
    isCashbackFetching,
    isOrdersFetching,
    cashbackData,
    ordersData,
    initialLoading,
  ]);

  useFocusEffect(
    useCallback(() => {
      if (userData?.id) {
        // Refetch both on focus
        refetchCashback();
        refetchOrders();
      }
    }, [userData?.id, refetchCashback, refetchOrders]),
  );

  // Get data based on active tab
  const currentTabData = useMemo(() => {
    if (activeTab === 'cashback') {
      return cashbackData?.data?.data || [];
    } else {
      return ordersData?.data?.data || [];
    }
  }, [activeTab, cashbackData?.data?.data, ordersData?.data?.data]);

  const filteredData = useMemo(() => {
    // Apply search and status filters (no tab filtering needed - data already separated)
    return currentTabData?.filter((item: { barcode?: string; price?: number; status?: string }) => {
      const query = searchQuery.toLowerCase();

      // Map "new" to "waiting" for display purposes
      const displayStatus = item?.status === 'new' ? 'waiting' : item?.status;

      const matchesSearch =
        // Search by barcode
        item?.barcode?.toLowerCase().includes(query) ||
        // Search by price
        item?.price?.toString().includes(searchQuery) ||
        // Search by status (original English - checking both original and mapped)
        item?.status?.toLowerCase().includes(query) ||
        displayStatus?.toLowerCase().includes(query) ||
        // Search by translated status (checking both original and mapped)
        (item?.status && t(item.status).toLowerCase().includes(query)) ||
        (displayStatus && t(displayStatus).toLowerCase().includes(query));

      // Filter: "new" items match "waiting" filter
      const matchesStatus =
        filterStatus === 'all' ||
        item?.status === filterStatus ||
        (filterStatus === 'waiting' && item?.status === 'new');

      return matchesSearch && matchesStatus;
    });
  }, [currentTabData, searchQuery, filterStatus, t]);

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

  const hasData = currentTabData && currentTabData.length > 0;

  return (
    <RequireAuth
      fallbackMessage={
        t('operations.loginToViewOperations') || "Amaliyotlaringizni ko'rish uchun tizimga kiring"
      }
    >
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1 }}>
          {/* Header: Title + Search + Filter */}
          {!isSearchExpanded ? (
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>
                {t('operations.title') || 'Amaliyotlar tarixi'}
              </Text>
              <View style={styles.headerActions}>
                {hasData && (
                  <>
                    <TouchableOpacity style={styles.headerIconButton} onPress={handleSearchExpand}>
                      <AntDesign name="search1" size={22} color="#000" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.headerIconButton,
                        filterStatus !== 'all' && styles.headerIconButtonActive,
                      ]}
                      onPress={() =>
                        (navigation as any).navigate('OperationsFilter', {
                          selectedStatus: filterStatus,
                          onApplyFilter: handleFilterApply,
                        })
                      }
                    >
                      <AntDesign
                        name="filter"
                        size={22}
                        color={filterStatus !== 'all' ? '#4CAF50' : '#000'}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ) : (
            // Expanded Search Bar
            <View style={styles.searchBarContainer}>
              <TouchableOpacity style={styles.backButton} onPress={handleSearchCollapse}>
                <AntDesign name="arrowleft" size={24} color="#000" />
              </TouchableOpacity>
              <TextInput
                ref={searchInputRef}
                placeholder={t('search') || 'Qidirish'}
                style={styles.expandedSearchInput}
                value={searchQuery}
                onChangeText={handleSearchQueryChange}
                autoFocus
              />
              {hasData && (
                <TouchableOpacity
                  style={[
                    styles.headerIconButton,
                    filterStatus !== 'all' && styles.headerIconButtonActive,
                  ]}
                  onPress={() =>
                    (navigation as any).navigate('OperationsFilter', {
                      selectedStatus: filterStatus,
                      onApplyFilter: handleFilterApply,
                    })
                  }
                >
                  <AntDesign
                    name="filter"
                    size={22}
                    color={filterStatus !== 'all' ? '#4CAF50' : '#000'}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'cashback' && styles.activeTab]}
              onPress={() => handleTabChange('cashback')}
            >
              <Text style={[styles.tabText, activeTab === 'cashback' && styles.activeTabText]}>
                {t('operations.cashback') || 'Keshbek'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'orders' && styles.activeTab]}
              onPress={() => handleTabChange('orders')}
            >
              <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>
                {t('operations.orders') || 'Buyurtmalar'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Filter Indicator */}
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
    </RequireAuth>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconButtonActive: {
    backgroundColor: '#E8F5E8',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandedSearchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
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
    marginTop: 12,
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
