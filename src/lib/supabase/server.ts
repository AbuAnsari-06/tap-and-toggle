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
  const supabaseUrl = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_TAP_AND_TOGGLE_SUPABASE_URL ||
    process.env.TAP_AND_TOGGLE_SUPABASE_URL ||
    ""
  ).trim();

  const serviceRoleKey = (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.TAP_AND_TOGGLE_SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_TAP_AND_TOGGLE_SUPABASE_PUBLISHABLE_KEY ||
    ""
  ).trim();

  if (
    !supabaseUrl ||
    !serviceRoleKey ||
    supabaseUrl.includes("your-project") ||
    supabaseUrl.includes("placeholder") ||
    serviceRoleKey.includes("your-service-role-key") ||
    serviceRoleKey.includes("placeholder")
  ) {
    throw new Error(
      "Missing or default Supabase environment variables: Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are defined in .env.local or Vercel Settings"
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
