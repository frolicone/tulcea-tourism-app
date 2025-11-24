// Settings screen with language selection
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../contexts/LanguageContext';
import type { Language } from '../types';
import type { SettingsScreenNavigationProp } from '../navigation/types';
import Theme from '../utils/theme';
import logger from '../utils/logger';

interface LanguageOption {
  code: Language;
  flag: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', flag: '🇬🇧' },
  { code: 'ro', flag: '🇷🇴' },
  { code: 'fr', flag: '🇫🇷' },
  { code: 'de', flag: '🇩🇪' },
];

const SettingsScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { currentLanguage, setLanguage, isChangingLanguage } = useLanguage();

  const handleLanguageChange = async (language: Language) => {
    if (language !== currentLanguage && !isChangingLanguage) {
      try {
        await setLanguage(language);
      } catch (error) {
        logger.error('Failed to change language:', error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t('settings.title')}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          <Text style={styles.sectionSubtitle}>{t('settings.selectLanguage')}</Text>

          <View style={styles.languageGrid}>
            {LANGUAGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.code}
                style={[
                  styles.languageCard,
                  currentLanguage === option.code && styles.languageCardActive,
                ]}
                onPress={() => handleLanguageChange(option.code)}
                activeOpacity={0.7}
                disabled={isChangingLanguage}
              >
                <Text style={styles.languageFlag}>{option.flag}</Text>
                <Text
                  style={[
                    styles.languageName,
                    currentLanguage === option.code && styles.languageNameActive,
                  ]}
                >
                  {t(`languages.${option.code}`)}
                </Text>
                {currentLanguage === option.code && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkIcon}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {isChangingLanguage && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Theme.colors.primary} />
              <Text style={styles.loadingText}>{t('common.loading')}</Text>
            </View>
          )}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {t('settings.currentLanguage')}: {t(`languages.${currentLanguage}`)} (
            {currentLanguage.toUpperCase()})
          </Text>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.7}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navLabel}>{t('navigation.home')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => {}} activeOpacity={0.7}>
          <Text style={[styles.navIcon, styles.navIconActive]}>⚙️</Text>
          <Text style={[styles.navLabel, styles.navLabelActive]}>{t('navigation.settings')}</Text>
        </TouchableOpacity>
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
    marginBottom: Theme.spacing.xl,
  },
  section: {
    marginBottom: Theme.spacing.xl,
  },
  sectionTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.sm,
  },
  sectionSubtitle: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.md,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  languageCard: {
    width: '48%',
    backgroundColor: Theme.colors.secondary,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    borderWidth: 2,
    borderColor: Theme.colors.border,
    ...Theme.elevation.low,
  },
  languageCardActive: {
    borderColor: Theme.colors.primary,
    backgroundColor: Theme.colors.backgroundAlt,
    ...Theme.elevation.medium,
  },
  languageFlag: {
    fontSize: 48,
    marginBottom: Theme.spacing.sm,
  },
  languageName: {
    ...Theme.typography.body,
    color: Theme.colors.textPrimary,
    fontWeight: '600',
  },
  languageNameActive: {
    color: Theme.colors.primary,
  },
  checkmark: {
    position: 'absolute',
    top: Theme.spacing.sm,
    right: Theme.spacing.sm,
    backgroundColor: Theme.colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkIcon: {
    color: Theme.colors.textOnPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
  },
  loadingText: {
    ...Theme.typography.body,
    color: Theme.colors.textSecondary,
    marginLeft: Theme.spacing.sm,
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
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.secondary,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.lg,
    ...Theme.elevation.medium,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
    color: Theme.colors.textSecondary,
  },
  navIconActive: {
    color: Theme.colors.primary,
  },
  navLabel: {
    ...Theme.typography.caption,
    color: Theme.colors.textSecondary,
  },
  navLabelActive: {
    color: Theme.colors.primary,
    fontWeight: '600',
  },
});

export default SettingsScreen;
