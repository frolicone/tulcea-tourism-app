// API functions for fetching data from Supabase
import { supabase } from './supabase';
import type { Category, CategoryTranslation, BusinessWithTranslation, Language } from '../types';
import { sanitizeSearchQuery, isValidUUID } from '../utils/validation';
import { logApiError } from '../utils/logger';
import { API_CONFIG } from '../utils/constants';

/**
 * Wraps a promise with a timeout to prevent indefinite hanging
 * @param promise - The promise to wrap
 * @param timeoutMs - Timeout in milliseconds (default from API_CONFIG)
 * @returns Promise that rejects if timeout is reached
 */
const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number = API_CONFIG.TIMEOUT
): Promise<T> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
  );
  return Promise.race([promise, timeout]);
};

/**
 * Fetches all business categories from the database
 * @returns Promise resolving to array of categories
 * @throws Error if database query fails or times out
 */
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await withTimeout(
      supabase.from('categories').select('*').order('created_at')
    );

    if (error) throw error;
    return data || [];
  } catch (error) {
    logApiError('fetchCategories', error);
    throw error;
  }
};

/**
 * Fetches category name translations for a specific language
 * @param language - Language code (en, ro, fr, de)
 * @returns Promise resolving to array of category translations
 * @throws Error if database query fails or times out
 */
export const fetchCategoryTranslations = async (
  language: Language
): Promise<CategoryTranslation[]> => {
  try {
    const { data, error } = await withTimeout(
      supabase.from('category_translations').select('*').eq('language', language)
    );

    if (error) throw error;
    return data || [];
  } catch (error) {
    logApiError('fetchCategoryTranslations', error);
    throw error;
  }
};

/**
 * Fetches categories with their translated names merged
 * Combines category data with translations for the specified language
 * @param language - Language code (en, ro, fr, de)
 * @returns Promise resolving to array of categories with name property
 * @throws Error if database query fails or times out
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
    logApiError('fetchCategoriesWithTranslations', error);
    throw error;
  }
};

/**
 * Fetches all active businesses in a specific category with translations
 * Only returns businesses where is_active = true
 * @param categoryId - UUID of the category
 * @param language - Language code (en, ro, fr, de)
 * @returns Promise resolving to array of businesses with translated fields
 * @throws Error if categoryId is invalid or database query fails
 */
export const fetchBusinessesByCategory = async (
  categoryId: string,
  language: Language
): Promise<BusinessWithTranslation[]> => {
  try {
    // Validate categoryId is a valid UUID
    if (!isValidUUID(categoryId)) {
      throw new Error('Invalid category ID format');
    }

    // Fetch businesses
    const { data: businesses, error: businessError } = await withTimeout(
      supabase
        .from('businesses')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('created_at')
    );

    if (businessError) throw businessError;

    if (!businesses || businesses.length === 0) {
      return [];
    }

    // Fetch translations for these businesses
    const businessIds = businesses.map((b) => b.id);
    const { data: translations, error: translationError } = await withTimeout(
      supabase
        .from('business_translations')
        .select('*')
        .in('business_id', businessIds)
        .eq('language', language)
    );

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
    logApiError('fetchBusinessesByCategory', error);
    throw error;
  }
};

/**
 * Fetches a single business by ID with translated fields
 * Only returns business if is_active = true
 * @param businessId - UUID of the business
 * @param language - Language code (en, ro, fr, de)
 * @returns Promise resolving to business with translations, or null if not found
 * @throws Error if businessId is invalid or database query fails
 */
export const fetchBusinessById = async (
  businessId: string,
  language: Language
): Promise<BusinessWithTranslation | null> => {
  try {
    // Validate businessId is a valid UUID
    if (!isValidUUID(businessId)) {
      throw new Error('Invalid business ID format');
    }

    // Fetch business
    const { data: business, error: businessError } = await withTimeout(
      supabase.from('businesses').select('*').eq('id', businessId).eq('is_active', true).single()
    );

    if (businessError) throw businessError;
    if (!business) return null;

    // Fetch translation
    const { data: translation, error: translationError } = await withTimeout(
      supabase
        .from('business_translations')
        .select('*')
        .eq('business_id', businessId)
        .eq('language', language)
        .single()
    );

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
    logApiError('fetchBusinessById', error);
    throw error;
  }
};

/**
 * Fetches all active businesses with translations for map display
 * Used by MapScreen to show all businesses regardless of category
 * @param language - Language code (en, ro, fr, de)
 * @returns Promise resolving to array of businesses with translated fields
 * @throws Error if database query fails or times out
 */
export const fetchAllBusinesses = async (
  language: Language
): Promise<BusinessWithTranslation[]> => {
  try {
    // Fetch all active businesses
    const { data: businesses, error: businessError } = await withTimeout(
      supabase.from('businesses').select('*').eq('is_active', true).order('created_at')
    );

    if (businessError) throw businessError;

    if (!businesses || businesses.length === 0) {
      return [];
    }

    // Fetch all translations
    const businessIds = businesses.map((b) => b.id);
    const { data: translations, error: translationError } = await withTimeout(
      supabase
        .from('business_translations')
        .select('*')
        .in('business_id', businessIds)
        .eq('language', language)
    );

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
    logApiError('fetchAllBusinesses', error);
    throw error;
  }
};

/**
 * Searches businesses by name using case-insensitive partial matching
 * Input is sanitized and requires minimum 2 characters
 * @param query - Search query string
 * @param language - Language code (en, ro, fr, de)
 * @returns Promise resolving to array of matching businesses with translations
 * @throws Error if database query fails or times out
 * @example
 * const results = await searchBusinesses('hotel', 'en');
 */
export const searchBusinesses = async (
  query: string,
  language: Language
): Promise<BusinessWithTranslation[]> => {
  try {
    // Validate and sanitize search query
    if (!query || typeof query !== 'string') {
      return [];
    }

    const sanitizedQuery = sanitizeSearchQuery(query);
    if (sanitizedQuery.length < 2) {
      return []; // Require at least 2 characters for search
    }

    // First, search in translations
    const { data: translations, error: translationError } = await withTimeout(
      supabase
        .from('business_translations')
        .select('business_id')
        .eq('language', language)
        .ilike('name', `%${sanitizedQuery}%`)
    );

    if (translationError) throw translationError;

    if (!translations || translations.length === 0) {
      return [];
    }

    // Get the business IDs
    const businessIds = translations.map((t) => t.business_id);

    // Fetch the full businesses
    const { data: businesses, error: businessError } = await withTimeout(
      supabase.from('businesses').select('*').in('id', businessIds).eq('is_active', true)
    );

    if (businessError) throw businessError;

    if (!businesses || businesses.length === 0) {
      return [];
    }

    // Fetch all translations for these businesses
    const { data: allTranslations, error: allTranslationError } = await withTimeout(
      supabase
        .from('business_translations')
        .select('*')
        .in('business_id', businessIds)
        .eq('language', language)
    );

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
    logApiError('searchBusinesses', error);
    throw error;
  }
};
