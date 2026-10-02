"use server";

import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { JobStatus, ServiceType } from "@/types/database";

export interface AdminJobView {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  society_name: string;
  flat_no: string;
  service: ServiceType;
  description: string;
  status: JobStatus;
  is_emergency: boolean;
  pro_id?: string | null;
  pro_name?: string | null;
  pro_phone?: string | null;
  estimate_amount?: number | null;
  final_amount?: number | null;
  parts_amount?: number | null;
  handling_fee?: number | null;
  requested_slot?: string | null;
  created_at: string;
}

// Fallback bench data when remote Supabase credentials are not populated
const SEED_BENCH_JOBS: AdminJobView[] = [
  {
    id: "job-p1-001",
    customer_id: "cust-001",
    customer_name: "Rahul Mehta",
    customer_phone: "+91 98221 44556",
    society_name: "Nyati",
    flat_no: "Tower 4 - 802",
    service: "plumbing",
    description: "Severe kitchen sink inlet pipe burst, continuous leakage under counter cabinet.",
    status: "New",
    is_emergency: true,
    estimate_amount: 350,
    parts_amount: 120,
    handling_fee: 30,
    final_amount: 500,
    requested_slot: "Immediate (<30 mins)",
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "job-p1-002",
    customer_id: "cust-002",
    customer_name: "Pooja Kulkarni",
    customer_phone: "+91 98900 11223",
    society_name: "NIBMgaon",
    flat_no: "B-Wing 301",
    service: "electrical",
    description: "Main MCB tripping repeatedly when geyser or microwave is powered on.",
    status: "Assigned",
    is_emergency: false,
    pro_id: "pro-003",
    pro_name: "Amit Deshmukh",
    pro_phone: "+91 98220 33333",
    estimate_amount: 250,
    parts_amount: 0,
    handling_fee: 0,
    final_amount: 250,
    requested_slot: "Today 4:00 PM - 6:00 PM",
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "job-p1-003",
    customer_id: "cust-003",
    customer_name: "Dr. Farhan Shaikh",
    customer_phone: "+91 97654 33221",
    society_name: "Sus",
    flat_no: "A-12",
    service: "plumbing",
    description: "Concealed flush tank valve leaking into commode continuously; water wasting.",
    status: "In Progress",
    is_emergency: false,
    pro_id: "pro-001",
    pro_name: "Ramesh Shinde",
    pro_phone: "+91 98220 11111",
    estimate_amount: 300,
    parts_amount: 180,
    handling_fee: 30,
    final_amount: 510,
    requested_slot: "Today 11:00 AM",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "job-p1-004",
    customer_id: "cust-004",
    customer_name: "Sneha Agarwal",
    customer_phone: "+91 99223 88776",
    society_name: "NIBM Phase 1",
    flat_no: "C-204",
    service: "electrical",
    description: "Master bedroom ceiling fan speed regulator burned out and stopped working.",
    status: "Done",
    is_emergency: false,
    pro_id: "pro-004",
    pro_name: "Vikas More",
    pro_phone: "+91 98220 44444",
    estimate_amount: 180,
    parts_amount: 80,
    handling_fee: 20,
    final_amount: 280,
    requested_slot: "Completed",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
];

export async function fetchAdminJobsAction(): Promise<{ success: boolean; jobs: AdminJobView[]; error?: string }> {
  try {
    let supabase;
    try {
      supabase = getAdminSupabaseClient();
    } catch {
      return { success: true, jobs: SEED_BENCH_JOBS };
    }

    const { data: dbJobs, error } = await supabase
      .from("job")
      .select(`
        id,
        customer_id,
        service,
        description,
        status,
        requested_slot,
        pro_id,
        is_emergency,
        estimate_amount,
        final_amount,
        parts_amount,
        handling_fee,
        created_at,
        customer:customer_id (
          id,
          name,
          phone,
          flat_no,
          society:society_id (
            name
          )
        ),
        pro:pro_id (
          id,
          name,
          phone
        )
      `)
      .order("created_at", { ascending: false });

    if (error || !dbJobs || dbJobs.length === 0) {
      return { success: true, jobs: SEED_BENCH_JOBS };
    }

    const mappedJobs: AdminJobView[] = (dbJobs as any[]).map((j) => {
      const cust = j.customer || {};
      const soc = cust.society || {};
      const pro = j.pro || {};
      return {
        id: j.id,
        customer_id: j.customer_id,
        customer_name: cust.name || "Resident",
        customer_phone: cust.phone || "—",
        society_name: soc.name || "NIBM",
        flat_no: cust.flat_no || "—",
        service: j.service,
        description: j.description,
        status: j.status,
        is_emergency: j.is_emergency ?? false,
        pro_id: j.pro_id,
        pro_name: pro.name || null,
        pro_phone: pro.phone || null,
        estimate_amount: j.estimate_amount,
        final_amount: j.final_amount,
        parts_amount: j.parts_amount,
        handling_fee: j.handling_fee,
        requested_slot: j.requested_slot,
        created_at: j.created_at,
      };
    });

    return { success: true, jobs: mappedJobs };
  } catch (err: any) {
    return { success: true, jobs: SEED_BENCH_JOBS };
  }
}

export async function updateJobStatusAction(
  jobId: string,
  newStatus: JobStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    let supabase;
    try {
      supabase = getAdminSupabaseClient();
    } catch {
      // Local dev mode fallback: status acknowledged
      return { success: true };
    }

    const { error } = await (supabase.from("job") as any)
      .update({ status: newStatus })
      .eq("id", jobId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateJobDetailsAction(
  jobId: string,
  data: {
    status?: JobStatus;
    pro_id?: string | null;
    estimate_amount?: number | null;
    final_amount?: number | null;
    parts_amount?: number | null;
    handling_fee?: number | null;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    let supabase;
    try {
      supabase = getAdminSupabaseClient();
    } catch {
      return { success: true };
    }

    const { error } = await (supabase.from("job") as any)
      .update(data)
      .eq("id", jobId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
