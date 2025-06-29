import { MainTabScreenProps } from '@/types/navigation';
import React, { useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import LottieView from 'lottie-react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

type OperationsScreenProps = MainTabScreenProps<'Operations'>;

export const OperationsScreen: React.FC<OperationsScreenProps> = () => {
  const animation = useRef<LottieView>(null);
  const searchInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  const { t } = useTranslation();
  const renderTabContent = () => {
    return (
      <View style={styles.emptyContainer}>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 200,
            height: 200,
            backgroundColor: '#eee',
          }}
          source={require('../../../assets/Animation - 1748335411299.json')}
        />
        <Text style={styles.emptyText}>{t('youHaveNoQueriesFound')}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 16 }}>
            <View style={styles.searchContainer}>
              <View style={styles.searchInput}>
                <TouchableOpacity onPress={() => searchInputRef.current?.focus()}>
                  <AntDesign name="search1" size={20} color="black" style={{ marginRight: 6 }} />
                </TouchableOpacity>
                <TextInput ref={searchInputRef} placeholder={t('search')} style={{ flex: 1 }} />
              </View>

              <TouchableOpacity
                style={styles.filterIcon}
                onPress={() => navigation.navigate('OperationsFilter')}
              >
                <AntDesign name="filter" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          {renderTabContent()}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  activeTab: {
    backgroundColor: '#6B7280',
  },
  tabText: {
    fontSize: 16,
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 20,
    textAlign: 'center',
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
  filterIcon: {
    padding: 8,
  },
  illustrationPlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default OperationsScreen;
