/**
 * CategoryCard component - Memoized category card for better list performance
 * Used in HomeScreen's category grid
 */
import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { Category } from '../types';
import Theme from '../utils/theme';
import { getCategoryIcon } from '../utils/categories';

interface Props {
  category: Category & { name: string };
  onPress: (category: Category & { name: string }) => void;
}

/**
 * CategoryCard displays a single category with icon and name
 * Wrapped in React.memo to prevent unnecessary re-renders
 */
const CategoryCard: React.FC<Props> = memo(({ category, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(category)}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{getCategoryIcon(category.name_key)}</Text>
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  );
});

CategoryCard.displayName = 'CategoryCard';

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: Theme.colors.primary,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    ...Theme.elevation.medium,
  },
  icon: {
    fontSize: 48,
    marginBottom: Theme.spacing.sm,
  },
  name: {
    ...Theme.typography.body,
    color: Theme.colors.textOnPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CategoryCard;
