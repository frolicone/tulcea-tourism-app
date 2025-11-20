import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Theme from './src/utils/theme';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tulcea Tourism</Text>
        <Text style={styles.subtitle}>Discover Danube Delta</Text>
      </View>
      <Text style={styles.infoText}>Phase 1 Complete! 🎉</Text>
      <Text style={styles.bodyText}>Project setup finished successfully.</Text>
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
    marginBottom: Theme.spacing.xl,
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
    marginTop: Theme.spacing.xl,
    marginBottom: Theme.spacing.md,
  },
  bodyText: {
    ...Theme.typography.body,
    color: Theme.colors.textOnPrimary,
  },
});
