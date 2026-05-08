import { createClient } from "@supabase/supabase-js";

export function getSupabase(env) {
  return createClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY
  );
}