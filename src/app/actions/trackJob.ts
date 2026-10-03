"use server";

import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { JobStatus, ServiceType } from "@/types/database";

export interface CustomerTrackingData {
  id: string;
  status: JobStatus;
  service: ServiceType;
  description: string;
  is_emergency: boolean;
  society_name: string;
  flat_no: string;
  requested_slot?: string | null;
  created_at: string;
  estimate_amount?: number | null;
  final_amount?: number | null;
  parts_amount?: number | null;
  handling_fee?: number | null;
  pro?: {
    name: string;
    phone: string;
    service: ServiceType;
    health_score?: number | null;
    gate_list_status?: string | null;
  } | null;
}

// Fallback mock jobs for demo/local testing when remote Supabase credentials are not populated
const TRACKING_FALLBACKS: Record<string, CustomerTrackingData> = {
  "demo-job-101": {
    id: "demo-job-101",
    status: "New",
    service: "plumbing",
    description: "Severe kitchen sink inlet pipe burst, continuous leakage under counter cabinet.",
    is_emergency: true,
    society_name: "Nyati",
    flat_no: "Tower 4 - 802",
    requested_slot: "Immediate (<30 mins)",
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    estimate_amount: 350,
  },
  "demo-job-102": {
    id: "demo-job-102",
    status: "Assigned",
    service: "electrical",
    description: "Main MCB tripping repeatedly when geyser or microwave is powered on.",
    is_emergency: false,
    society_name: "NIBMgaon",
    flat_no: "B-Wing 301",
    requested_slot: "Today 4:00 PM - 6:00 PM",
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    estimate_amount: 250,
    pro: {
      name: "Amit Deshmukh",
      phone: "+91 98220 33333",
      service: "electrical",
      health_score: 5.0,
      gate_list_status: "approved",
    },
  },
  "demo-job-103": {
    id: "demo-job-103",
    status: "In Progress",
    service: "plumbing",
    description: "Concealed flush tank valve leaking into commode continuously.",
    is_emergency: false,
    society_name: "Sus",
    flat_no: "A-12",
    requested_slot: "Today 11:00 AM",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    estimate_amount: 300,
    parts_amount: 180,
    handling_fee: 30,
    final_amount: 510,
    pro: {
      name: "Ramesh Shinde",
      phone: "+91 98220 11111",
      service: "plumbing",
      health_score: 4.9,
      gate_list_status: "approved",
    },
  },
  "demo-job-104": {
    id: "demo-job-104",
    status: "Paid",
    service: "electrical",
    description: "Master bedroom ceiling fan speed regulator burned out and stopped working.",
    is_emergency: false,
    society_name: "NIBM Phase 1",
    flat_no: "C-204",
    requested_slot: "Completed",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    estimate_amount: 180,
    parts_amount: 80,
    handling_fee: 20,
    final_amount: 280,
    pro: {
      name: "Vikas More",
      phone: "+91 98220 44444",
      service: "electrical",
      health_score: 4.7,
      gate_list_status: "approved",
    },
  },
};

export async function fetchCustomerTrackingAction(
  jobId: string
): Promise<{ success: boolean; data?: CustomerTrackingData; error?: string }> {
  try {
    let supabase;
    try {
      supabase = getAdminSupabaseClient();
    } catch {
      // Local fallback
      const fallback = TRACKING_FALLBACKS[jobId] || {
        id: jobId,
        status: "New",
        service: "plumbing",
        description: "Service visit requested. Dispatch team is currently assigning a vetted local technician.",
        is_emergency: false,
        society_name: "NIBM Society",
        flat_no: "Unit",
        requested_slot: "Pending Confirmation",
        created_at: new Date().toISOString(),
      };
      return { success: true, data: fallback };
    }

    const { data: job, error } = await supabase
      .from("job")
      .select(`
        id,
        service,
        description,
        status,
        requested_slot,
        is_emergency,
        estimate_amount,
        final_amount,
        parts_amount,
        handling_fee,
        created_at,
        customer:customer_id (
          flat_no,
          society:society_id (
            name
          )
        ),
        pro:pro_id (
          name,
          phone,
          service,
          health_score,
          gate_list_status
        )
      `)
      .eq("id", jobId)
      .maybeSingle();

    if (error || !job) {
      if (TRACKING_FALLBACKS[jobId]) {
        return { success: true, data: TRACKING_FALLBACKS[jobId] };
      }
      return {
        success: false,
        error: "Ticket not found. Please verify your tracking link or message us on WhatsApp.",
      };
    }

    const jobData = job as any;
    const cust = jobData.customer || {};
    const soc = cust.society || {};
    const pro = jobData.pro || null;

    return {
      success: true,
      data: {
        id: jobData.id,
        status: jobData.status as JobStatus,
        service: jobData.service as ServiceType,
        description: jobData.description,
        is_emergency: jobData.is_emergency ?? false,
        society_name: soc.name || "NIBM",
        flat_no: cust.flat_no || "Unit",
        requested_slot: jobData.requested_slot,
        created_at: jobData.created_at,
        estimate_amount: jobData.estimate_amount,
        final_amount: jobData.final_amount,
        parts_amount: jobData.parts_amount,
        handling_fee: jobData.handling_fee,
        pro: pro
          ? {
              name: pro.name,
              phone: pro.phone,
              service: pro.service,
              health_score: pro.health_score,
              gate_list_status: pro.gate_list_status,
            }
          : null,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: "Unable to retrieve tracking data. Please reach out on WhatsApp.",
    };
  }
}

export async function approveCustomerEstimateAction(
  jobId: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const supabase = getAdminSupabaseClient();
    const { error } = await (supabase.from("job") as any)
      .update({ status: "Approved" })
      .eq("id", jobId);

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: "Estimate approved! Dispatching the nearest vetted pro to your society.",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to approve estimate. Please message us on WhatsApp.",
    };
  }
}

export async function cancelCustomerJobAction(
  jobId: string,
  reason?: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const supabase = getAdminSupabaseClient();
    const { error } = await (supabase.from("job") as any)
      .update({
        status: "Cancelled",
        description: reason ? `[Cancelled by Customer: ${reason}]` : undefined,
      })
      .eq("id", jobId);

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: "Your service request has been cancelled.",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to cancel request. Please message us on WhatsApp.",
    };
  }
}

export async function rescheduleCustomerJobAction(
  jobId: string,
  preferredSlot: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const supabase = getAdminSupabaseClient();
    const { error } = await (supabase.from("job") as any)
      .update({
        status: "Rescheduled",
        requested_slot: preferredSlot,
      })
      .eq("id", jobId);

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      message: `Reschedule request for ${preferredSlot} received! Dispatch team will confirm.`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Failed to reschedule. Please message us on WhatsApp.",
    };
  }
}

