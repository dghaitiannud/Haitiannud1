import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://api.haitiannud.com';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InA0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MDU2MDAsImV4cCI6MjA1OTE4MTYwMH0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9fTRU2BBNWN8Bu4GE';

if (!supabaseUrl || !supabaseAnonKey) {
  const missing = [];
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missing.push('VITE_SUPABASE_ANON_KEY');
  
  throw new Error(
    `Missing required Supabase environment variables: ${missing.join(', ')}\n` +
    `Please set these in your environment variables`
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

export const ADMIN_EMAIL = 'dghaitiannud@gmail.com';
export const LIVE_ADMIN_EMAIL = 'liveadmin@gmail.com';
