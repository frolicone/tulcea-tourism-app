-- Tulcea Tourism App - Database Schema
-- Run this script in Supabase SQL Editor
-- https://app.supabase.com/project/fvupazimozherjhgmekk/editor/sql

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Categories table (Travel Agencies, Accommodation, Restaurants, Bank ATMs)
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_key TEXT NOT NULL UNIQUE, -- 'travel_agencies', 'accommodation', 'restaurants', 'bank_atms'
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Category translations (multi-language support)
CREATE TABLE IF NOT EXISTS category_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  language TEXT NOT NULL, -- 'en', 'ro', 'fr', 'de'
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, language)
);

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  phone TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  images TEXT[] DEFAULT '{}', -- Array of image URLs
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business translations (multi-language support)
CREATE TABLE IF NOT EXISTS business_translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  language TEXT NOT NULL, -- 'en', 'ro', 'fr', 'de'
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, language)
);

-- ============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_businesses_active ON businesses(is_active);
CREATE INDEX IF NOT EXISTS idx_business_translations_business ON business_translations(business_id);
CREATE INDEX IF NOT EXISTS idx_business_translations_language ON business_translations(language);
CREATE INDEX IF NOT EXISTS idx_category_translations_category ON category_translations(category_id);
CREATE INDEX IF NOT EXISTS idx_category_translations_language ON category_translations(language);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_translations ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE SECURITY POLICIES
-- ============================================

-- Public read access to all tables (tourists can view all data)
CREATE POLICY "Public read access for categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Public read access for category_translations"
  ON category_translations FOR SELECT
  USING (true);

CREATE POLICY "Public read access for active businesses"
  ON businesses FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public read access for business_translations"
  ON business_translations FOR SELECT
  USING (true);

-- Admin write access (we'll set this up later with authentication)
-- For now, you can insert data using the SQL editor

-- ============================================
-- 5. INSERT INITIAL CATEGORIES
-- ============================================

-- Insert 4 main categories
INSERT INTO categories (name_key, icon) VALUES
  ('travel_agencies', 'airplane'),
  ('accommodation', 'bed'),
  ('restaurants', 'restaurant'),
  ('bank_atms', 'cash')
ON CONFLICT (name_key) DO NOTHING;

-- ============================================
-- 6. INSERT CATEGORY TRANSLATIONS
-- ============================================

-- Get category IDs for translations
DO $$
DECLARE
  travel_id UUID;
  accommodation_id UUID;
  restaurant_id UUID;
  atm_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO travel_id FROM categories WHERE name_key = 'travel_agencies';
  SELECT id INTO accommodation_id FROM categories WHERE name_key = 'accommodation';
  SELECT id INTO restaurant_id FROM categories WHERE name_key = 'restaurants';
  SELECT id INTO atm_id FROM categories WHERE name_key = 'bank_atms';

  -- Travel Agencies translations
  INSERT INTO category_translations (category_id, language, name) VALUES
    (travel_id, 'en', 'Travel Agencies'),
    (travel_id, 'ro', 'Agenții de Turism'),
    (travel_id, 'fr', 'Agences de Voyage'),
    (travel_id, 'de', 'Reisebüros')
  ON CONFLICT (category_id, language) DO NOTHING;

  -- Accommodation translations
  INSERT INTO category_translations (category_id, language, name) VALUES
    (accommodation_id, 'en', 'Accommodation'),
    (accommodation_id, 'ro', 'Cazare'),
    (accommodation_id, 'fr', 'Hébergement'),
    (accommodation_id, 'de', 'Unterkunft')
  ON CONFLICT (category_id, language) DO NOTHING;

  -- Restaurants translations
  INSERT INTO category_translations (category_id, language, name) VALUES
    (restaurant_id, 'en', 'Restaurants'),
    (restaurant_id, 'ro', 'Restaurante'),
    (restaurant_id, 'fr', 'Restaurants'),
    (restaurant_id, 'de', 'Restaurants')
  ON CONFLICT (category_id, language) DO NOTHING;

  -- Bank ATMs translations
  INSERT INTO category_translations (category_id, language, name) VALUES
    (atm_id, 'en', 'Bank ATMs'),
    (atm_id, 'ro', 'Bancomate'),
    (atm_id, 'fr', 'Distributeurs Automatiques'),
    (atm_id, 'de', 'Geldautomaten')
  ON CONFLICT (category_id, language) DO NOTHING;
END $$;

-- ============================================
-- 7. INSERT SAMPLE BUSINESS DATA
-- ============================================

-- Insert a sample travel agency
DO $$
DECLARE
  travel_id UUID;
  business_id UUID;
BEGIN
  SELECT id INTO travel_id FROM categories WHERE name_key = 'travel_agencies';

  INSERT INTO businesses (category_id, phone, latitude, longitude, is_active)
  VALUES (travel_id, '+40 240 123 456', 45.1785, 28.8039, true)
  RETURNING id INTO business_id;

  -- Add translations
  INSERT INTO business_translations (business_id, language, name, description, address) VALUES
    (business_id, 'en', 'Danube Delta Tours', 'Explore the Danube Delta with experienced guides. Boat trips, bird watching, and fishing tours available.', 'Str. Portului 1, Tulcea'),
    (business_id, 'ro', 'Tururi Delta Dunării', 'Explorați Delta Dunării cu ghizi experimentați. Plimbări cu barca, observarea păsărilor și tururi de pescuit disponibile.', 'Str. Portului 1, Tulcea'),
    (business_id, 'fr', 'Circuits dans le Delta du Danube', 'Explorez le delta du Danube avec des guides expérimentés. Promenades en bateau, observation des oiseaux et circuits de pêche disponibles.', 'Str. Portului 1, Tulcea'),
    (business_id, 'de', 'Donaudelta-Touren', 'Erkunden Sie das Donaudelta mit erfahrenen Führern. Bootsfahrten, Vogelbeobachtung und Angeltouren verfügbar.', 'Str. Portului 1, Tulcea');
END $$;

-- ============================================
-- SETUP COMPLETE!
-- ============================================

-- Verify the setup by running these queries:
-- SELECT * FROM categories;
-- SELECT * FROM category_translations ORDER BY category_id, language;
-- SELECT * FROM businesses;
-- SELECT * FROM business_translations;
