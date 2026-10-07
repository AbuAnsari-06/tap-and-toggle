"use server";

import { getAdminSupabaseClient } from "@/lib/supabase/server";
import { SITE_CONFIG } from "@/config/site";

export interface SubmitSocietyPartnerState {
  success: boolean;
  message?: string;
  error?: string;
  waUrl?: string;
}

export async function submitSocietyPartnerAction(
  prevState: SubmitSocietyPartnerState | null,
  formData: FormData
): Promise<SubmitSocietyPartnerState> {
  try {
    const societyName = (formData.get("society_name") as string)?.trim();
    const area = (formData.get("area") as string)?.trim() || "NIBM";
    const units = (formData.get("units") as string)?.trim() || "";
    const contactName = (formData.get("contact_name") as string)?.trim();
    const contactRole = (formData.get("contact_role") as string)?.trim() || "Managing Committee Member";
    const phone = (formData.get("phone") as string)?.trim();
    const interest = (formData.get("interest") as string)?.trim() || "Gate Clearance & Free Repair Camp";

    if (!societyName || !phone || !contactName) {
      return {
        success: false,
        error: "Please fill in all required fields (Society Name, Contact Name, and Phone Number).",
      };
    }

    const cleanNumber = SITE_CONFIG.WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
    const waText = encodeURIComponent(
      `Hi Tap & Toggle Community Operations! 👋
I just submitted a Society Partner Inquiry on your website:

🏢 *Society:* ${societyName} (${units ? `${units}, ` : ""}${area})
👤 *Contact Person:* ${contactName} (${contactRole})
📞 *Phone:* ${phone}
🎯 *Interest:* ${interest}

Let's discuss onboarding our building and scheduling a free inspection camp!`
    );
    const waUrl = `https://wa.me/${cleanNumber}?text=${waText}`;

    // 1. Try saving to Supabase
    try {
      const supabase = getAdminSupabaseClient();
      const contactInfo = `${contactName} (${contactRole}) - ${phone} | Interest: ${interest} | Units: ${units}`;

      // Check if society already exists by name
      const { data: existing } = await supabase
        .from("society")
        .select("id")
        .ilike("name", `%${societyName}%`)
        .limit(1);

      if (existing && existing.length > 0) {
        // Update existing record
        await (supabase.from("society") as any)
          .update({
            contact: contactInfo,
            area: area,
          })
          .eq("id", (existing[0] as any).id);
      } else {
        // Insert new society partner record
        await (supabase.from("society") as any).insert({
          name: societyName,
          area: area,
          contact: contactInfo,
          has_mou: false,
          pre_approved: false,
          corpus_share_pct: 5.0,
        });
      }
    } catch (dbErr) {
      console.warn("Could not persist society partner lead to Supabase:", dbErr);
    }

    return {
      success: true,
      message: `Thank you, ${contactName}! Your society partnership inquiry for ${societyName} has been recorded.`,
      waUrl,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "An unexpected error occurred. Please reach out to us directly on WhatsApp.",
    };
  }
}
