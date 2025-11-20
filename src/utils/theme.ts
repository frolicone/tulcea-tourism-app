// Theme configuration for Tulcea Tourism App
// Color scheme: Blue and White

export const Colors = {
  // Primary Colors
  primary: '#1E88E5',        // Main blue
  primaryDark: '#1565C0',    // Darker blue
  primaryLight: '#42A5F5',   // Lighter blue

  // Secondary Colors
  secondary: '#FFFFFF',      // White
  secondaryLight: '#F5F5F5', // Light gray (near white)

  // Accent Colors
  accent: '#0D47A1',         // Deep blue
  accentLight: '#64B5F6',    // Sky blue

  // Background Colors
  background: '#FFFFFF',
  backgroundAlt: '#E3F2FD',  // Very light blue

  // Text Colors
  textPrimary: '#212121',    // Dark gray (almost black)
  textSecondary: '#757575',  // Medium gray
  textOnPrimary: '#FFFFFF',  // White text on blue

  // Category Colors (for visual distinction)
  travelAgency: '#2196F3',   // Blue
  accommodation: '#1976D2',  // Dark blue
  restaurant: '#0288D1',     // Cyan blue
  bankATM: '#0277BD',        // Deep cyan

  // Status Colors
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',

  // Neutral Colors
  border: '#E0E0E0',
  divider: '#BDBDBD',
  disabled: '#9E9E9E',

  // Shadows
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
};

export const Elevation = {
  low: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  high: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Theme = {
  colors: Colors,
  spacing: Spacing,
  borderRadius: BorderRadius,
  typography: Typography,
  elevation: Elevation,
};

export default Theme;
