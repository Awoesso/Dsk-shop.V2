import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const envSupabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Fallback to project defaults defined in .env.example
const defaultSupabaseUrl = 'https://khtndvcjfovnazdiykew.supabase.co';
const defaultSupabaseKey = 'sb_publishable_gVMdLUOal8Vv7LpWfGwQdw_yj8yv9B-';

export const supabaseUrl = envSupabaseUrl || defaultSupabaseUrl;
export const supabaseKey = envSupabaseKey || defaultSupabaseKey;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '[Supabase] Warning: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing from environment variables.'
  );
}

/**
 * Type-safe Supabase client initialized with the DSK-Shop PostgreSQL schema definition.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Helper to resolve public CDN URL for product images stored in Supabase Storage.
 * Defaults to the 'products' bucket verified during schema inspection.
 */
export function getProductImageUrl(
  storagePath: string | null | undefined,
  bucket: string = 'products'
): string {
  if (!storagePath) {
    return '';
  }

  // If the path is already an absolute HTTP/HTTPS URL, return it directly
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath;
  }

  const cleanPath = storagePath.replace(/^\/+/, '');
  const { data } = supabase.storage.from(bucket).getPublicUrl(cleanPath);
  return data?.publicUrl || '';
}

export default supabase;
