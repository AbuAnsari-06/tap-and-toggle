import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getAdminSupabaseClient } from "@/lib/supabase/server";

/**
 * Razorpay Webhook Handler
 * Reference: BLUEPRINT.md Section 8 & Section 19.2
 * "payment.captured webhook is the only way Job.status becomes Paid in automated flow"
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookSignature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 1. Mandatory Razorpay Webhook Signature Verification
    if (!webhookSecret) {
      console.error("❌ RAZORPAY_WEBHOOK_SECRET environment variable is missing.");
      return NextResponse.json(
        { error: "Webhook secret is not configured on the server" },
        { status: 500 }
      );
    }

    if (!webhookSignature) {
      console.warn("⚠️ Razorpay webhook rejected: missing x-razorpay-signature header");
      return NextResponse.json(
        { error: "Missing x-razorpay-signature header" },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const isSignatureValid =
      expectedSignature.length === webhookSignature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "utf8"),
        Buffer.from(webhookSignature, "utf8")
      );

    if (!isSignatureValid) {
      console.warn("⚠️ Razorpay webhook rejected: invalid signature");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    // 2. Handle payment.captured or order.paid
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = event.payload?.payment?.entity || {};
      const orderEntity = event.payload?.order?.entity || {};

      // Job ID passed in notes during order/link creation
      const jobId =
        paymentEntity.notes?.job_id ||
        orderEntity.notes?.job_id ||
        paymentEntity.notes?.jobId;

      const amount = (paymentEntity.amount || 0) / 100; // Razorpay amounts in paise
      const razorpayPaymentId = paymentEntity.id;
      const razorpayOrderId = paymentEntity.order_id || orderEntity.id;
      const method = paymentEntity.method === "upi" ? "UPI" : "Razorpay";

      if (jobId) {
        try {
          const supabase = getAdminSupabaseClient();

          // 1. Insert Payment Record
          await (supabase.from("payment") as any).insert({
            job_id: jobId,
            amount,
            method,
            status: "completed",
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: razorpayPaymentId,
            invoice_no: `TT-INV-${Date.now().toString().slice(-6)}`,
            notes: `Webhook automated capture: ${eventType}`,
          });

          // 2. Mark Job as Paid
          await (supabase.from("job") as any)
            .update({
              status: "Paid",
              final_amount: amount,
            })
            .eq("id", jobId);

          console.log(`✅ Job ${jobId} transitioned to 'Paid' via verified Razorpay webhook.`);
        } catch (dbErr: any) {
          console.error("Database update failed during Razorpay webhook:", dbErr);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Error processing Razorpay webhook:", err);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 400 });
  }
}
