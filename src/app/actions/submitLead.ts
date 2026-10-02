"use server";

import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { SITE_CONFIG } from "@/config/site";
import { ServiceType } from "@/types/database";

export interface SubmitLeadState {
  success: boolean;
  message?: string;
  error?: string;
  jobId?: string;
}

export async function submitLeadAction(
  prevState: SubmitLeadState | null,
  formData: FormData
): Promise<SubmitLeadState> {
  try {
    const name = (formData.get("name") as string)?.trim();
    let phone = (formData.get("phone") as string)?.trim().replace(/[^0-9]/g, "");
    const flatNo = (formData.get("flat_no") as string)?.trim();
    const societyName = (formData.get("society_name") as string)?.trim();
    const societyId = (formData.get("society_id") as string)?.trim();
    const service = (formData.get("service") as string)?.trim() as ServiceType;
    const description = (formData.get("description") as string)?.trim();
    const isEmergency = formData.get("is_emergency") === "true" || formData.get("is_emergency") === "on";
    const dpdpConsent = formData.get("dpdp_consent") === "true" || formData.get("dpdp_consent") === "on";

    // 1. Mandatory DPDP Act 2023 Consent Check (Strict Launch Blocker)
    if (!dpdpConsent) {
      return {
        success: false,
        error: "Consent under the DPDP Act 2023 is required before submitting your service request.",
      };
    }

    // 2. Validate Input Fields
    if (!name || name.length < 2) {
      return {
        success: false,
        error: "Please enter your full name (minimum 2 characters).",
      };
    }

    // Normalize Indian Phone number: strip leading 0 or +91 if present
    if (phone.length === 12 && phone.startsWith("91")) {
      phone = phone.substring(2);
    } else if (phone.length === 11 && phone.startsWith("0")) {
      phone = phone.substring(1);
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return {
        success: false,
        error: "Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).",
      };
    }

    if (service !== "plumbing" && service !== "electrical") {
      return {
        success: false,
        error: "Please select a valid service category (Plumbing or Electrical).",
      };
    }

    if (!description || description.length < 5) {
      return {
        success: false,
        error: "Please provide a brief description of the issue (minimum 5 characters).",
      };
    }

    // 3. Connect to Supabase via Server Admin Client (Service Role)
    let supabase;
    try {
      supabase = getAdminSupabaseClient();
    } catch (err: any) {
      // In local dev without live Supabase credentials, log and return graceful demo response
      console.warn("Supabase credentials not configured in .env.local:", err.message);
      return {
        success: true,
        message: `Request received for ${name} (${phone})! Our dispatch team will WhatsApp you shortly with your free estimate. (Local Dev Mode)`,
        jobId: "demo-job-" + Date.now(),
      };
    }

    // 4. Resolve Society ID if a name was provided or selected
    let finalSocietyId: string | null = societyId || null;
    if (!finalSocietyId && societyName) {
      const { data: matchedSociety } = await (supabase
        .from("society")
        .select("id")
        .ilike("name", societyName)
        .maybeSingle() as any);

      if (matchedSociety && (matchedSociety as any).id) {
        finalSocietyId = (matchedSociety as any).id;
      }
    }

    // 5. Step 1: Upsert Customer by Unique Phone Number (Dedupe Key)
    const { data: customer, error: customerError } = await (supabase
      .from("customer") as any)
      .upsert(
        {
          phone,
          name,
          flat_no: flatNo || null,
          society_id: finalSocietyId,
          whatsapp_opt_in: true,
        },
        { onConflict: "phone" }
      )
      .select("id")
      .single();

    if (customerError || !customer) {
      console.error("Error upserting customer:", customerError);
      return {
        success: false,
        error: "Could not save your contact details. Please try again or message us on WhatsApp.",
      };
    }

    // 6. Step 2: Insert DPDP Consent Record
    const { error: consentError } = await (supabase.from("consent_record") as any).insert({
      customer_id: customer.id,
      purpose: "service_request_contact",
      text_version: SITE_CONFIG.dpdpConsent.version,
    });

    if (consentError) {
      console.error("Error creating consent record:", consentError);
      // Non-fatal if customer is created, but logged for audit compliance
    }

    // 7. Step 3: Insert Job with State Machine default 'New'
    const { data: job, error: jobError } = await (supabase
      .from("job") as any)
      .insert({
        customer_id: customer.id,
        service,
        description: `[${societyName || "Apartment"} - ${flatNo || "Unit"}] ${description}`,
        status: "New",
        is_emergency: isEmergency,
      })
      .select("id")
      .single();

    if (jobError || !job) {
      console.error("Error creating job record:", jobError);
      return {
        success: false,
        error: "Your contact details were saved, but creating the service ticket failed. Please message us on WhatsApp.",
      };
    }

    return {
      success: true,
      message: `Thank you, ${name}! Your request has been logged. Our dispatch team will reach out on WhatsApp at +91 ${phone} with your free estimate.`,
      jobId: job.id,
    };
  } catch (error: any) {
    console.error("Unexpected error in submitLeadAction:", error);
    return {
      success: false,
      error: "An unexpected error occurred while submitting your request. Please try again or reach out on WhatsApp.",
    };
  }
}
