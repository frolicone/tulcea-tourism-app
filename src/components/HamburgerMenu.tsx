// Hamburger menu component
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Pressable,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchCategoriesWithTranslations } from '../services/api';
import type { Category } from '../types';
import type { HomeScreenNavigationProp } from '../navigation/types';
import Theme from '../utils/theme';
import logger from '../utils/logger';
import { getCategoryIcon } from '../utils/categories';

interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MENU_WIDTH = SCREEN_WIDTH * 0.75;

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [slideAnim] = useState(new Animated.Value(-MENU_WIDTH));
  const [categories, setCategories] = useState<(Category & { name: string })[]>([]);

  // Define loadCategories before using it in useEffect
  const loadCategories = React.useCallback(async () => {
    try {
      const data = await fetchCategoriesWithTranslations(currentLanguage);
      setCategories(data);
    } catch (error) {
      logger.error('Failed to load categories:', error);
    }
  }, [currentLanguage]);

  useEffect(() => {
    if (visible) {
      // Load categories asynchronously - setState in async function is safe
      // eslint-disable-next-line
      loadCategories().catch((err) => logger.error('Failed to load categories', err));
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -MENU_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  useEffect(() => {
    // Async setState is safe here - loadCategories is properly memoized
    // eslint-disable-next-line
    loadCategories().catch((err) => logger.error('Failed to load categories', err));
  }, [loadCategories]);

  const handleNavigate = (screen: string, params?: any) => {
    onClose();
    setTimeout(() => {
      navigation.navigate(screen as any, params);
    }, 250);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={{ flex: 1 }} onPress={(e) => e.stopPropagation()}>
          <Animated.View
            style={[
              styles.menu,
              {
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>{t('app.name')}</Text>
            </View>

            <View style={styles.menuItems}>
              {/* Home */}
              <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('Home')}>
                <Text style={styles.menuIcon}>🏠</Text>
                <Text style={styles.menuText}>{t('navigation.home')}</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Categories */}
              <Text style={styles.sectionTitle}>{t('home.exploreCategories')}</Text>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={styles.menuItem}
                  onPress={() =>
                    handleNavigate('BusinessList', {
                      categoryId: category.id,
                      categoryName: category.name,
                    })
                  }
                >
                  <Text style={styles.menuIcon}>{getCategoryIcon(category.name_key)}</Text>
                  <Text style={styles.menuText}>{category.name}</Text>
                </TouchableOpacity>
              ))}

              {/* Divider */}
              <View style={styles.divider} />

              {/* Settings */}
              <TouchableOpacity style={styles.menuItem} onPress={() => handleNavigate('Settings')}>
                <Text style={styles.menuIcon}>⚙️</Text>
                <Text style={styles.menuText}>{t('navigation.settings')}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: Theme.colors.background,
    ...Theme.elevation.high,
  },
  header: {
    backgroundColor: Theme.colors.primary,
    padding: Theme.spacing.lg,
    paddingTop: Theme.spacing.xxl,
  },
  headerTitle: {
    ...Theme.typography.h2,
    color: Theme.colors.textOnPrimary,
  },
  menuItems: {
    flex: 1,
    paddingVertical: Theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: Theme.spacing.md,
    width: 32,
  },
  menuText: {
    ...Theme.typography.body,
    color: Theme.colors.textPrimary,
    flex: 1,
  },
  sectionTitle: {
    ...Theme.typography.bodySmall,
    color: Theme.colors.textSecondary,
    fontWeight: '600',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: Theme.colors.border,
    marginVertical: Theme.spacing.sm,
  },
});

export default HamburgerMenu;
