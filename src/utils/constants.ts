// Constants for Tulcea Tourism App

// Tulcea, Romania coordinates (center of the city)
export const TULCEA_COORDINATES = {
  latitude: 45.1785,
  longitude: 28.8039,
};

export const MAP_DELTA = {
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

// Language configuration
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
] as const;

export const DEFAULT_LANGUAGE = 'en';

// Category icons (can be updated with actual icon names from icon library)
export const CATEGORY_ICONS = {
  travel_agencies: 'airplane',
  accommodation: 'bed',
  restaurants: 'restaurant',
  bank_atms: 'cash',
} as const;

// API configuration
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
};
