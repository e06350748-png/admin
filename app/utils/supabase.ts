import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase env variables are missing.");
  throw new Error("Missing Supabase configuration");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      apikey: supabaseAnonKey,
    },
  },
});

supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.warn("⚠️ Supabase auth check failed:", error.message);
  }
});

supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
  } else {
    console.warn("No active session");
  }
});
