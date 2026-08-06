import GoBackHeader from '@/components/GoBackHeader';
import { makePhoneCall } from '@/constants/constants';
import { useGetCities } from '@/hooks/querys';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

type Location = {
  id: number;
  city_id: number;
  address: string;
  phone: string;
  location: string;
};

type City = {
  id: number;
  name: string;
  locations: Location[];
};

export const CityScreen = () => {
  const { t, i18n } = useTranslation();
  const { data: citiesData, refetch, isLoading } = useGetCities(i18n.language);

  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const filteredCities: City[] = Array.isArray(citiesData)
    ? (citiesData as City[]).filter((c) => Array.isArray(c.locations) && c.locations.length > 0)
    : [];

  useEffect(() => {
    refetch();
  }, [i18n.language]);

  useEffect(() => {
    if (filteredCities && filteredCities.length > 0 && selectedCityId === null) {
      setSelectedCityId(filteredCities[0].id);
    }
  }, [filteredCities, selectedCityId]);

  const selectedCity = React.useMemo(() => {
    if (!filteredCities || selectedCityId === null) return null;
    return filteredCities.find((c: City) => c.id === selectedCityId) || null;
  }, [filteredCities, selectedCityId]);

  const handleCitySelect = (city: City) => {
    setSelectedCityId(city.id);
    setIsDropdownOpen(false);
  };

  const extractCoordinates = (locationString: string) => {
    try {
      const llMatch = locationString.match(/ll=([\d.-]+)[,%2C]+([\d.-]+)/);
      if (llMatch) {
        return {
          longitude: parseFloat(llMatch[1]), // 1-chi indeks longitude
          latitude: parseFloat(llMatch[2]), // 2-chi indeks latitude
        };
      }
    } catch (error) {
      console.log('Error extracting coordinates:', error);
    }
    return null;
  };

  // Map region based on selected city
  const mapRegion = React.useMemo(() => {
    if (selectedCity && selectedCity.locations.length > 0) {
      const firstLocation = selectedCity.locations[0];
      const coordinates = extractCoordinates(firstLocation.location);
      if (coordinates) {
        return {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };
      }
    }
    return {
      latitude: 41.2995,
      longitude: 69.2401,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  }, [selectedCity]);

  const markers = React.useMemo(() => {
    if (!selectedCity) return [];
    return selectedCity.locations
      .map((location: { location: string; id: any; address: any; phone: any }) => {
        const coordinates = extractCoordinates(location.location);
        if (coordinates) {
          return {
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
            id: location.id,
            title: selectedCity.name,
            description: location.address,
            phone: location.phone,
          };
        }
        return null;
      })
      .filter(Boolean) as Array<{
      latitude: number;
      longitude: number;
      id: number;
      title: string;
      description: string;
      phone: string;
    }>;
  }, [selectedCity]);

  const renderCityItem = ({ item }: { item: City }) => (
    <TouchableOpacity
      style={[styles.cityItem, selectedCity?.id === item.id && styles.selectedCityItem]}
      onPress={() => handleCitySelect(item)}
    >
      <Text style={[styles.cityText, selectedCity?.id === item.id && styles.selectedCityText]}>
        {item.name}
      </Text>
      {selectedCity?.id === item.id && <Ionicons name="checkmark" size={20} color="#007AFF" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <GoBackHeader title={t('profilePage.city')} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.dropdownButton} onPress={() => setIsDropdownOpen(true)}>
          <Text style={styles.dropdownText}>
            {selectedCity ? selectedCity.name : t('profilePage.selectCity')}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {/* Map Container */}
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={mapRegion}
            showsUserLocation={false}
            showsMyLocationButton={false}
            toolbarEnabled={false}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.title}
                description={marker.description}
              >
                <View style={styles.markerContainer}>
                  <Ionicons name="location" size={30} color="#e74c3c" />
                </View>
              </Marker>
            ))}
          </MapView>

          {selectedCity && selectedCity.locations.length > 0 && (
            <View style={styles.locationInfo}>
              <Text style={styles.locationTitle}>{selectedCity.name}</Text>
              {selectedCity.locations.map((location: { id: any; address: any; phone: any }) => (
                <View key={location.id} style={styles.locationItem}>
                  <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={16} color="#666" />
                    <Text style={styles.locationAddress}>{location.address}</Text>
                  </View>
                  <View style={styles.locationRow}>
                    <Ionicons name="call-outline" size={16} color="#666" />
                    <Text
                      style={styles.locationPhone}
                      onPress={() => makePhoneCall(location.phone)}
                    >
                      {location.phone}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <Modal
          visible={isDropdownOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsDropdownOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsDropdownOpen(false)}
          >
            <View style={styles.dropdownContainer}>
              <View style={styles.dropdownHeader}>
                <Text style={styles.dropdownTitle}>{t('profilePage.selectCity')}</Text>
                <TouchableOpacity onPress={() => setIsDropdownOpen(false)}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={filteredCities}
                renderItem={renderCityItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.cityList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cityList: {
    maxHeight: 400,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  selectedCityItem: {
    backgroundColor: '#f0f8ff',
  },
  cityText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  selectedCityText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  mapContainer: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  map: {
    width: '100%',
    height: 250,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingHorizontal: 16,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  locationItem: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  locationPhone: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 8,
  },
});
