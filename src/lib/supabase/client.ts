import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

/**
 * Public browser-side Supabase client.
 * Strictly constrained by Row Level Security (RLS).
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
