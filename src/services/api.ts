// API functions for fetching data from Supabase
import { supabase } from './supabase';
import type {
  Category,
  CategoryTranslation,
  Business,
  BusinessTranslation,
  BusinessWithTranslation,
  Language,
} from '../types';

/**
 * Fetch all categories
 */
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Fetch category translations for a specific language
 */
export const fetchCategoryTranslations = async (
  language: Language
): Promise<CategoryTranslation[]> => {
  try {
    const { data, error } = await supabase
      .from('category_translations')
      .select('*')
      .eq('language', language);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching category translations:', error);
    throw error;
  }
};

/**
 * Fetch categories with translations for a specific language
 */
export const fetchCategoriesWithTranslations = async (
  language: Language
): Promise<(Category & { name: string })[]> => {
  try {
    const categories = await fetchCategories();
    const translations = await fetchCategoryTranslations(language);

    // Merge categories with their translations
    return categories.map((category) => {
      const translation = translations.find((t) => t.category_id === category.id);
      return {
        ...category,
        name: translation?.name || category.name_key,
      };
    });
  } catch (error) {
    console.error('Error fetching categories with translations:', error);
    throw error;
  }
};

/**
 * Fetch businesses by category
 */
export const fetchBusinessesByCategory = async (
  categoryId: string,
  language: Language
): Promise<BusinessWithTranslation[]> => {
  try {
    // Fetch businesses
    const { data: businesses, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .order('created_at');

    if (businessError) throw businessError;

    if (!businesses || businesses.length === 0) {
      return [];
    }

    // Fetch translations for these businesses
    const businessIds = businesses.map((b) => b.id);
    const { data: translations, error: translationError } = await supabase
      .from('business_translations')
      .select('*')
      .in('business_id', businessIds)
      .eq('language', language);

    if (translationError) throw translationError;

    // Merge businesses with translations
    return businesses.map((business) => {
      const translation = translations?.find((t) => t.business_id === business.id);
      return {
        ...business,
        name: translation?.name || 'Unnamed Business',
        description: translation?.description || '',
        address: translation?.address || '',
      };
    });
  } catch (error) {
    console.error('Error fetching businesses by category:', error);
    throw error;
  }
};

/**
 * Fetch a single business with translation
 */
export const fetchBusinessById = async (
  businessId: string,
  language: Language
): Promise<BusinessWithTranslation | null> => {
  try {
    // Fetch business
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .eq('is_active', true)
      .single();

    if (businessError) throw businessError;
    if (!business) return null;

    // Fetch translation
    const { data: translation, error: translationError } = await supabase
      .from('business_translations')
      .select('*')
      .eq('business_id', businessId)
      .eq('language', language)
      .single();

    if (translationError && translationError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is okay
      throw translationError;
    }

    return {
      ...business,
      name: translation?.name || 'Unnamed Business',
      description: translation?.description || '',
      address: translation?.address || '',
    };
  } catch (error) {
    console.error('Error fetching business by ID:', error);
    throw error;
  }
};

/**
 * Fetch all active businesses (for map view)
 */
export const fetchAllBusinesses = async (
  language: Language
): Promise<BusinessWithTranslation[]> => {
  try {
    // Fetch all active businesses
    const { data: businesses, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('is_active', true)
      .order('created_at');

    if (businessError) throw businessError;

    if (!businesses || businesses.length === 0) {
      return [];
    }

    // Fetch all translations
    const businessIds = businesses.map((b) => b.id);
    const { data: translations, error: translationError } = await supabase
      .from('business_translations')
      .select('*')
      .in('business_id', businessIds)
      .eq('language', language);

    if (translationError) throw translationError;

    // Merge businesses with translations
    return businesses.map((business) => {
      const translation = translations?.find((t) => t.business_id === business.id);
      return {
        ...business,
        name: translation?.name || 'Unnamed Business',
        description: translation?.description || '',
        address: translation?.address || '',
      };
    });
  } catch (error) {
    console.error('Error fetching all businesses:', error);
    throw error;
  }
};

/**
 * Search businesses by name (in current language)
 */
export const searchBusinesses = async (
  query: string,
  language: Language
): Promise<BusinessWithTranslation[]> => {
  try {
    // First, search in translations
    const { data: translations, error: translationError } = await supabase
      .from('business_translations')
      .select('business_id')
      .eq('language', language)
      .ilike('name', `%${query}%`);

    if (translationError) throw translationError;

    if (!translations || translations.length === 0) {
      return [];
    }

    // Get the business IDs
    const businessIds = translations.map((t) => t.business_id);

    // Fetch the full businesses
    const { data: businesses, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .in('id', businessIds)
      .eq('is_active', true);

    if (businessError) throw businessError;

    if (!businesses || businesses.length === 0) {
      return [];
    }

    // Fetch all translations for these businesses
    const { data: allTranslations, error: allTranslationError } = await supabase
      .from('business_translations')
      .select('*')
      .in('business_id', businessIds)
      .eq('language', language);

    if (allTranslationError) throw allTranslationError;

    // Merge
    return businesses.map((business) => {
      const translation = allTranslations?.find((t) => t.business_id === business.id);
      return {
        ...business,
        name: translation?.name || 'Unnamed Business',
        description: translation?.description || '',
        address: translation?.address || '',
      };
    });
  } catch (error) {
    console.error('Error searching businesses:', error);
    throw error;
  }
};
