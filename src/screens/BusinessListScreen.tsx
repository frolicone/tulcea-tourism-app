// Business list screen showing businesses by category
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type {
  BusinessListScreenNavigationProp,
  BusinessListScreenRouteProp,
} from '../navigation/types';
import { fetchBusinessesByCategory } from '../services/api';
import type { BusinessWithTranslation } from '../types';
import Theme from '../utils/theme';

interface Props {
  navigation: BusinessListScreenNavigationProp;
  route: BusinessListScreenRouteProp;
}

const BusinessListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { categoryId, categoryName } = route.params;
  const [businesses, setBusinesses] = useState<BusinessWithTranslation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBusinesses();
  }, [categoryId]);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBusinessesByCategory(categoryId, 'en');
      setBusinesses(data);
    } catch (err) {
      console.error('Failed to load businesses:', err);
      setError('Failed to load businesses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessPress = (businessId: string) => {
    navigation.navigate('BusinessDetail', { businessId });
  };

  const renderBusinessItem = ({ item }: { item: BusinessWithTranslation }) => (
    <TouchableOpacity
      style={styles.businessCard}
      onPress={() => handleBusinessPress(item.id)}
      activeOpacity={0.7}
    >
      {item.images && item.images.length > 0 ? (
        <Image
          source={{ uri: item.images[0] }}
          style={styles.businessImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.businessInfo}>
        <Text style={styles.businessName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.businessDescription} numberOfLines={2}>
          {item.description}
        </Text>
        {item.phone && (
          <Text style={styles.businessPhone}>📞 {item.phone}</Text>
        )}
        {item.address && (
          <Text style={styles.businessAddress} numberOfLines={1}>
            📍 {item.address}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

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
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (businesses.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>
          No businesses found in this category yet.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={businesses}
        renderItem={renderBusinessItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: Theme.spacing.md,
  },
  businessCard: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.md,
    ...Theme.elevation.medium,
    overflow: 'hidden',
  },
  businessImage: {
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
  businessInfo: {
    padding: Theme.spacing.md,
  },
  businessName: {
    ...Theme.typography.h3,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.sm,
  },
  businessDescription: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  businessPhone: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.xs,
  },
  businessAddress: {
    ...Theme.typography.bodySmall,
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
  emptyText: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Theme.spacing.lg,
  },
});

export default BusinessListScreen;
