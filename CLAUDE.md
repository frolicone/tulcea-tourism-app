# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tulcea Tourism App is a React Native mobile application built with Expo and TypeScript for tourists visiting Tulcea, Romania. The app helps users discover local businesses in the Danube Delta region across four categories: Travel Agencies, Accommodation, Restaurants, and Bank ATMs.

**Tech Stack:**

- React Native 0.81.5 with Expo ~54.0
- TypeScript ~5.9
- Supabase (PostgreSQL + Storage) for backend
- React Navigation for routing
- react-native-maps for GPS/map features
- react-i18next for multi-language support (Romanian, English, French, German)

## Development Commands

### Running the App

```bash
npm start                 # Start Expo development server
npm run android          # Run on Android device/emulator
npm run ios              # Run on iOS device/simulator (macOS only)
npm run web              # Run in web browser
```

### Testing

Scan the QR code from `npm start` using the Expo Go app on your mobile device.

## Architecture

### Database Schema (Supabase)

The app uses a multi-language architecture with separate translation tables:

**Core Tables:**

- `categories` - Business categories with `name_key` (enum) and `icon`
- `businesses` - Business records with `category_id`, `phone`, `latitude`, `longitude`, `images[]`, `is_active`

**Translation Tables:**

- `category_translations` - Translations for category names by language
- `business_translations` - Translations for business `name`, `description`, `address` by language

All data fetching requires a language parameter to join with the appropriate translations.

### Code Structure

```
src/
├── screens/           # Full-page React components
│   ├── HomeScreen.tsx           # Category grid + "View All on Map"
│   ├── BusinessListScreen.tsx   # Filtered businesses by category
│   ├── BusinessDetailScreen.tsx # Full business info with images
│   ├── MapScreen.tsx            # Map with markers
│   └── SettingsScreen.tsx       # Language selection
├── components/        # Reusable UI components
│   └── HamburgerMenu.tsx        # Slide-in navigation menu
├── contexts/          # React contexts
│   └── LanguageContext.tsx      # App-wide language state management
├── services/          # Backend integration
│   ├── supabase.ts    # Supabase client configuration and getPublicUrl helper
│   ├── api.ts         # Data fetching functions for categories and businesses
│   └── i18n.ts        # i18next configuration with AsyncStorage persistence
├── navigation/        # React Navigation setup with typed routes
├── types/             # TypeScript interfaces for all data models
├── utils/             # Theme (Colors, Spacing, Typography, Elevation) and constants
└── locales/           # i18n translation JSON files (en, ro, fr, de)
```

### Data Flow Pattern

All API functions in `src/services/api.ts` follow this pattern:

1. Fetch base data from primary table (e.g., `businesses`)
2. Fetch translations from translation table filtered by language
3. Merge data with translations using array mapping
4. Return typed `BusinessWithTranslation` or `Category & { name: string }`

Example:

```typescript
// Always pass language parameter to API functions
const businesses = await fetchBusinessesByCategory(categoryId, 'en');
// Returns: BusinessWithTranslation[] with name, description, address merged
```

### Environment Configuration

The app requires Supabase credentials in a `.env` file:

```
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Use `.env.example` as a template. The Supabase client validates these on initialization.

### Navigation

The app uses a stack navigator with 5 screens. Screen parameters are strictly typed in `src/navigation/types.ts`:

- `Home` - No params
- `BusinessList` - Requires `{ categoryId: string, categoryName: string }`
- `BusinessDetail` - Requires `{ businessId: string }`
- `Map` - Optional `{ categoryId?: string }`
- `Settings` - No params

Navigation is also available via the HamburgerMenu component (accessed via menu icon in headers).

### Theme System

All styling uses the centralized theme in `src/utils/theme.ts`:

- **Colors**: Blue/white palette with primary `#1E88E5`, semantic colors for categories
- **Spacing**: xs(4) to xxl(48)
- **Typography**: Predefined text styles (h1, h2, h3, body, bodySmall, caption, button)
- **Elevation**: Shadow configurations for card depth

Import and use: `import Theme from '../utils/theme'`

### Type System

Key types in `src/types/index.ts`:

- `Language` - Union type for supported languages: 'en' | 'ro' | 'fr' | 'de'
- `Business` - Core business data from database
- `BusinessTranslation` - Translation-specific fields
- `BusinessWithTranslation` - Merged type with translations applied (used throughout UI)
- `Category`, `CategoryTranslation` - Similar pattern for categories

## Internationalization (i18n)

The app has full multi-language support implemented via react-i18next:

**Configuration:**

- i18next is configured in `src/services/i18n.ts` with AsyncStorage persistence
- Language state is managed globally via `LanguageContext` (`src/contexts/LanguageContext.tsx`)
- Use the `useLanguage()` hook to access `currentLanguage`, `setLanguage()`, and `isChangingLanguage`

**Translation Files:**
All UI strings are stored in `src/locales/[language].json`:

- `en.json` - English (default/fallback)
- `ro.json` - Romanian
- `fr.json` - French
- `de.json` - German

**Using Translations:**

```typescript
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';

const { t } = useTranslation();
const { currentLanguage } = useLanguage();

// Use t() for UI strings
<Text>{t('home.welcome')}</Text>

// Pass currentLanguage to API functions for dynamic content
const businesses = await fetchBusinessesByCategory(categoryId, currentLanguage);
```

**Language Selection:**
Users can change language in `SettingsScreen` which displays flag buttons for each language. The selection persists across app restarts via AsyncStorage.

## Development Guidelines

### Working with Supabase Data

- Row Level Security (RLS) is enabled with public read access for all tables
- Images are stored in the `business-images` bucket with public read access
- Use `getPublicUrl('business-images', path)` to get image URLs
- All business queries filter by `is_active = true`
- Admin write access is not yet implemented (Phase 3 pending)

### Adding Translations

When adding new UI strings:

1. Add the key to all 4 language files in `src/locales/`
2. Use dot notation for organization (e.g., `"screen.section.label"`)
3. Test with all languages to ensure nothing is missing

### Adding New Features

The project follows the roadmap in `PROJECT_PLAN.md`. Current status: Phase 5 complete, Phase 6 next.

When adding features:

- Extract reusable UI elements to `src/components/`
- Use typed navigation params from `src/navigation/types.ts`
- Follow the existing theme system for consistency
- Keep data fetching logic in `src/services/api.ts`
- Update type definitions in `src/types/index.ts` as needed
- Add translations to all locale files

### Common Patterns

**Loading States:**

```typescript
const [loading, setLoading] = useState(true);
const [data, setData] = useState<Type[]>([]);
```

**Error Handling:**

```typescript
try {
  const data = await fetchFunction();
} catch (error) {
  console.error('Error context:', error);
  // Show user-friendly error
}
```

**Navigation:**

```typescript
navigation.navigate('ScreenName', { param: value });
```

**Language-aware Data Fetching:**

```typescript
const { currentLanguage } = useLanguage();
const data = await fetchFunction(currentLanguage);
```

## Current Development Phase

**Status:** Phase 5 Complete - Multilingual support fully implemented
**Next Up:** Phase 6 - Polish, Testing & Deployment

See `PROJECT_PLAN.md` for detailed roadmap and checkpoints.

## Known Limitations

- Admin panel (Phase 3) not yet implemented - business data must be added directly to Supabase
- App icon and splash screen use default Expo assets
- No offline caching implemented yet
- Search functionality in BusinessListScreen not yet implemented
- Pull-to-refresh not yet implemented
- Category markers on map not color-coded
