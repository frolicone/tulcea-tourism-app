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
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import type {
  BusinessDetailScreenNavigationProp,
  BusinessDetailScreenRouteProp,
} from '../navigation/types';
import { fetchBusinessById } from '../services/api';
import type { BusinessWithTranslation } from '../types';
import Theme from '../utils/theme';
import { isValidPhoneNumber, isValidHttpUrl } from '../utils/validation';
import logger from '../utils/logger';

interface Props {
  navigation: BusinessDetailScreenNavigationProp;
  route: BusinessDetailScreenRouteProp;
}

const { width: screenWidth } = Dimensions.get('window');

const BusinessDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { businessId } = route.params;
  const [business, setBusiness] = useState<BusinessWithTranslation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadBusiness();
  }, [businessId, currentLanguage]);

  const loadBusiness = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBusinessById(businessId, currentLanguage);
      if (data) {
        setBusiness(data);
        // Set header title to business name
        navigation.setOptions({ title: data.name });
      } else {
        setError(t('businessDetail.notFound'));
      }
    } catch (err) {
      logger.error('Failed to load business:', err);
      setError(t('businessDetail.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (!business?.phone) {
      return;
    }

    const phoneNumber = business.phone.replace(/\s/g, '');

    // Validate phone number before attempting to call
    if (!isValidPhoneNumber(phoneNumber)) {
      Alert.alert(t('businessDetail.error'), 'Invalid phone number format', [{ text: 'OK' }]);
      logger.warn('Invalid phone number:', phoneNumber);
      return;
    }

    const telUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(telUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(telUrl);
        } else {
          Alert.alert(t('businessDetail.error'), 'Phone dialing is not supported on this device', [
            { text: 'OK' },
          ]);
        }
      })
      .catch((error) => {
        logger.error('Error opening phone dialer:', error);
        Alert.alert(t('businessDetail.error'), 'Failed to open phone dialer', [{ text: 'OK' }]);
      });
  };

  const handleOpenGoogleMaps = () => {
    if (!business) {
      return;
    }

    const { latitude, longitude } = business;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    // Validate URL before opening
    if (!isValidHttpUrl(url)) {
      Alert.alert(t('businessDetail.error'), 'Invalid navigation URL', [{ text: 'OK' }]);
      logger.warn('Invalid Google Maps URL:', url);
      return;
    }

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(t('businessDetail.error'), 'Google Maps is not available on this device', [
            { text: 'OK' },
          ]);
        }
      })
      .catch((error) => {
        logger.error('Error opening Google Maps:', error);
        Alert.alert(t('businessDetail.error'), 'Failed to open Google Maps', [{ text: 'OK' }]);
      });
  };

  const handleOpenWaze = () => {
    if (!business) {
      return;
    }

    const { latitude, longitude } = business;
    const url = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;

    // Validate URL before opening
    if (!isValidHttpUrl(url)) {
      Alert.alert(t('businessDetail.error'), 'Invalid navigation URL', [{ text: 'OK' }]);
      logger.warn('Invalid Waze URL:', url);
      return;
    }

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(t('businessDetail.error'), 'Waze is not available on this device', [
            { text: 'OK' },
          ]);
        }
      })
      .catch((error) => {
        logger.error('Error opening Waze:', error);
        Alert.alert(t('businessDetail.error'), 'Failed to open Waze', [{ text: 'OK' }]);
      });
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
        <Text style={styles.errorText}>{error || t('businessDetail.notFound')}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadBusiness}>
          <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
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
                const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
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
            <Text style={styles.placeholderText}>{t('businessDetail.noImages')}</Text>
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
              <Text style={styles.sectionTitle}>{t('businessDetail.about')}</Text>
              <Text style={styles.description}>{business.description}</Text>
            </View>
          )}

          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            {business.phone && (
              <TouchableOpacity style={styles.callButton} onPress={handleCall} activeOpacity={0.7}>
                <Text style={styles.buttonIcon}>📞</Text>
                <Text style={styles.buttonText}>{t('businessDetail.call')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Navigation buttons */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={styles.googleMapsButton}
              onPress={handleOpenGoogleMaps}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonIcon}>🗺️</Text>
              <Text style={styles.buttonText}>{t('businessDetail.googleMaps')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.wazeButton}
              onPress={handleOpenWaze}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonIcon}>🚗</Text>
              <Text style={styles.buttonText}>{t('businessDetail.waze')}</Text>
            </TouchableOpacity>
          </View>

          {/* GPS coordinates */}
          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesText}>
              {t('businessDetail.gps')}: {business.latitude.toFixed(6)},{' '}
              {business.longitude.toFixed(6)}
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
    marginBottom: Theme.spacing.md,
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
  navigationContainer: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  googleMapsButton: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.elevation.medium,
  },
  wazeButton: {
    flex: 1,
    backgroundColor: '#33CCFF',
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
