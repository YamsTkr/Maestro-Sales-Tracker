import { createClient } from '@supabase/supabase-js';

// Ces variables seront définies après la configuration de votre projet Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configuration pour Expo
    storage: undefined, // Utilise le stockage par défaut d'Expo
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Types pour notre application
export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  level: string;
  level_name: string;
  created_at: string;
  updated_at: string;
}

export interface UserPresence {
  id: string;
  user_id: string;
  week_date: string; // Format: YYYY-MM-DD (lundi de la semaine)
  day_of_week: string; // lundi, mardi, etc.
  presence_type: string; // formation_bureau, direct_terrain, etc.
  morning_activity: string;
  afternoon_activity: string;
  evening_activity: string;
  objectives_vus: number;
  objectives_closes: number;
  objectives_telephones: number;
  objectives_ventes: number;
  created_at: string;
  updated_at: string;
}