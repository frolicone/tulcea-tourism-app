-- Add 3 new categories and sample businesses
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. INSERT NEW CATEGORIES
-- ============================================

INSERT INTO categories (name_key, icon) VALUES
  ('bars_coffee', 'coffee'),
  ('walking_tours', 'walking'),
  ('attractions', 'star')
ON CONFLICT (name_key) DO NOTHING;

-- ============================================
-- 2. INSERT CATEGORY TRANSLATIONS
-- ============================================

DO $$
DECLARE
  bars_id UUID;
  tours_id UUID;
  attractions_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO bars_id FROM categories WHERE name_key = 'bars_coffee';
  SELECT id INTO tours_id FROM categories WHERE name_key = 'walking_tours';
  SELECT id INTO attractions_id FROM categories WHERE name_key = 'attractions';

  -- Bars and Coffee Shops translations
  INSERT INTO category_translations (category_id, language, name) VALUES
    (bars_id, 'en', 'Bars & Coffee Shops'),
    (bars_id, 'ro', 'Baruri și Cafenele'),
    (bars_id, 'fr', 'Bars et Cafés'),
    (bars_id, 'de', 'Bars und Cafés')
  ON CONFLICT (category_id, language) DO NOTHING;

  -- Walking Tours translations
  INSERT INTO category_translations (category_id, language, name) VALUES
    (tours_id, 'en', 'Tulcea Walking Tours'),
    (tours_id, 'ro', 'Tururi Pedestrre Tulcea'),
    (tours_id, 'fr', 'Visites à Pied de Tulcea'),
    (tours_id, 'de', 'Tulcea Stadtrundgänge')
  ON CONFLICT (category_id, language) DO NOTHING;

  -- Tourist Attractions translations
  INSERT INTO category_translations (category_id, language, name) VALUES
    (attractions_id, 'en', 'Tourist Attractions'),
    (attractions_id, 'ro', 'Atracții Turistice'),
    (attractions_id, 'fr', 'Attractions Touristiques'),
    (attractions_id, 'de', 'Touristische Attraktionen')
  ON CONFLICT (category_id, language) DO NOTHING;
END $$;

-- ============================================
-- 3. INSERT SAMPLE BUSINESSES
-- ============================================

-- BARS AND COFFEE SHOPS
DO $$
DECLARE
  category_id UUID;
  business_id UUID;
BEGIN
  SELECT id INTO category_id FROM categories WHERE name_key = 'bars_coffee';

  -- Coffee Shop 1
  INSERT INTO businesses (category_id, phone, latitude, longitude, is_active)
  VALUES (category_id, '+40 240 234 567', 45.1795, 28.8025, true)
  RETURNING id INTO business_id;

  INSERT INTO business_translations (business_id, language, name, description, address) VALUES
    (business_id, 'en', 'Delta Coffee House', 'Cozy coffee shop in the heart of Tulcea. Fresh coffee, pastries, and free WiFi. Perfect spot to plan your Delta adventure.', 'Str. Gloriei 12, Tulcea'),
    (business_id, 'ro', 'Delta Coffee House', 'Cafenea primitoare în inima Tulcei. Cafea proaspătă, patiserie și WiFi gratuit. Locul perfect pentru a-ți planifica aventura în Deltă.', 'Str. Gloriei 12, Tulcea'),
    (business_id, 'fr', 'Delta Coffee House', 'Café confortable au cœur de Tulcea. Café frais, pâtisseries et WiFi gratuit. Endroit parfait pour planifier votre aventure dans le Delta.', 'Str. Gloriei 12, Tulcea'),
    (business_id, 'de', 'Delta Coffee House', 'Gemütliches Café im Herzen von Tulcea. Frischer Kaffee, Gebäck und kostenloses WLAN. Perfekter Ort, um Ihr Delta-Abenteuer zu planen.', 'Str. Gloriei 12, Tulcea');

  -- Bar 1
  INSERT INTO businesses (category_id, phone, latitude, longitude, is_active)
  VALUES (category_id, '+40 240 245 678', 45.1780, 28.8050, true)
  RETURNING id INTO business_id;

  INSERT INTO business_translations (business_id, language, name, description, address) VALUES
    (business_id, 'en', 'River View Lounge', 'Modern bar with stunning Danube views. Cocktails, local wines, and live music on weekends. Open until midnight.', 'Str. Portului 8, Tulcea'),
    (business_id, 'ro', 'River View Lounge', 'Bar modern cu vederi impresionante la Dunăre. Cocktailuri, vinuri locale și muzică live în weekend. Deschis până la miezul nopții.', 'Str. Portului 8, Tulcea'),
    (business_id, 'fr', 'River View Lounge', 'Bar moderne avec vue imprenable sur le Danube. Cocktails, vins locaux et musique live le week-end. Ouvert jusqu''à minuit.', 'Str. Portului 8, Tulcea'),
    (business_id, 'de', 'River View Lounge', 'Moderne Bar mit herrlichem Donau-Blick. Cocktails, lokale Weine und Live-Musik am Wochenende. Geöffnet bis Mitternacht.', 'Str. Portului 8, Tulcea');
END $$;

-- WALKING TOURS
DO $$
DECLARE
  category_id UUID;
  business_id UUID;
BEGIN
  SELECT id INTO category_id FROM categories WHERE name_key = 'walking_tours';

  -- Walking Tour 1
  INSERT INTO businesses (category_id, phone, latitude, longitude, is_active)
  VALUES (category_id, '+40 240 256 789', 45.1788, 28.8030, true)
  RETURNING id INTO business_id;

  INSERT INTO business_translations (business_id, language, name, description, address) VALUES
    (business_id, 'en', 'Tulcea Heritage Walk', 'Discover Tulcea''s rich history on this 2-hour guided walking tour. Visit historic monuments, churches, and the old town. Daily tours at 10 AM and 4 PM.', 'Meeting Point: Independence Monument, Tulcea'),
    (business_id, 'ro', 'Tur Patrimoniu Tulcea', 'Descoperă bogata istorie a Tulcei într-un tur ghidat de 2 ore. Vizitează monumente istorice, biserici și centrul vechi. Tururi zilnice la 10:00 și 16:00.', 'Punct de întâlnire: Monumentul Independenței, Tulcea'),
    (business_id, 'fr', 'Promenade Patrimoine Tulcea', 'Découvrez la riche histoire de Tulcea lors de cette visite guidée de 2 heures. Visitez les monuments historiques, les églises et la vieille ville. Visites quotidiennes à 10h et 16h.', 'Point de rencontre: Monument de l''Indépendance, Tulcea'),
    (business_id, 'de', 'Tulcea Kulturerbe-Spaziergang', 'Entdecken Sie die reiche Geschichte von Tulcea auf diesem 2-stündigen geführten Rundgang. Besuchen Sie historische Denkmäler, Kirchen und die Altstadt. Tägliche Führungen um 10 und 16 Uhr.', 'Treffpunkt: Unabhängigkeitsdenkmal, Tulcea');

  -- Walking Tour 2
  INSERT INTO businesses (category_id, phone, latitude, longitude, is_active)
  VALUES (category_id, '+40 240 267 890', 45.1775, 28.8045, true)
  RETURNING id INTO business_id;

  INSERT INTO business_translations (business_id, language, name, description, address) VALUES
    (business_id, 'en', 'Delta Nature Walk', 'Explore the unique flora and fauna of the Danube Delta. 3-hour guided nature walk with bird watching. Binoculars provided. Book in advance.', 'Str. Isaccei 15, Tulcea'),
    (business_id, 'ro', 'Plimbare Natură Delta', 'Explorează flora și fauna unică a Deltei Dunării. Plimbare ghidată de 3 ore cu observarea păsărilor. Binocluri furnizate. Rezervare în avans.', 'Str. Isaccei 15, Tulcea'),
    (business_id, 'fr', 'Promenade Nature Delta', 'Explorez la flore et la faune uniques du delta du Danube. Promenade nature guidée de 3 heures avec observation des oiseaux. Jumelles fournies. Réservation à l''avance.', 'Str. Isaccei 15, Tulcea'),
    (business_id, 'de', 'Delta Naturwanderung', 'Erkunden Sie die einzigartige Flora und Fauna des Donaudeltas. 3-stündiger geführter Naturspaziergang mit Vogelbeobachtung. Ferngläser werden bereitgestellt. Voranmeldung erforderlich.', 'Str. Isaccei 15, Tulcea');
END $$;

-- TOURIST ATTRACTIONS
DO $$
DECLARE
  category_id UUID;
  business_id UUID;
BEGIN
  SELECT id INTO category_id FROM categories WHERE name_key = 'attractions';

  -- Attraction 1
  INSERT INTO businesses (category_id, phone, latitude, longitude, is_active)
  VALUES (category_id, '+40 240 278 901', 45.1802, 28.8015, true)
  RETURNING id INTO business_id;

  INSERT INTO business_translations (business_id, language, name, description, address) VALUES
    (business_id, 'en', 'Danube Delta Museum', 'Explore the natural history and culture of the Danube Delta. Aquariums, dioramas, and interactive exhibits. Open Tuesday-Sunday, 9 AM - 5 PM.', 'Str. 14 Noiembrie 1, Tulcea'),
    (business_id, 'ro', 'Muzeul Deltei Dunării', 'Explorează istoria naturală și cultura Deltei Dunării. Acvarii, diorame și expoziții interactive. Deschis Marți-Duminică, 09:00 - 17:00.', 'Str. 14 Noiembrie 1, Tulcea'),
    (business_id, 'fr', 'Musée du Delta du Danube', 'Explorez l''histoire naturelle et la culture du delta du Danube. Aquariums, dioramas et expositions interactives. Ouvert du mardi au dimanche, de 9h à 17h.', 'Str. 14 Noiembrie 1, Tulcea'),
    (business_id, 'de', 'Donaudelta-Museum', 'Erkunden Sie die Naturgeschichte und Kultur des Donaudeltas. Aquarien, Dioramen und interaktive Ausstellungen. Geöffnet Dienstag-Sonntag, 9-17 Uhr.', 'Str. 14 Noiembrie 1, Tulcea');

  -- Attraction 2
  INSERT INTO businesses (category_id, phone, latitude, longitude, is_active)
  VALUES (category_id, '+40 240 289 012', 45.1765, 28.8060, true)
  RETURNING id INTO business_id;

  INSERT INTO business_translations (business_id, language, name, description, address) VALUES
    (business_id, 'en', 'Independence Monument', 'Historic monument commemorating Romanian independence. Panoramic city views from the top. Free admission. Great photo spot!', 'Str. Gloriei, Tulcea'),
    (business_id, 'ro', 'Monumentul Independenței', 'Monument istoric care comemorează independența României. Vedere panoramică a orașului de sus. Intrare gratuită. Loc excelent pentru fotografii!', 'Str. Gloriei, Tulcea'),
    (business_id, 'fr', 'Monument de l''Indépendance', 'Monument historique commémorant l''indépendance roumaine. Vues panoramiques sur la ville depuis le sommet. Entrée gratuite. Excellent endroit pour les photos!', 'Str. Gloriei, Tulcea'),
    (business_id, 'de', 'Unabhängigkeitsdenkmal', 'Historisches Denkmal zur Erinnerung an die rumänische Unabhängigkeit. Panoramablick über die Stadt von oben. Freier Eintritt. Toller Fotospot!', 'Str. Gloriei, Tulcea');

  -- Attraction 3
  INSERT INTO businesses (category_id, phone, latitude, longitude, is_active)
  VALUES (category_id, '+40 240 290 123', 45.1810, 28.8000, true)
  RETURNING id INTO business_id;

  INSERT INTO business_translations (business_id, language, name, description, address) VALUES
    (business_id, 'en', 'Tulcea Art Museum', 'Collection of Romanian and international art. Rotating exhibitions featuring local artists. Open Wednesday-Sunday, 10 AM - 6 PM. Small admission fee.', 'Str. Griviței 2, Tulcea'),
    (business_id, 'ro', 'Muzeul de Artă Tulcea', 'Colecție de artă românească și internațională. Expoziții rotative cu artiști locali. Deschis Miercuri-Duminică, 10:00 - 18:00. Tarif de intrare mic.', 'Str. Griviței 2, Tulcea'),
    (business_id, 'fr', 'Musée d''Art de Tulcea', 'Collection d''art roumain et international. Expositions tournantes présentant des artistes locaux. Ouvert du mercredi au dimanche, de 10h à 18h. Petit droit d''entrée.', 'Str. Griviței 2, Tulcea'),
    (business_id, 'de', 'Tulcea Kunstmuseum', 'Sammlung rumänischer und internationaler Kunst. Wechselnde Ausstellungen mit lokalen Künstlern. Geöffnet Mittwoch-Sonntag, 10-18 Uhr. Kleiner Eintrittspreis.', 'Str. Griviței 2, Tulcea');
END $$;

-- ============================================
-- DONE! You now have 7 categories total:
-- 1. Travel Agencies (1 business)
-- 2. Accommodation (0 businesses - add your own!)
-- 3. Restaurants (0 businesses - add your own!)
-- 4. Bank ATMs (0 businesses - add your own!)
-- 5. Bars & Coffee Shops (2 businesses)
-- 6. Walking Tours (2 businesses)
-- 7. Tourist Attractions (3 businesses)
-- ============================================

-- Verify the new data:
SELECT c.name_key, ct.language, ct.name, COUNT(b.id) as business_count
FROM categories c
LEFT JOIN category_translations ct ON c.id = ct.category_id
LEFT JOIN businesses b ON c.id = b.category_id
WHERE ct.language = 'en'
GROUP BY c.name_key, ct.language, ct.name, c.created_at
ORDER BY c.created_at;
