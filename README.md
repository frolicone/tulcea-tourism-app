# Tulcea Tourism App

A production-ready mobile application for tourists visiting Tulcea, Romania to discover local businesses in the Danube Delta region. Built with React Native, TypeScript, and Supabase, following industry best practices for security, accessibility, and performance.

## ✨ Features

### Core Functionality
- **Browse Businesses** - Explore local businesses across 4 categories (Travel Agencies, Accommodation, Restaurants, Bank ATMs)
- **Detailed Information** - View business details with image carousel, contact information, and location
- **GPS Navigation** - Navigate to businesses using Google Maps or Waze integration
- **Interactive Map** - View all businesses on a map with custom markers
- **Multi-language Support** - Full i18n support for Romanian, English, French, and German

### User Experience
- **Responsive Design** - Beautiful blue and white theme optimized for all screen sizes
- **Loading States** - Smooth loading indicators and skeletons
- **Error Handling** - User-friendly error messages with retry functionality
- **Accessibility** - Full screen reader support (TalkBack/VoiceOver) with 50+ accessibility labels
- **Offline Resilience** - Graceful error handling when network is unavailable

## 🛠 Tech Stack

### Frontend
- **Framework:** React Native 0.81.5 with Expo ~54.0
- **Language:** TypeScript 5.9 (strict mode)
- **Navigation:** React Navigation (Stack Navigator)
- **Maps:** react-native-maps with GPS integration
- **Internationalization:** react-i18next with AsyncStorage persistence
- **State Management:** React Context API (LanguageContext)

### Backend
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage (business images)
- **API Client:** @supabase/supabase-js

### Code Quality & Testing
- **Linting:** ESLint with TypeScript, React, and React Native plugins
- **Formatting:** Prettier
- **Testing:** Jest + React Native Testing Library
- **Type Safety:** TypeScript strict mode with comprehensive type definitions

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Expo Go app on your mobile device (for testing)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Get your Supabase credentials from: https://app.supabase.com

### 3. Run the App

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run in web browser
npm run web
```

### 4. Scan QR Code

Open the Expo Go app on your phone and scan the QR code displayed in the terminal.

## 📁 Project Structure

```
tulcea-tourism-app/
├── src/
│   ├── screens/          # Screen components (5 screens)
│   │   ├── HomeScreen.tsx
│   │   ├── BusinessListScreen.tsx
│   │   ├── BusinessDetailScreen.tsx
│   │   ├── MapScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/       # Reusable UI components
│   │   ├── CategoryCard.tsx       # Memoized category card
│   │   ├── BusinessCard.tsx       # Memoized business card
│   │   ├── HamburgerMenu.tsx      # Navigation menu
│   │   └── ErrorBoundary.tsx      # Global error handler
│   ├── services/         # Backend integration
│   │   ├── supabase.ts   # Supabase client config
│   │   ├── api.ts        # Data fetching functions
│   │   └── i18n.ts       # i18next configuration
│   ├── contexts/         # React contexts
│   │   └── LanguageContext.tsx
│   ├── navigation/       # React Navigation setup
│   │   ├── AppNavigator.tsx
│   │   └── types.ts      # Typed route parameters
│   ├── utils/            # Utilities
│   │   ├── validation.ts # Input validation & sanitization
│   │   ├── logger.ts     # Production-safe logging
│   │   ├── categories.ts # Category utilities
│   │   ├── theme.ts      # Design system
│   │   └── constants.ts  # App constants
│   ├── types/            # TypeScript interfaces
│   │   └── index.ts      # Core type definitions
│   └── locales/          # Translation files (i18n)
│       ├── en.json
│       ├── ro.json
│       ├── fr.json
│       └── de.json
├── App.tsx               # Root component
├── jest.config.js        # Jest configuration
├── jest.setup.js         # Test setup & mocks
├── CODE_REVIEW_PLAN.md   # Code review results
├── TESTING_NOTES.md      # Testing documentation
└── .env.example          # Environment variables template
```

## 🎯 Code Quality & Best Practices

This project follows industry-standard best practices and has undergone comprehensive code review. See [CODE_REVIEW_PLAN.md](CODE_REVIEW_PLAN.md) for detailed analysis.

### Security (OWASP Compliant)
- ✅ **Input Validation** - All user inputs sanitized with `validation.ts` utilities
- ✅ **URL Validation** - Safe URL handling for phone calls and navigation
- ✅ **SQL Injection Protection** - Sanitized search queries with escaped wildcards
- ✅ **XSS Prevention** - Dangerous characters removed from user inputs
- ✅ **Secure Logging** - Production logs use conditional `logger.ts` (no sensitive data exposure)
- ✅ **Environment Variables** - Credentials stored in `.env` (gitignored)

### Performance Optimization
- ✅ **React.memo** - Memoized components (CategoryCard, BusinessCard) prevent unnecessary re-renders
- ✅ **useCallback** - Stable function references for all event handlers and FlatList renderItem
- ✅ **Efficient Rendering** - Image resizeMode for optimized display
- ✅ **Code Splitting** - Modular architecture with lazy loading potential

### Accessibility (WCAG Compliant)
- ✅ **Screen Reader Support** - Full TalkBack (Android) and VoiceOver (iOS) compatibility
- ✅ **Semantic Markup** - 50+ accessibilityRole, accessibilityLabel, and accessibilityHint props
- ✅ **Interactive States** - accessibilityState for selected/disabled elements
- ✅ **Image Descriptions** - Accessible labels for all images and carousels
- ✅ **Contrast & Theme** - High contrast blue/white color scheme

### Testing
- ✅ **Test Infrastructure** - Jest + React Native Testing Library configured
- ✅ **Unit Tests** - 24 tests for validation utilities (sanitization, phone, URL, UUID)
- ✅ **Component Tests** - 19 tests for CategoryCard and BusinessCard (rendering, interaction, accessibility)
- ✅ **43 Total Tests** - 364 lines of test code covering critical functionality
- ⚠️ **Known Issue** - Tests written but cannot execute due to Expo 54 + Jest compatibility (see TESTING_NOTES.md)

### Code Quality Metrics
- ✅ **ESLint** - 0 errors (38 warnings acceptable)
- ✅ **TypeScript Strict Mode** - Full type safety across entire codebase
- ✅ **DRY Principle** - Code duplication eliminated with shared utilities
- ✅ **JSDoc Comments** - Comprehensive documentation for all exported functions
- ✅ **Error Boundaries** - Global error handling to prevent app crashes

## 📜 Available Scripts

### Development
- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (macOS only)
- `npm run web` - Run in web browser

### Code Quality
- `npm run lint` - Run ESLint to check for errors
- `npm run lint:fix` - Auto-fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript compiler (no emit)

### Testing
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## 🔧 Environment Variables

Create a `.env` file in the root directory (use `.env.example` as template):

```bash
EXPO_PUBLIC_SUPABASE_URL=your-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get your credentials from [Supabase Dashboard](https://app.supabase.com)

## 🏗 Architecture

### Database Schema (Supabase)
The app uses a multi-language architecture with separate translation tables:

**Core Tables:**
- `categories` - Business categories with `name_key` and `icon`
- `businesses` - Business data with `category_id`, `phone`, `latitude`, `longitude`, `images[]`, `is_active`

**Translation Tables:**
- `category_translations` - Localized category names by language
- `business_translations` - Localized `name`, `description`, `address` by language

All data fetching requires a language parameter to join with appropriate translations.

### Design Patterns
- **Container/Presentation** - Screen components manage state, presentational components handle UI
- **Custom Hooks** - `useLanguage()` for language state management
- **Error Boundaries** - Global error catching to prevent crashes
- **Memoization** - React.memo and useCallback for performance
- **Type Safety** - Comprehensive TypeScript interfaces in `src/types/`

## 📈 Development Progress

See [PROJECT_PLAN.md](../PROJECT_PLAN.md) for complete roadmap.

**Completed Phases:**
- ✅ Phase 1: Project Setup & Environment
- ✅ Phase 2: Supabase Backend Setup
- ✅ Phase 4: Mobile App - Core Features
- ✅ Phase 5: Multilingual Support (i18n)
- ✅ Code Review: Security, Performance, Accessibility, Testing

**Current Phase:**
- 🚧 Phase 6: Polish, Testing & Deployment (~40% complete)

**Pending:**
- Phase 3: Admin Web Panel (optional for MVP)
- Phase 6: App icon, splash screen, store submission

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Development guide for AI assistants
- **[CODE_REVIEW_PLAN.md](CODE_REVIEW_PLAN.md)** - Comprehensive code review results
- **[TESTING_NOTES.md](TESTING_NOTES.md)** - Testing infrastructure documentation
- **[PROJECT_PLAN.md](../PROJECT_PLAN.md)** - Full development roadmap

## 🤝 Contributing

This project follows strict code quality standards:

1. **Before coding:**
   - Run `npm run type-check` to verify TypeScript
   - Run `npm run lint` to check ESLint rules

2. **Code style:**
   - Use TypeScript strict mode
   - Add accessibility props to all interactive elements
   - Validate all user inputs with `validation.ts` utilities
   - Use `logger.ts` instead of console.log/error

3. **Testing:**
   - Write tests for new utilities and components
   - Run `npm test` before committing

4. **Commit messages:**
   - Follow conventional commits format
   - Include affected files in commit description

## 📱 Support

For issues or questions, refer to:

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React i18next Documentation](https://react.i18next.com/)

## 📄 License

This project is developed for educational and tourism promotion purposes.

---

**Made with ❤️ for Tulcea Tourism** - Discover the beauty of the Danube Delta 🌊
