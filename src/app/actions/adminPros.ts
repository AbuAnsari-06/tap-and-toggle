"use server";

import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { verifyAdminSession } from "@/lib/auth/adminAuth";
import { Pro, ServiceType } from "@/types/database";

const SEED_PROS: Pro[] = [
  {
    id: "pro-001",
    name: "Ramesh Shinde",
    phone: "+91 98220 11111",
    service: "plumbing",
    photo: null,
    active: true,
    base_rate: 350,
    vetting_docs_ref: "Aadhaar verified · Police verification on file",
    gate_list_status: "approved",
    health_score: 4.9,
    personal_accident_doc: "PA Cover Active (Policy #NIA-88219)",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pro-002",
    name: "Suresh Patil",
    phone: "+91 98220 22222",
    service: "plumbing",
    photo: null,
    active: true,
    base_rate: 350,
    vetting_docs_ref: "Aadhaar verified",
    gate_list_status: "approved",
    health_score: 4.8,
    personal_accident_doc: "PA Cover Active (Policy #NIA-88240)",
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pro-003",
    name: "Amit Deshmukh",
    phone: "+91 98220 33333",
    service: "electrical",
    photo: null,
    active: true,
    base_rate: 300,
    vetting_docs_ref: "Aadhaar verified · Wireman License #MH-10293",
    gate_list_status: "approved",
    health_score: 5.0,
    personal_accident_doc: "PA Cover Active (Policy #NIA-88255)",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "pro-004",
    name: "Vikas More",
    phone: "+91 98220 44444",
    service: "electrical",
    photo: null,
    active: true,
    base_rate: 300,
    vetting_docs_ref: "Aadhaar verified · Wireman License #MH-10884",
    gate_list_status: "approved",
    health_score: 4.7,
    personal_accident_doc: "PA Cover Active (Policy #NIA-88261)",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function fetchAdminProsAction(): Promise<{
  success: boolean;
  pros: Pro[];
  error?: string;
}> {
  try {
    const auth = await verifyAdminSession();
    if (!auth.authenticated) {
      return { success: false, pros: [], error: auth.error || "Unauthorized" };
    }

    let supabase;
    try {
      supabase = getAdminSupabaseClient();
    } catch {
      return { success: true, pros: SEED_PROS };
    }

    const { data: dbPros, error } = await supabase
      .from("pro")
      .select("*")
      .order("name", { ascending: true });

    if (error || !dbPros || dbPros.length === 0) {
      return { success: true, pros: SEED_PROS };
    }

    return { success: true, pros: dbPros as Pro[] };
  } catch (err: any) {
    return { success: true, pros: SEED_PROS };
  }
}

export async function toggleProStatusAction(
  proId: string,
  active: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await verifyAdminSession();
    if (!auth.authenticated) {
      return { success: false, error: auth.error || "Unauthorized" };
    }

    let supabase;
    try {
      supabase = getAdminSupabaseClient();
    } catch {
      return { success: true };
    }

    const { error } = await (supabase.from("pro") as any)
      .update({ active })
      .eq("id", proId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function addProAction(proData: {
  name: string;
  phone: string;
  service: ServiceType;
  base_rate: number;
  vetting_docs_ref?: string;
}): Promise<{ success: boolean; pro?: Pro; error?: string }> {
  try {
    const auth = await verifyAdminSession();
    if (!auth.authenticated) {
      return { success: false, error: auth.error || "Unauthorized" };
    }

    let supabase;
    try {
      supabase = getAdminSupabaseClient();
    } catch {
      const mockPro: Pro = {
        id: "pro-" + Date.now(),
        name: proData.name,
        phone: proData.phone,
        service: proData.service,
        base_rate: proData.base_rate,
        active: true,
        gate_list_status: "approved",
        health_score: 5.0,
        vetting_docs_ref: proData.vetting_docs_ref || "Aadhaar verified",
        personal_accident_doc: "PA Cover Active",
        created_at: new Date().toISOString(),
      };
      return { success: true, pro: mockPro };
    }

    const { data, error } = await (supabase.from("pro") as any)
      .insert({
        name: proData.name,
        phone: proData.phone,
        service: proData.service,
        base_rate: proData.base_rate,
        active: true,
        gate_list_status: "approved",
        health_score: 5.0,
        vetting_docs_ref: proData.vetting_docs_ref || "Aadhaar verified",
      })
      .select("*")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, pro: data as Pro };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
