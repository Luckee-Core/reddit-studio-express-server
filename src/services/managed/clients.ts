import type { SupabaseClient } from '@supabase/supabase-js';

let managedSupabaseClient: SupabaseClient | null = null;

/**
 * Returns the managed Supabase client initialized at startup, or null if unavailable.
 */
export const getManagedSupabaseClient = (): SupabaseClient | null => managedSupabaseClient;

/**
 * Sets the managed Supabase client singleton (called once during bootstrap).
 */
export const setManagedSupabaseClient = (client: SupabaseClient): void => {
  managedSupabaseClient = client;
};
