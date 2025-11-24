/**
 * Category utility functions
 * Shared utilities for working with business categories
 */

import type { CategoryKey } from '../types';

/**
 * Returns the emoji icon for a given category
 * @param nameKey - The category key identifier
 * @returns Emoji string representing the category
 */
export const getCategoryIcon = (nameKey: CategoryKey): string => {
  const icons: Record<CategoryKey, string> = {
    travel_agencies: '✈️',
    accommodation: '🏨',
    restaurants: '🍽️',
    bank_atms: '🏧',
  };
  return icons[nameKey] || '📍';
};
