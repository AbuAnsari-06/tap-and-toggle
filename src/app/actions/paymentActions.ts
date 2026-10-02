"use server";

import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { PaymentMethod, PaymentStatus } from "@/types/database";

export interface RecordPaymentInput {
  jobId: string;
  amount: number;
  method: PaymentMethod;
  upi_ref_no?: string;
  notes?: string;
  settled_to_pro_amount?: number;
}

export async function recordPaymentAction(input: RecordPaymentInput): Promise<{
  success: boolean;
  paymentId?: string;
  invoiceNo?: string;
  error?: string;
}> {
  try {
    const invoiceNo = `TT-INV-${Date.now().toString().slice(-6)}`;
    let supabase;
    try {
      supabase = getAdminSupabaseClient();
    } catch {
      // Local dev demo mode: return mock success
      return {
        success: true,
        paymentId: `demo-pay-${Date.now()}`,
        invoiceNo,
      };
    }

    // 1. Insert Payment Record
    const { data: payment, error: paymentError } = await (supabase
      .from("payment") as any)
      .insert({
        job_id: input.jobId,
        amount: input.amount,
        method: input.method,
        status: "completed" as PaymentStatus,
        upi_ref_no: input.upi_ref_no || null,
        invoice_no: invoiceNo,
        notes: input.notes || "Doorstep Direct Settlement",
        settled_to_pro_amount: input.settled_to_pro_amount || 0,
        settled_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (paymentError) {
      console.error("Error recording payment:", paymentError);
      return { success: false, error: paymentError.message };
    }

    // 2. Transition Job status to 'Paid' (unlocking 7-day warranty)
    const { error: jobUpdateError } = await (supabase
      .from("job") as any)
      .update({
        status: "Paid",
        final_amount: input.amount,
      })
      .eq("id", input.jobId);

    if (jobUpdateError) {
      console.error("Error updating job status to Paid:", jobUpdateError);
    }

    return {
      success: true,
      paymentId: payment.id,
      invoiceNo,
    };
  } catch (err: any) {
    console.error("Unexpected error recording payment:", err);
    return { success: false, error: err.message || "Failed to process payment settlement." };
  }
}

export async function fetchJobPaymentAction(jobId: string) {
  try {
    let supabase;
    try {
      supabase = getAdminSupabaseClient();
    } catch {
      return { success: true, payment: null };
    }

    const { data: payment, error } = await supabase
      .from("payment")
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, payment };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
