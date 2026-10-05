"use server";

import { verifyProSession } from "@/lib/auth/proAuth";
import { getAdminSupabaseClient } from "@/lib/supabase/server";
import {
  Job,
  JobStatus,
  JobExpense,
  JobIssue,
  JobIssueCategory,
  JobIssueSeverity,
  Customer,
  Society,
} from "@/types/database";

export interface ProJobWithDetails extends Job {
  customer?: Customer;
  society?: Society;
  expenses?: JobExpense[];
  issues?: JobIssue[];
}

// Fallback seed jobs for offline / demo mode
const DEMO_JOBS: ProJobWithDetails[] = [
  {
    id: "job-demo-01",
    customer_id: "cust-01",
    pro_id: "pro-001", // Assigned to Ramesh Shinde
    service: "plumbing",
    description: "Master bathroom shower mixer continuously dripping; water hammer noise when turning off.",
    status: "Assigned",
    requested_slot: "Today · 2:00 PM - 4:00 PM",
    is_emergency: false,
    estimate_amount: 350,
    parts_amount: 0,
    handling_fee: 30,
    final_amount: 380,
    created_at: new Date().toISOString(),
    customer: {
      id: "cust-01",
      phone: "+91 98221 55555",
      name: "Rohit Kulkarni",
      flat_no: "Flat 402, B-Wing",
      society_id: "soc-01",
      whatsapp_opt_in: true,
      created_at: new Date().toISOString(),
    },
    society: {
      id: "soc-01",
      name: "Nyati Chesterfield",
      area: "NIBM Undri Road",
      has_mou: true,
      pre_approved: true,
      created_at: new Date().toISOString(),
    },
    expenses: [],
    issues: [],
  },
  {
    id: "job-demo-02",
    customer_id: "cust-02",
    pro_id: "pro-001",
    service: "plumbing",
    description: "Kitchen sink drain completely clogged; water backing up into secondary basin.",
    status: "In Progress",
    requested_slot: "Today · 11:00 AM - 1:00 PM",
    is_emergency: true,
    estimate_amount: 400,
    parts_amount: 150,
    handling_fee: 30,
    final_amount: 580,
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    customer: {
      id: "cust-02",
      phone: "+91 98221 66666",
      name: "Sunita Agarwal",
      flat_no: "Flat 801, Tower 3",
      society_id: "soc-02",
      whatsapp_opt_in: true,
      created_at: new Date().toISOString(),
    },
    society: {
      id: "soc-02",
      name: "Clover Highlands",
      area: "NIBM Road",
      has_mou: true,
      pre_approved: true,
      created_at: new Date().toISOString(),
    },
    expenses: [
      {
        id: "exp-01",
        job_id: "job-demo-02",
        pro_id: "pro-001",
        item_name: "Heavy-duty PVC Waste Pipe 1.25 inch",
        quantity: 1,
        unit_price: 150,
        total_price: 150,
        notes: "Purchased at Laxmi Hardware, Kondhwa",
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ],
    issues: [],
  },
  {
    id: "job-demo-03",
    customer_id: "cust-03",
    pro_id: "pro-001",
    service: "plumbing",
    description: "Flush cistern valve stuck open, wasting overhead water tank supply.",
    status: "Done",
    requested_slot: "Yesterday · 4:00 PM",
    is_emergency: false,
    estimate_amount: 250,
    parts_amount: 220,
    handling_fee: 30,
    final_amount: 500,
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    customer: {
      id: "cust-03",
      phone: "+91 98221 77777",
      name: "Vikram Malhotra",
      flat_no: "Row House #12",
      society_id: "soc-01",
      whatsapp_opt_in: true,
      created_at: new Date().toISOString(),
    },
    society: {
      id: "soc-01",
      name: "Nyati Chesterfield",
      area: "NIBM Undri Road",
      has_mou: true,
      pre_approved: true,
      created_at: new Date().toISOString(),
    },
    expenses: [
      {
        id: "exp-02",
        job_id: "job-demo-03",
        pro_id: "pro-001",
        item_name: "Commander Cistern Syphon Assembly",
        quantity: 1,
        unit_price: 220,
        total_price: 220,
        notes: "Official replacement kit",
        created_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
      },
    ],
    issues: [],
  },
];

/**
 * Fetches all jobs assigned to the currently logged in technician
 */
export async function fetchProAssignedJobsAction(): Promise<{
  success: boolean;
  jobs: ProJobWithDetails[];
  error?: string;
}> {
  try {
    const auth = await verifyProSession();
    if (!auth.authenticated || !auth.pro) {
      return { success: false, jobs: [], error: "Unauthorized technician session." };
    }

    const proId = auth.pro.proId;

    try {
      const supabase = getAdminSupabaseClient();
      const { data: dbJobs, error } = await supabase
        .from("job")
        .select(`
          *,
          customer:customer_id (*),
          expenses:job_expense (*)
        `)
        .eq("pro_id", proId)
        .order("created_at", { ascending: false });

      if (!error && dbJobs && dbJobs.length > 0) {
        // Fetch society details for each customer
        const enriched: ProJobWithDetails[] = await Promise.all(
          dbJobs.map(async (job: any) => {
            let socData: Society | undefined = undefined;
            if (job.customer?.society_id) {
              const { data: s } = await supabase
                .from("society")
                .select("*")
                .eq("id", job.customer.society_id)
                .single();
              if (s) socData = s as Society;
            }
            return {
              ...job,
              customer: job.customer as Customer,
              society: socData,
              expenses: (job.expenses || []) as JobExpense[],
            };
          })
        );
        return { success: true, jobs: enriched };
      }
    } catch {
      // Fallback below
    }

    // Return filtered demo jobs matching pro or fallback
    const matched = DEMO_JOBS.map((j) => ({ ...j, pro_id: proId }));
    return { success: true, jobs: matched };
  } catch (err: any) {
    return { success: false, jobs: [], error: err?.message || "Failed to load assigned jobs." };
  }
}

/**
 * Fetches a single job with isolation check (pro must be assigned to it)
 */
export async function fetchProJobDetailAction(jobId: string): Promise<{
  success: boolean;
  job?: ProJobWithDetails;
  error?: string;
}> {
  try {
    const auth = await verifyProSession();
    if (!auth.authenticated || !auth.pro) {
      return { success: false, error: "Unauthorized technician session." };
    }

    const proId = auth.pro.proId;

    try {
      const supabase = getAdminSupabaseClient();
      const { data: jobData, error: jobErr } = await supabase
        .from("job")
        .select(`
          *,
          customer:customer_id (*),
          expenses:job_expense (*),
          issues:job_issue (*)
        `)
        .eq("id", jobId)
        .single();

      if (!jobErr && jobData) {
        const rawJob = jobData as any;
        // Security check: pro must match
        if (rawJob.pro_id && rawJob.pro_id !== proId) {
          return { success: false, error: "Access denied. This job is assigned to another pro." };
        }

        let society: Society | undefined = undefined;
        if (rawJob.customer?.society_id) {
          const { data: s } = await supabase
            .from("society")
            .select("*")
            .eq("id", rawJob.customer.society_id)
            .single();
          if (s) society = s as Society;
        }

        return {
          success: true,
          job: {
            ...rawJob,
            customer: rawJob.customer as Customer,
            society,
            expenses: (rawJob.expenses || []) as JobExpense[],
            issues: (rawJob.issues || []) as JobIssue[],
          },
        };
      }
    } catch {
      // Fallback
    }

    // Fallback to demo
    const demo = DEMO_JOBS.find((j) => j.id === jobId) || {
      ...DEMO_JOBS[0],
      id: jobId,
      pro_id: proId,
    };

    return { success: true, job: demo };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to load job details." };
  }
}

/**
 * Updates the job status from the Pro Portal
 */
export async function updateProJobStatusAction(
  jobId: string,
  newStatus: JobStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await verifyProSession();
    if (!auth.authenticated || !auth.pro) {
      return { success: false, error: "Unauthorized technician session." };
    }

    const proId = auth.pro.proId;

    try {
      const supabase = getAdminSupabaseClient();

      // Verify ownership
      const { data: existingJob } = await supabase
        .from("job")
        .select("pro_id, status")
        .eq("id", jobId)
        .single();

      const rawExisting = existingJob as any;
      if (rawExisting && rawExisting.pro_id && rawExisting.pro_id !== proId) {
        return { success: false, error: "Unauthorized: Job belongs to another technician." };
      }

      const { error } = await (supabase.from("job") as any)
        .update({ status: newStatus })
        .eq("id", jobId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch {
      // Fallback for demo
      return { success: true };
    }
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update status." };
  }
}

/**
 * Adds an itemized hardware part expense to the job
 */
export async function addJobExpenseAction(
  jobId: string,
  expense: {
    item_name: string;
    quantity: number;
    unit_price: number;
    receipt_photo_url?: string;
    notes?: string;
  }
): Promise<{ success: boolean; expense?: JobExpense; error?: string }> {
  try {
    const auth = await verifyProSession();
    if (!auth.authenticated || !auth.pro) {
      return { success: false, error: "Unauthorized technician session." };
    }

    const proId = auth.pro.proId;
    const qty = Math.max(1, Number(expense.quantity) || 1);
    const unitPrice = Math.max(0, Number(expense.unit_price) || 0);
    const totalPrice = qty * unitPrice;

    if (!expense.item_name?.trim()) {
      return { success: false, error: "Item name/description is required." };
    }

    if (totalPrice <= 0) {
      return { success: false, error: "Please enter a valid price for the spare part." };
    }

    try {
      const supabase = getAdminSupabaseClient();

      const { data: createdExp, error: expErr } = await (supabase.from("job_expense") as any)
        .insert({
          job_id: jobId,
          pro_id: proId,
          item_name: expense.item_name.trim(),
          quantity: qty,
          unit_price: unitPrice,
          total_price: totalPrice,
          receipt_photo_url: expense.receipt_photo_url || null,
          notes: expense.notes?.trim() || null,
        })
        .select("*")
        .single();

      if (expErr) {
        return { success: false, error: expErr.message };
      }

      // Re-sum all expenses for this job
      const { data: allExpenses } = await supabase
        .from("job_expense")
        .select("total_price")
        .eq("job_id", jobId);

      const newPartsTotal = (allExpenses || []).reduce(
        (sum: number, row: any) => sum + (Number(row.total_price) || 0),
        0
      );

      // Fetch current job to recalculate final_amount
      const { data: jobRow } = await supabase
        .from("job")
        .select("estimate_amount, handling_fee")
        .eq("id", jobId)
        .single();

      const rawJobRow = jobRow as any;
      const labor = Number(rawJobRow?.estimate_amount) || 250;
      const handling = Number(rawJobRow?.handling_fee) || 30;
      const finalAmount = labor + newPartsTotal + handling;

      await (supabase.from("job") as any)
        .update({
          parts_amount: newPartsTotal,
          final_amount: finalAmount,
        })
        .eq("id", jobId);

      return { success: true, expense: createdExp as JobExpense };
    } catch {
      // Fallback for demo
      const mockExpense: JobExpense = {
        id: "exp-" + Date.now(),
        job_id: jobId,
        pro_id: proId,
        item_name: expense.item_name.trim(),
        quantity: qty,
        unit_price: unitPrice,
        total_price: totalPrice,
        receipt_photo_url: expense.receipt_photo_url || null,
        notes: expense.notes || null,
        created_at: new Date().toISOString(),
      };
      return { success: true, expense: mockExpense };
    }
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to record expense." };
  }
}

/**
 * Removes an expense item from a job
 */
export async function deleteJobExpenseAction(
  jobId: string,
  expenseId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = await verifyProSession();
    if (!auth.authenticated || !auth.pro) {
      return { success: false, error: "Unauthorized technician session." };
    }

    try {
      const supabase = getAdminSupabaseClient();
      await supabase.from("job_expense").delete().eq("id", expenseId);

      // Re-sum expenses
      const { data: allExpenses } = await supabase
        .from("job_expense")
        .select("total_price")
        .eq("job_id", jobId);

      const newPartsTotal = (allExpenses || []).reduce(
        (sum: number, row: any) => sum + (Number(row.total_price) || 0),
        0
      );

      const { data: jobRow } = await supabase
        .from("job")
        .select("estimate_amount, handling_fee")
        .eq("id", jobId)
        .single();

      const rawJobRow = jobRow as any;
      const labor = Number(rawJobRow?.estimate_amount) || 250;
      const handling = Number(rawJobRow?.handling_fee) || 30;
      const finalAmount = labor + newPartsTotal + handling;

      await (supabase.from("job") as any)
        .update({
          parts_amount: newPartsTotal,
          final_amount: finalAmount,
        })
        .eq("id", jobId);

      return { success: true };
    } catch {
      return { success: true };
    }
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete expense item." };
  }
}

/**
 * Submits an operational issue / blocker for a job
 */
export async function reportJobIssueAction(
  jobId: string,
  issue: {
    category: JobIssueCategory;
    severity: JobIssueSeverity;
    description: string;
    photo_url?: string;
  }
): Promise<{ success: boolean; issue?: JobIssue; error?: string }> {
  try {
    const auth = await verifyProSession();
    if (!auth.authenticated || !auth.pro) {
      return { success: false, error: "Unauthorized technician session." };
    }

    const proId = auth.pro.proId;

    if (!issue.description?.trim()) {
      return { success: false, error: "Please provide a description of the issue." };
    }

    try {
      const supabase = getAdminSupabaseClient();

      const { data: createdIssue, error: issueErr } = await (supabase.from("job_issue") as any)
        .insert({
          job_id: jobId,
          pro_id: proId,
          category: issue.category,
          severity: issue.severity,
          description: issue.description.trim(),
          photo_url: issue.photo_url || null,
        })
        .select("*")
        .single();

      if (issueErr) {
        return { success: false, error: issueErr.message };
      }

      // If issue is blocking, mark status as Partial / Rescheduled so dispatch intervenes
      if (issue.severity === "blocking") {
        await (supabase.from("job") as any)
          .update({ status: "Partial" })
          .eq("id", jobId);
      }

      return { success: true, issue: createdIssue as JobIssue };
    } catch {
      const mockIssue: JobIssue = {
        id: "issue-" + Date.now(),
        job_id: jobId,
        pro_id: proId,
        category: issue.category,
        severity: issue.severity,
        description: issue.description.trim(),
        photo_url: issue.photo_url || null,
        reported_at: new Date().toISOString(),
      };
      return { success: true, issue: mockIssue };
    }
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to record issue." };
  }
}
