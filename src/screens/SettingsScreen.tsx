// Settings screen (placeholder for Phase 5 - language selection)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '../utils/theme';

const SettingsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>
          Language selection will be added in Phase 5
        </Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Current Language: English (EN)
          </Text>
          <Text style={styles.infoText}>
            Available: Romanian, French, German
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  content: {
    padding: Theme.spacing.lg,
  },
  title: {
    ...Theme.typography.h2,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.md,
  },
  subtitle: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xl,
  },
  infoBox: {
    backgroundColor: Theme.colors.backgroundAlt,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.primary,
  },
  infoText: {
    ...Theme.typography.body,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.sm,
  },
});

export default SettingsScreen;
