// Type definitions for Tulcea Tourism App

export type Language = 'en' | 'ro' | 'fr' | 'de';

export type CategoryKey = 'travel_agencies' | 'accommodation' | 'restaurants' | 'bank_atms';

export interface Category {
  id: string;
  name_key: CategoryKey;
  icon: string;
  created_at: string;
}

export interface CategoryTranslation {
  id: string;
  category_id: string;
  language: Language;
  name: string;
  created_at: string;
}

export interface Business {
  id: string;
  category_id: string;
  phone: string;
  latitude: number;
  longitude: number;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BusinessTranslation {
  id: string;
  business_id: string;
  language: Language;
  name: string;
  description: string;
  address: string;
  created_at: string;
}

export interface BusinessWithTranslation extends Business {
  name: string;
  description: string;
  address: string;
  category_name?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}
