// Business detail screen with full information
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type {
  BusinessDetailScreenNavigationProp,
  BusinessDetailScreenRouteProp,
} from '../navigation/types';
import { fetchBusinessById } from '../services/api';
import type { BusinessWithTranslation } from '../types';
import Theme from '../utils/theme';

interface Props {
  navigation: BusinessDetailScreenNavigationProp;
  route: BusinessDetailScreenRouteProp;
}

const { width: screenWidth } = Dimensions.get('window');

const BusinessDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { businessId } = route.params;
  const [business, setBusiness] = useState<BusinessWithTranslation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadBusiness();
  }, [businessId]);

  const loadBusiness = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBusinessById(businessId, 'en');
      if (data) {
        setBusiness(data);
        // Set header title to business name
        navigation.setOptions({ title: data.name });
      } else {
        setError('Business not found');
      }
    } catch (err) {
      console.error('Failed to load business:', err);
      setError('Failed to load business details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (business?.phone) {
      const phoneNumber = business.phone.replace(/\s/g, '');
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleGetDirections = () => {
    if (business) {
      const { latitude, longitude } = business;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </SafeAreaView>
    );
  }

  if (error || !business) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error || 'Business not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadBusiness}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image carousel */}
        {business.images && business.images.length > 0 ? (
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / screenWidth
                );
                setCurrentImageIndex(index);
              }}
              scrollEventThrottle={16}
            >
              {business.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
            {business.images.length > 1 && (
              <View style={styles.pagination}>
                {business.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentImageIndex && styles.paginationDotActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Images Available</Text>
          </View>
        )}

        {/* Business details */}
        <View style={styles.content}>
          <Text style={styles.businessName}>{business.name}</Text>

          {business.address && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📍</Text>
              <Text style={styles.infoText}>{business.address}</Text>
            </View>
          )}

          {business.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.infoIcon}>📞</Text>
              <Text style={styles.infoText}>{business.phone}</Text>
            </View>
          )}

          {business.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{business.description}</Text>
            </View>
          )}

          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            {business.phone && (
              <TouchableOpacity
                style={styles.callButton}
                onPress={handleCall}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonIcon}>📞</Text>
                <Text style={styles.buttonText}>Call</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.directionsButton}
              onPress={handleGetDirections}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonIcon}>🗺️</Text>
              <Text style={styles.buttonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>

          {/* GPS coordinates */}
          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesText}>
              GPS: {business.latitude.toFixed(6)}, {business.longitude.toFixed(6)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: screenWidth,
    height: 250,
    backgroundColor: Theme.colors.secondaryLight,
  },
  placeholderImage: {
    width: screenWidth,
    height: 250,
    backgroundColor: Theme.colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
  },
  pagination: {
    position: 'absolute',
    bottom: Theme.spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Theme.colors.textOnPrimary,
  },
  content: {
    padding: Theme.spacing.lg,
  },
  businessName: {
    ...Theme.typography.h1,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: Theme.spacing.sm,
  },
  infoText: {
    ...Theme.typography.body,
    color: Theme.colors.textPrimary,
    flex: 1,
  },
  descriptionContainer: {
    marginTop: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.sm,
  },
  description: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  callButton: {
    flex: 1,
    backgroundColor: Theme.colors.success,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.elevation.medium,
  },
  directionsButton: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.elevation.medium,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: Theme.spacing.sm,
  },
  buttonText: {
    ...Theme.typography.button,
    color: Theme.colors.textOnPrimary,
  },
  coordinatesContainer: {
    alignItems: 'center',
  },
  coordinatesText: {
    ...Theme.typography.caption,
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

export default BusinessDetailScreen;
