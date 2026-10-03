"use server";

import { createAdminSession, destroyAdminSession, verifyAdminSession } from "@/lib/auth/adminAuth";
import { supabase } from "@/lib/supabase/client";

export interface AuthActionResult {
  success: boolean;
  email?: string;
  role?: string;
  error?: string;
}

export async function adminLoginAction(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  try {
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const password = (formData.get("password") as string)?.trim();
    const isDemoMode = formData.get("demo") === "true";

    if (isDemoMode) {
      const demoEmail = email || "nibm_dispatcher@tapandtoggle.in";
      await createAdminSession(demoEmail, "dispatcher");
      return { success: true, email: demoEmail, role: "dispatcher" };
    }

    if (!email || !password) {
      return {
        success: false,
        error: "Please enter both operator email and password.",
      };
    }

    // 1. If live Supabase credentials configured, authenticate via Supabase Auth
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && !supabaseUrl.includes("placeholder") && !supabaseUrl.includes("your-project")) {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError || !data.user) {
        return {
          success: false,
          error: authError?.message || "Invalid operator credentials.",
        };
      }

      await createAdminSession(data.user.email || email, "admin");
      return { success: true, email: data.user.email || email, role: "admin" };
    }

    // 2. Operator password verification via environment variable
    const adminPassword = process.env.ADMIN_PASSWORD || "tapandtoggle2026";
    if (password === adminPassword) {
      await createAdminSession(email, "dispatcher");
      return { success: true, email, role: "dispatcher" };
    }

    return {
      success: false,
      error: "Invalid email or password. Please verify operator credentials.",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "An unexpected error occurred during operator authentication.",
    };
  }
}

export async function adminSignOutAction(): Promise<{ success: boolean }> {
  try {
    await destroyAdminSession();
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function checkAdminSessionAction(): Promise<{
  authenticated: boolean;
  email?: string;
  role?: string;
}> {
  const res = await verifyAdminSession();
  if (res.authenticated && res.user) {
    return {
      authenticated: true,
      email: res.user.email,
      role: res.user.role,
    };
  }
  return { authenticated: false };
}
