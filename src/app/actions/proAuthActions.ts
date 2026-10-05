"use server";

import {
  createProSession,
  destroyProSession,
  verifyProSession,
  verifyProPin,
  hashProPin,
} from "@/lib/auth/proAuth";
import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { Pro } from "@/types/database";

export interface ProAuthActionResult {
  success: boolean;
  pro?: {
    id: string;
    name: string;
    phone: string;
    service: string;
  };
  error?: string;
}

// Fallback seed pros with default demo PIN "1234"
const SEED_PROS: Pro[] = [
  {
    id: "pro-001",
    name: "Ramesh Shinde",
    phone: "+91 98220 11111",
    service: "plumbing",
    photo: null,
    active: true,
    base_rate: 350,
    pin_hash: hashProPin("1234"),
    vetting_docs_ref: "Aadhaar verified · Police verification on file",
    gate_list_status: "approved",
    health_score: 4.9,
    created_at: new Date().toISOString(),
  },
  {
    id: "pro-002",
    name: "Suresh Patil",
    phone: "+91 98220 22222",
    service: "plumbing",
    photo: null,
    active: true,
    base_rate: 350,
    pin_hash: hashProPin("1234"),
    vetting_docs_ref: "Aadhaar verified",
    gate_list_status: "approved",
    health_score: 4.8,
    created_at: new Date().toISOString(),
  },
  {
    id: "pro-003",
    name: "Amit Deshmukh",
    phone: "+91 98220 33333",
    service: "electrical",
    photo: null,
    active: true,
    base_rate: 300,
    pin_hash: hashProPin("1234"),
    vetting_docs_ref: "Aadhaar verified · Wireman License #MH-10293",
    gate_list_status: "approved",
    health_score: 5.0,
    created_at: new Date().toISOString(),
  },
  {
    id: "pro-004",
    name: "Vikas More",
    phone: "+91 98220 44444",
    service: "electrical",
    photo: null,
    active: true,
    base_rate: 300,
    pin_hash: hashProPin("1234"),
    vetting_docs_ref: "Aadhaar verified · Wireman License #MH-10884",
    gate_list_status: "approved",
    health_score: 4.7,
    created_at: new Date().toISOString(),
  },
];

/**
 * Normalizes phone numbers to compare uniformly
 */
function cleanPhone(phone: string): string {
  return phone.replace(/[^0-9]/g, "").slice(-10);
}

export async function proLoginAction(
  prevState: ProAuthActionResult | null,
  formData: FormData
): Promise<ProAuthActionResult> {
  try {
    const rawPhone = (formData.get("phone") as string)?.trim();
    const pin = (formData.get("pin") as string)?.trim();
    const isDemo = formData.get("demo") === "true";

    if (isDemo) {
      const demoPro = SEED_PROS[0];
      await createProSession(demoPro);
      return {
        success: true,
        pro: {
          id: demoPro.id,
          name: demoPro.name,
          phone: demoPro.phone,
          service: demoPro.service,
        },
      };
    }

    if (!rawPhone || !pin) {
      return {
        success: false,
        error: "Please enter your 10-digit mobile number and PIN.",
      };
    }

    const cleanInputPhone = cleanPhone(rawPhone);
    if (cleanInputPhone.length !== 10) {
      return {
        success: false,
        error: "Please enter a valid 10-digit Indian phone number.",
      };
    }

    if (pin.length < 4 || pin.length > 6) {
      return {
        success: false,
        error: "Security PIN must be 4 to 6 digits.",
      };
    }

    // 1. Try finding in Supabase
    let matchedPro: Pro | null = null;
    try {
      const supabase = getAdminSupabaseClient();
      const { data, error } = await supabase
        .from("pro")
        .select("*")
        .eq("active", true);

      if (!error && data && data.length > 0) {
        const found = data.find(
          (p: any) => cleanPhone(p.phone) === cleanInputPhone
        );
        if (found) {
          matchedPro = found as Pro;
        }
      }
    } catch {
      // Database unavailable, fallback to seed
    }

    // 2. Fallback to SEED_PROS if not found in DB
    if (!matchedPro) {
      matchedPro =
        SEED_PROS.find((p) => cleanPhone(p.phone) === cleanInputPhone) || null;
    }

    if (!matchedPro) {
      return {
        success: false,
        error:
          "Mobile number not recognized. Only verified technicians registered by Tap & Toggle dispatch can log in.",
      };
    }

    if (!matchedPro.active) {
      return {
        success: false,
        error: "Your technician account is currently inactive. Contact operations dispatch.",
      };
    }

    // 3. Verify PIN
    let pinValid = false;
    if (matchedPro.pin_hash) {
      pinValid = verifyProPin(pin, matchedPro.pin_hash);
    } else {
      // Default initial PIN for newly onboarded pros without an explicit hash
      pinValid = pin === "1234";
    }

    if (!pinValid) {
      return {
        success: false,
        error: "Incorrect PIN. If you forgot your PIN, please contact operations dispatch.",
      };
    }

    // 4. Create secure pro session cookie
    await createProSession(matchedPro);

    return {
      success: true,
      pro: {
        id: matchedPro.id,
        name: matchedPro.name,
        phone: matchedPro.phone,
        service: matchedPro.service,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "An unexpected error occurred during technician login.",
    };
  }
}

export async function proSignOutAction(): Promise<{ success: boolean }> {
  try {
    await destroyProSession();
    return { success: true };
  } catch {
    return { success: true };
  }
}

export async function checkProSessionAction(): Promise<{
  authenticated: boolean;
  pro?: {
    id: string;
    name: string;
    phone: string;
    service: string;
  };
}> {
  const res = await verifyProSession();
  if (res.authenticated && res.pro) {
    return {
      authenticated: true,
      pro: {
        id: res.pro.proId,
        name: res.pro.name,
        phone: res.pro.phone,
        service: res.pro.service,
      },
    };
  }
  return { authenticated: false };
}
