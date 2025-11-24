import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/contexts/LanguageContext';
import ErrorBoundary from './src/components/ErrorBoundary';
import './src/services/i18n'; // Initialize i18n

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppNavigator />
        <StatusBar style="light" />
      </LanguageProvider>
    </ErrorBoundary>
  );
}
