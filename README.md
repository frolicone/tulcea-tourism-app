# Tulcea Tourism App

A mobile application for tourists visiting Tulcea, Romania to discover local businesses in the Danube Delta region.

## Features

- Browse local businesses by category (Travel Agencies, Accommodation, Restaurants, Bank ATMs)
- View business details with images, contact information, and location
- Navigate to businesses using GPS integration
- Multi-language support (Romanian, English, French, German)
- Beautiful blue and white theme

## Tech Stack

- **Framework:** React Native with Expo
- **Language:** TypeScript
- **Backend:** Supabase (PostgreSQL + Storage)
- **Maps:** react-native-maps
- **Internationalization:** react-i18next
- **Navigation:** React Navigation

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

## Project Structure

```
tulcea-tourism-app/
├── src/
│   ├── screens/          # Screen components
│   ├── components/       # Reusable UI components
│   ├── services/         # API services (Supabase, etc.)
│   ├── utils/            # Utility functions and constants
│   ├── types/            # TypeScript type definitions
│   └── locales/          # Translation files (i18n)
├── App.tsx               # Root component
├── PROJECT_PLAN.md       # Development roadmap
└── .env.example          # Environment variables template
```

## Development Progress

See [PROJECT_PLAN.md](../PROJECT_PLAN.md) for detailed development roadmap and checkpoints.

**Current Phase:** Phase 1 - Project Setup ✅ COMPLETE

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (macOS only)
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint (if configured)

## Environment Variables

- `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Support

For issues or questions, refer to:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Supabase Documentation](https://supabase.com/docs)

## License

This project is developed for educational and tourism promotion purposes.

---

**Made for Tulcea Tourism** - Discover the beauty of the Danube Delta 🌊
