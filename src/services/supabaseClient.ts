
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iplvbouruyidbvhggsdu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbHZib3VydXlpZGJ2aGdnc2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NTgwMDEsImV4cCI6MjA2NjIzNDAwMX0.eFDoICSZ000Vb68b4iH_7HpG_hD6HZrfTyS_EJnMvpk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'nightli-nova-vibes'
    }
  }
});
