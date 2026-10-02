import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

/**
 * Server-only Supabase client for Server Actions and backend workflows.
 * 
 * Non-negotiable safety rules:
 * 1. This client must NEVER be exported to or executed from client-side bundles.
 * 2. Secrets must only reside in process.env / .env.local.
 */
export function getAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase environment variables: Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are defined in .env.local"
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
