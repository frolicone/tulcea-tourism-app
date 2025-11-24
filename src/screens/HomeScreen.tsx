// Home screen with category selection
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import type { HomeScreenNavigationProp } from '../navigation/types';
import { fetchCategoriesWithTranslations } from '../services/api';
import type { Category } from '../types';
import Theme from '../utils/theme';
import logger from '../utils/logger';

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [categories, setCategories] = useState<(Category & { name: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, [currentLanguage]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCategoriesWithTranslations(currentLanguage);
      setCategories(data);
    } catch (err) {
      logger.error('Failed to load categories:', err);
      setError(t('home.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category: Category & { name: string }) => {
    navigation.navigate('BusinessList', {
      categoryId: category.id,
      categoryName: category.name,
    });
  };

  const handleMapPress = () => {
    navigation.navigate('Map', {});
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  const getCategoryIcon = (nameKey: string): string => {
    switch (nameKey) {
      case 'travel_agencies':
        return '✈️';
      case 'accommodation':
        return '🏨';
      case 'restaurants':
        return '🍽️';
      case 'bank_atms':
        return '🏧';
      default:
        return '📍';
    }
  };

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
        <TouchableOpacity style={styles.retryButton} onPress={loadCategories}>
          <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('home.welcome')}</Text>
          <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>{t('home.exploreCategories')}</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryIcon}>{getCategoryIcon(category.name_key)}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.mapButton} onPress={handleMapPress} activeOpacity={0.7}>
          <Text style={styles.mapButtonIcon}>🗺️</Text>
          <Text style={styles.mapButtonText}>{t('home.viewAllOnMap')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => {}} activeOpacity={0.7}>
          <Text style={[styles.navIcon, styles.navIconActive]}>🏠</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>{t('navigation.home')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navButton}
          onPress={handleSettingsPress}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navLabel}>{t('navigation.settings')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    padding: Theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  title: {
    ...Theme.typography.h1,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    ...Theme.typography.h3,
    color: Theme.colors.textSecondary,
  },
  categoriesContainer: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    ...Theme.typography.h2,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.md,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    ...Theme.elevation.medium,
  },
  categoryIcon: {
    fontSize: 48,
    marginBottom: Theme.spacing.sm,
  },
  categoryName: {
    ...Theme.typography.body,
    color: Theme.colors.textOnPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  mapButton: {
    backgroundColor: Theme.colors.accent,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.elevation.medium,
  },
  mapButtonIcon: {
    fontSize: 24,
    marginRight: Theme.spacing.sm,
  },
  mapButtonText: {
    ...Theme.typography.button,
    color: Theme.colors.textOnPrimary,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.secondary,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    ...Theme.elevation.medium,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
    color: Theme.colors.textSecondary,
  },
  navIconActive: {
    color: Theme.colors.primary,
  },
  navLabel: {
    ...Theme.typography.caption,
    color: Theme.colors.textSecondary,
  },
  navLabelActive: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  errorText: {
    ...Theme.typography.body,
    color: Theme.colors.error,
    textAlign: 'center',
    marginBottom: Theme.spacing.md,
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

export default HomeScreen;
