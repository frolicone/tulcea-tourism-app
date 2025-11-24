// Map screen showing all businesses
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import type { MapScreenNavigationProp, MapScreenRouteProp } from '../navigation/types';
import { fetchAllBusinesses, fetchBusinessesByCategory } from '../services/api';
import type { BusinessWithTranslation } from '../types';
import Theme from '../utils/theme';
import { TULCEA_COORDINATES, MAP_DELTA } from '../utils/constants';
import logger from '../utils/logger';

interface Props {
  navigation: MapScreenNavigationProp;
  route: MapScreenRouteProp;
}

const MapScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { categoryId } = route.params || {};
  const [businesses, setBusinesses] = useState<BusinessWithTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBusinesses();
  }, [categoryId, currentLanguage]);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = categoryId
        ? await fetchBusinessesByCategory(categoryId, currentLanguage)
        : await fetchAllBusinesses(currentLanguage);
      setBusinesses(data);
    } catch (err) {
      logger.error('Failed to load businesses:', err);
      setError(t('map.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = useCallback(
    (businessId: string) => {
      navigation.navigate('BusinessDetail', { businessId });
    },
    [navigation]
  );

  const getMarkerColor = useCallback((_business: BusinessWithTranslation): string => {
    // You can customize marker colors by category in the future
    return Theme.colors.primary;
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadBusinesses}>
          <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: TULCEA_COORDINATES.latitude,
          longitude: TULCEA_COORDINATES.longitude,
          ...MAP_DELTA,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {businesses.map((business) => (
          <Marker
            key={business.id}
            coordinate={{
              latitude: business.latitude,
              longitude: business.longitude,
            }}
            title={business.name}
            description={business.address}
            pinColor={getMarkerColor(business)}
            onPress={() => handleMarkerPress(business.id)}
          />
        ))}
      </MapView>

      {businesses.length === 0 && (
        <View style={styles.emptyOverlay}>
          <Text style={styles.emptyText}>{t('map.noBusiness')}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  emptyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  emptyText: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
  },
  errorText: {
    ...Theme.typography.body,
    color: Theme.colors.error,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.xl,
  },
  retryButtonText: {
    ...Theme.typography.button,
    color: Theme.colors.textOnPrimary,
  },
});

export default MapScreen;
