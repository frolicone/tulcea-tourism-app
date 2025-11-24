# SQL Scripts - Tulcea Tourism App

This folder contains SQL scripts for setting up and managing the Supabase database.

## 📁 Files

### 1. supabase-setup.sql
**Purpose:** Initial database schema creation

**Creates:**
- `categories` table - Business category definitions
- `businesses` table - Business records with location and contact info
- `category_translations` table - Localized category names (EN, RO, FR, DE)
- `business_translations` table - Localized business details (EN, RO, FR, DE)
- Indexes for performance optimization
- Row Level Security (RLS) policies for public read access

**When to run:** Once during initial project setup

**How to run:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the entire file
3. Click "Run"

---

### 2. supabase-add-categories.sql
**Purpose:** Seed initial category data

**Inserts:**
- 4 categories (Travel Agencies, Accommodation, Restaurants, Bank ATMs)
- Category translations for all 4 languages (EN, RO, FR, DE)

**When to run:** After running `supabase-setup.sql`

**How to run:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the entire file
3. Click "Run"

**Note:** This script uses specific UUIDs for categories. If you need to regenerate, update the category IDs throughout the script.

---

### 3. replace-travel-agency.sql
**Purpose:** Sample data for testing

**Inserts:**
- 1 sample travel agency business
- Business translations for all 4 languages
- Sample images from Supabase storage

**When to run:** For testing purposes (optional)

**How to run:**
1. Ensure you have images uploaded to Supabase storage bucket `business-images`
2. Go to Supabase Dashboard → SQL Editor
3. Copy and paste the file
4. Click "Run"

**Note:** This is example data. Replace with real business data or use the admin panel (Phase 3) to add businesses.

---

## 🔄 Execution Order

For a fresh database setup:

```
1. supabase-setup.sql       (Create schema)
2. supabase-add-categories.sql  (Add categories)
3. replace-travel-agency.sql    (Optional: Add sample data)
```

---

## 📝 Schema Overview

### Table Relationships

```
categories (id, name_key, icon, created_at)
    ↓
    ├─→ category_translations (category_id, language, name)
    └─→ businesses (id, category_id, phone, latitude, longitude, images[], is_active)
            ↓
            └─→ business_translations (business_id, language, name, description, address)
```

### Key Features

- **Multi-language support:** Separate translation tables for each language (en, ro, fr, de)
- **Row Level Security (RLS):** Public read access, admin write access
- **UUID Primary Keys:** All tables use UUID for globally unique identifiers
- **Indexes:** Optimized queries on category_id and language columns
- **Timestamps:** All records track `created_at` for auditing

---

## 🔐 Security Notes

**Current Setup:**
- ✅ RLS enabled on all tables
- ✅ Public read access (anonymous users can query data)
- ⚠️ Admin write access not yet implemented (Phase 3 pending)

**For Production:**
- Add authentication policies for admin users
- Restrict write operations to authenticated admins only
- Consider audit logging for data changes

---

## 🛠 Modifying the Schema

If you need to add fields or change the schema:

1. Create a new SQL migration file (e.g., `migration-001-add-field.sql`)
2. Test on development database first
3. Document changes in this README
4. Apply to production carefully

**Example Migration:**
```sql
-- Add email field to businesses table
ALTER TABLE businesses ADD COLUMN email VARCHAR(255);

-- Add email to business_translations would require a new migration
-- for proper multi-language support
```

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**Last Updated:** 2025-11-24
**Database Version:** 1.0.0 (Initial setup)
