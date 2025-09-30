import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';
import { colors } from '@/constants/colors';
import { YaMap, Marker } from 'react-native-yamap';
import YaMapKit from 'react-native-yamap';
import { YANDEX_MAPS_API_KEY } from '@/config/constants';

// Initialize Yandex Maps safely
try {
  if (YANDEX_MAPS_API_KEY && YANDEX_MAPS_API_KEY !== 'fbb1f150-1a3d-4c9b-9ecc-7a6c6f21ef02') {
    YaMapKit.init(YANDEX_MAPS_API_KEY);
  }
} catch (error) {
  console.warn('Yandex Maps initialization failed:', error);
}

type BranchesScreenProps = NativeStackScreenProps<RootStackParamList, 'Branches'>;

type Branch = {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};

const branches: Branch[] = [
  {
    id: '1',
    name: "Qo'qon shahri",
    address: "Alisher Navoi ko'chasi, 30-uy",
    coordinates: {
      latitude: 40.5284,
      longitude: 70.9425,
    },
  },
  {
    id: '2',
    name: 'Qashqadaryo shahri ombor',
    address: "Tukmangit ko'chasi",
    coordinates: {
      latitude: 38.8347,
      longitude: 65.7889,
    },
  },
  {
    id: '3',
    name: 'Termiz shahri',
    address: "Ibn Sina ko'chasi",
    coordinates: {
      latitude: 37.2218,
      longitude: 67.2783,
    },
  },
  {
    id: '4',
    name: 'Samarqand shahri ombor',
    address: 'Samarkand viloyati, Samarkand shaxri, chupon ota, 68',
    coordinates: {
      latitude: 39.6273,
      longitude: 66.975,
    },
  },
];

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 4;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export const BranchesScreen: React.FC<BranchesScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const [selectedBranch, setSelectedBranch] = React.useState<Branch | null>(null);

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    // if (route.params?.onSelect) {
    //   route.params.onSelect(`${branch.name}, ${branch.address}`);
    //   navigation.goBack();
    // }
  };

  const initialRegion = {
    latitude: 41.2995,
    longitude: 69.2401,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const renderBranchItem = ({ item }: { item: Branch }) => (
    <TouchableOpacity
      style={[styles.branchItem, selectedBranch?.id === item.id && styles.selectedBranchItem]}
      onPress={() => handleBranchSelect(item)}
    >
      <Ionicons
        name="location-outline"
        size={24}
        color={selectedBranch?.id === item.id ? colors.white : '#EF4444'}
      />
      <View style={styles.branchInfo}>
        <Text
          style={[styles.branchName, selectedBranch?.id === item.id && styles.selectedBranchText]}
        >
          {item.name}
        </Text>
        <Text
          style={[
            styles.branchAddress,
            selectedBranch?.id === item.id && styles.selectedBranchText,
          ]}
        >
          {item.address}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filiallar</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.mapContainer}>
        {YANDEX_MAPS_API_KEY && YANDEX_MAPS_API_KEY !== 'fbb1f150-1a3d-4c9b-9ecc-7a6c6f21ef02' ? (
          <YaMap
            style={styles.map}
            initialRegion={{
              lat: initialRegion.latitude,
              lon: initialRegion.longitude,
              zoom: 10,
            }}
            showUserPosition={false}
            zoomGesturesEnabled={true}
            scrollGesturesEnabled={true}
          >
            {branches.map((branch) => (
              <Marker
                key={branch.id}
                point={{
                  lat: branch.coordinates.latitude,
                  lon: branch.coordinates.longitude,
                }}
                source={{
                  uri: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTIiIGZpbGw9IiNFRjQ0NDQiLz4KPC9zdmc+',
                }}
                onPress={() => setSelectedBranch(branch)}
              />
            ))}
          </YaMap>
        ) : (
          <View
            style={[
              styles.map,
              { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
            ]}
          >
            <Ionicons name="map-outline" size={50} color="#ccc" />
            <Text style={{ textAlign: 'center', color: '#666', fontSize: 16, marginTop: 10 }}>
              Yandex Maps API key kerak
            </Text>
            <Text style={{ textAlign: 'center', color: '#999', fontSize: 12, marginTop: 5 }}>
              Constants faylida API kalitni qo'shing
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Qaysi do'kondan olib ketiladi?</Text>

      <FlatList
        data={branches}
        renderItem={renderBranchItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.branchList}
        ListFooterComponent={<View style={{ height: 200 }} />}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.selectButton, selectedBranch && styles.activeSelectButton]}
          onPress={() => selectedBranch && handleBranchSelect(selectedBranch)}
        >
          <Text style={styles.selectButtonText}>Tanlash</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mapContainer: {
    height: 300,
    backgroundColor: '#F3F4F6',
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  branchList: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  branchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  selectedBranchItem: {
    backgroundColor: colors.green,
  },
  selectedBranchText: {
    color: colors.white,
  },
  branchInfo: {
    marginLeft: 12,
    flex: 1,
  },
  branchName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  branchAddress: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    backgroundColor: colors.white,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    height: 100,
  },
  selectButton: {
    backgroundColor: '#6B7280',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    bottom: 90,
    width: '90%',
    margin: 16,
  },
  activeSelectButton: {
    backgroundColor: '#EF4444',
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default BranchesScreen;
