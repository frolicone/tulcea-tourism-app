-- Replace current Travel Agency with "Descopera Delta Dunării"
-- Data from: www.discoverdanubedelta.com
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. DELETE OLD TRAVEL AGENCY BUSINESS
-- ============================================

-- Delete all businesses in Travel Agencies category
-- (This will cascade delete translations too)
DELETE FROM businesses
WHERE category_id = (SELECT id FROM categories WHERE name_key = 'travel_agencies');

-- ============================================
-- 2. INSERT NEW TRAVEL AGENCY
-- ============================================

DO $$
DECLARE
  category_id UUID;
  business_id UUID;
BEGIN
  -- Get Travel Agencies category ID
  SELECT id INTO category_id FROM categories WHERE name_key = 'travel_agencies';

  -- Insert new business: Descopera Delta Dunării (Discover Danube Delta)
  INSERT INTO businesses (category_id, phone, latitude, longitude, is_active)
  VALUES (
    category_id,
    '+40 752 123 456', -- Contact via website (placeholder phone)
    45.188327, -- Correct GPS coordinates
    28.811886,
    true
  )
  RETURNING id INTO business_id;

  -- Insert translations in all 4 languages
  INSERT INTO business_translations (business_id, language, name, description, address) VALUES
    (
      business_id,
      'en',
      'Discover Danube Delta',
      'Specialized tours for nature enthusiasts in Europe''s largest wetland. Birdwatching, wildlife photography, kayaking adventures with professional local guides. Day trips and multi-day expeditions available. Visit discoverdanubedelta.com for bookings.',
      'Port Aval, Tulcea'
    ),
    (
      business_id,
      'ro',
      'Descoperă Delta Dunării',
      'Tururi specializate pentru pasionații de natură în cea mai mare zonă umedă din Europa. Observarea păsărilor, fotografie wildlife, aventuri cu caiacul cu ghizi locali profesioniști. Excursii de o zi și expediții de mai multe zile disponibile. Vizitați discoverdanubedelta.com pentru rezervări.',
      'Port Aval, Tulcea'
    ),
    (
      business_id,
      'fr',
      'Découvrir le Delta du Danube',
      'Circuits spécialisés pour les amateurs de nature dans la plus grande zone humide d''Europe. Observation des oiseaux, photographie de la faune, aventures en kayak avec des guides locaux professionnels. Excursions d''une journée et expéditions de plusieurs jours disponibles. Visitez discoverdanubedelta.com pour les réservations.',
      'Port Aval, Tulcea'
    ),
    (
      business_id,
      'de',
      'Donaudelta Entdecken',
      'Spezialisierte Touren für Naturliebhaber im größten Feuchtgebiet Europas. Vogelbeobachtung, Wildlife-Fotografie, Kajak-Abenteuer mit professionellen einheimischen Guides. Tagesausflüge und mehrtägige Expeditionen verfügbar. Besuchen Sie discoverdanubedelta.com für Buchungen.',
      'Port Aval, Tulcea'
    );
END $$;

-- ============================================
-- 3. VERIFY THE UPDATE
-- ============================================

-- Show the new travel agency
SELECT
  b.id,
  b.phone,
  b.latitude,
  b.longitude,
  bt.language,
  bt.name,
  bt.description,
  bt.address
FROM businesses b
JOIN business_translations bt ON b.id = bt.business_id
WHERE b.category_id = (SELECT id FROM categories WHERE name_key = 'travel_agencies')
ORDER BY bt.language;
