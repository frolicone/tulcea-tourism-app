// Business list screen showing businesses by category
import React, { useEffect, useState, useCallback } from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import type {
  BusinessListScreenNavigationProp,
  BusinessListScreenRouteProp,
} from '../navigation/types';
import { fetchBusinessesByCategory } from '../services/api';
import type { BusinessWithTranslation } from '../types';
import Theme from '../utils/theme';
import logger from '../utils/logger';
import BusinessCard from '../components/BusinessCard';

interface Props {
  navigation: BusinessListScreenNavigationProp;
  route: BusinessListScreenRouteProp;
}

const BusinessListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { categoryId } = route.params;
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
      const data = await fetchBusinessesByCategory(categoryId, currentLanguage);
      setBusinesses(data);
    } catch (err) {
      logger.error('Failed to load businesses:', err);
      setError(t('businessList.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessPress = useCallback(
    (businessId: string) => {
      navigation.navigate('BusinessDetail', { businessId });
    },
    [navigation]
  );

  const renderBusinessItem = useCallback(
    ({ item }: { item: BusinessWithTranslation }) => (
      <BusinessCard
        business={item}
        onPress={handleBusinessPress}
        noImageText={t('businessList.noImage')}
      />
    ),
    [handleBusinessPress, t]
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
          <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (businesses.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>{t('businessList.noBusiness')}</Text>
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
