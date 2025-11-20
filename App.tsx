import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import Theme from './src/utils/theme';
import { fetchCategoriesWithTranslations } from './src/services/api';
import type { Category } from './src/types';

export default function App() {
  const [categories, setCategories] = useState<(Category & { name: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCategoriesWithTranslations('en');
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to connect to database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tulcea Tourism</Text>
        <Text style={styles.subtitle}>Discover Danube Delta</Text>
      </View>

      <Text style={styles.infoText}>Phase 2 Complete! 🎉</Text>
      <Text style={styles.bodyText}>Database connected successfully!</Text>

      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>Categories from Database:</Text>

        {loading && <ActivityIndicator size="large" color={Theme.colors.textOnPrimary} />}

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {!loading && !error && categories.length > 0 && (
          <ScrollView style={styles.categoryList}>
            {categories.map((category) => (
              <View key={category.id} style={styles.categoryItem}>
                <Text style={styles.categoryText}>✓ {category.name}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {!loading && !error && categories.length === 0 && (
          <Text style={styles.bodyText}>No categories found</Text>
        )}
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  title: {
    ...Theme.typography.h1,
    color: Theme.colors.textOnPrimary,
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    ...Theme.typography.h3,
    color: Theme.colors.accentLight,
  },
  infoText: {
    ...Theme.typography.h2,
    color: Theme.colors.textOnPrimary,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  bodyText: {
    ...Theme.typography.body,
    color: Theme.colors.textOnPrimary,
    marginBottom: Theme.spacing.lg,
  },
  categoriesContainer: {
    width: '100%',
    marginTop: Theme.spacing.lg,
    alignItems: 'center',
  },
  categoriesTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.textOnPrimary,
    marginBottom: Theme.spacing.md,
  },
  categoryList: {
    width: '100%',
    maxHeight: 200,
  },
  categoryItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
  },
  categoryText: {
    ...Theme.typography.body,
    color: Theme.colors.textOnPrimary,
    fontWeight: '600',
  },
  errorText: {
    ...Theme.typography.body,
    color: Theme.colors.error,
    backgroundColor: Theme.colors.textOnPrimary,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
});
