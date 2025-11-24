// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration. Please check your .env file and ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set.'
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Mobile app doesn't need session persistence for public data
  },
});

// Helper function to get public URL for storage files
export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

// Export configuration for debugging (development only)
// @ts-expect-error - __DEV__ is a global variable in React Native
const isDevelopment =
  typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV === 'development';

export const config = isDevelopment
  ? {
      url: supabaseUrl,
      isConfigured: !!(supabaseUrl && supabaseAnonKey),
    }
  : {
      isConfigured: !!(supabaseUrl && supabaseAnonKey),
    };
