/**
 * BusinessCard component - Memoized business card for better list performance
 * Used in BusinessListScreen's FlatList
 */
import React, { memo } from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import type { BusinessWithTranslation } from '../types';
import Theme from '../utils/theme';

interface Props {
  business: BusinessWithTranslation;
  onPress: (businessId: string) => void;
  noImageText: string;
}

/**
 * BusinessCard displays a single business with image, name, description, phone, and address
 * Wrapped in React.memo to prevent unnecessary re-renders in FlatList
 */
const BusinessCard: React.FC<Props> = memo(({ business, onPress, noImageText }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(business.id)}
      activeOpacity={0.7}
    >
      {business.images && business.images.length > 0 ? (
        <Image
          source={{ uri: business.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>{noImageText}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {business.name}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {business.description}
        </Text>
        {business.phone && <Text style={styles.phone}>📞 {business.phone}</Text>}
        {business.address && (
          <Text style={styles.address} numberOfLines={1}>
            📍 {business.address}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

BusinessCard.displayName = 'BusinessCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.elevation.medium,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: Theme.colors.secondaryLight,
  },
  placeholderImage: {
    width: '100%',
    height: 150,
    backgroundColor: Theme.colors.secondaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
  },
  info: {
    padding: Theme.spacing.md,
  },
  name: {
    ...Theme.typography.h3,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.sm,
  },
  description: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  phone: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.xs,
  },
  address: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
  },
});

export default BusinessCard;
