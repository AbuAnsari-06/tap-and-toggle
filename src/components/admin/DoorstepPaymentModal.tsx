"use client";

import React, { useState } from "react";
import {
  X,
  QrCode,
  DollarSign,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Send,
  MessageSquare,
  Copy,
  Check,
  Smartphone,
  Banknote,
} from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { recordPaymentAction } from "@/app/actions/paymentActions";
import { PaymentMethod } from "@/types/database";

export interface DoorstepPaymentModalProps {
  jobId: string;
  customerName: string;
  customerPhone: string;
  societyName: string;
  flatNo: string;
  service: string;
  estimateAmount: number;
  partsAmount: number;
  handlingFee: number;
  onClose: () => void;
  onPaymentSuccess?: (invoiceNo: string) => void;
}

export function DoorstepPaymentModal({
  jobId,
  customerName,
  customerPhone,
  societyName,
  flatNo,
  service,
  estimateAmount,
  partsAmount,
  handlingFee,
  onClose,
  onPaymentSuccess,
}: DoorstepPaymentModalProps) {
  const [labor, setLabor] = useState<number>(estimateAmount || 0);
  const [parts, setParts] = useState<number>(partsAmount || 0);
  const [handling, setHandling] = useState<number>(handlingFee || 30);
  const [upiRefNo, setUpiRefNo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Cash">("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successInvoice, setSuccessInvoice] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const totalBill = Number(labor) + Number(parts) + Number(handling);
  const upiId = SITE_CONFIG.payments.upiId;
  const merchantName = SITE_CONFIG.payments.merchantName;

  // Standard NPCI UPI URI
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    merchantName
  )}&am=${totalBill}&tn=${encodeURIComponent(
    `TT ${societyName} ${flatNo} #${jobId.slice(0, 6)}`
  )}&cu=INR`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    upiUri
  )}`;

  // WhatsApp Payment Request message
  const waPaymentText = `🧾 *TAP & TOGGLE — SERVICE INVOICE*
━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 *Address:* ${societyName} — Flat ${flatNo}
🔧 *Service:* ${service.toUpperCase()}
🎫 *Ticket ID:* #${jobId.slice(0, 8)}

💰 *BILL BREAKDOWN:*
• Labor Charges: ₹${labor}
• Parts (at actual cost): ₹${parts}
• Procurement Handling: ₹${handling}
━━━━━━━━━━━━━━━━━━━━━━━━━━
💎 *TOTAL PAYABLE: ₹${totalBill}*

📲 *Pay via UPI ID:* ${upiId}
Or pay doorstep directly via Google Pay / PhonePe / Paytm / BHIM.

🛡️ *Your 7-day workmanship warranty is activated upon settlement.*`;

  let cleanCustPhone = customerPhone.replace(/[^0-9]/g, "");
  if (cleanCustPhone.length === 10) cleanCustPhone = "91" + cleanCustPhone;
  const waPaymentLink = `https://wa.me/${cleanCustPhone}?text=${encodeURIComponent(
    waPaymentText
  )}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleConfirmSettlement = async () => {
    setIsProcessing(true);
    const res = await recordPaymentAction({
      jobId,
      amount: totalBill,
      method: paymentMethod as PaymentMethod,
      upi_ref_no: upiRefNo,
      notes: `Doorstep settlement confirmed via ${paymentMethod} by operator`,
    });

    if (res.success && res.invoiceNo) {
      setSuccessInvoice(res.invoiceNo);
      if (onPaymentSuccess) onPaymentSuccess(res.invoiceNo);
    }
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-brand-grey-900 border border-brand-grey-700 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-7 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-brand-grey-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                Doorstep Payment
              </span>
              <span className="text-xs text-brand-grey-400 font-mono">
                #{jobId.slice(0, 8)}
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-1">
              Direct UPI &amp; Cash Settlement
            </h3>
            <p className="text-xs text-brand-grey-400">
              {customerName} &bull; {societyName} (Flat {flatNo})
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-brand-grey-400 hover:text-white hover:bg-brand-grey-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {successInvoice ? (
          <div className="text-center py-6 space-y-4 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-extrabold text-white">Payment Confirmed!</h4>
            <p className="text-xs text-emerald-300 font-mono">
              Invoice #{successInvoice} &bull; ₹{totalBill}
            </p>
            <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-800 text-xs text-emerald-200 text-left space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>7-Day Workmanship Warranty Activated</span>
              </p>
              <p className="text-[11px] text-emerald-300/80">
                Job marked as Paid in system. Customer receipt ready to share.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-brand-teal-600 hover:bg-brand-teal-500 text-white font-bold text-xs shadow transition"
              >
                Close Settlement
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Bill Breakdown Inputs */}
            <div className="bg-brand-grey-800/60 p-4 rounded-2xl border border-brand-grey-700/80 space-y-3">
              <span className="text-xs font-bold text-white block">
                Itemized Bill Calculation
              </span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-brand-grey-400 block mb-1">
                    Labor (₹)
                  </label>
                  <input
                    type="number"
                    value={labor}
                    onChange={(e) => setLabor(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-brand-grey-900 border border-brand-grey-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-brand-grey-400 block mb-1">
                    Parts (₹)
                  </label>
                  <input
                    type="number"
                    value={parts}
                    onChange={(e) => setParts(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-brand-grey-900 border border-brand-grey-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-brand-grey-400 block mb-1">
                    Handling (₹)
                  </label>
                  <input
                    type="number"
                    value={handling}
                    onChange={(e) => setHandling(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg bg-brand-grey-900 border border-brand-grey-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-brand-grey-700 flex items-center justify-between text-xs">
                <span className="text-brand-grey-300 font-semibold">Total Bill:</span>
                <span className="text-lg font-black text-emerald-400">
                  ₹{totalBill}
                </span>
              </div>
            </div>

            {/* Dynamic UPI QR Code Box */}
            <div className="bg-white rounded-2xl p-5 text-center space-y-3 border border-brand-grey-300 text-brand-grey-900 shadow-sm">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-brand-teal-900 uppercase tracking-wider">
                <QrCode className="w-4 h-4 text-brand-teal-700" />
                <span>Instant Doorstep UPI QR</span>
              </div>

              <div className="w-[180px] h-[180px] mx-auto bg-white p-2 rounded-xl border border-brand-grey-200 shadow-xs flex items-center justify-center">
                {/* Dynamic QR image generated with exact amount and note */}
                <img
                  src={qrCodeUrl}
                  alt="UPI QR Code"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-xs space-y-1">
                <p className="font-extrabold text-brand-grey-950 text-sm">
                  Amount: ₹{totalBill}
                </p>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-brand-grey-600">
                  <span className="font-mono">{upiId}</span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="p-1 rounded hover:bg-brand-grey-100 text-brand-teal-700"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-brand-grey-500 pt-1">
                  Supports GPay &bull; PhonePe &bull; Paytm &bull; BHIM &bull; Any Banking App
                </p>
              </div>

              {/* Mobile Direct Pay Link */}
              <div className="pt-1 sm:hidden">
                <a
                  href={upiUri}
                  className="w-full py-2 px-3 rounded-xl bg-brand-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Open in UPI App</span>
                </a>
              </div>
            </div>

            {/* 1-Click WhatsApp Payment Request */}
            <a
              href={waPaymentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Send WhatsApp Bill to Resident (+91 {customerPhone})</span>
            </a>

            {/* Operator Settlement Confirmation */}
            <div className="pt-2 border-t border-brand-grey-800 space-y-3">
              <span className="text-xs font-bold text-white block">
                Operator Settlement Action
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    paymentMethod === "UPI"
                      ? "bg-brand-teal-600 text-white border-brand-teal-500"
                      : "bg-brand-grey-800 text-brand-grey-400 border-brand-grey-700 hover:text-white"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Paid via UPI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("Cash")}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                    paymentMethod === "Cash"
                      ? "bg-emerald-600 text-white border-emerald-500"
                      : "bg-brand-grey-800 text-brand-grey-400 border-brand-grey-700 hover:text-white"
                  }`}
                >
                  <Banknote className="w-3.5 h-3.5" />
                  <span>Paid via Cash</span>
                </button>
              </div>

              {paymentMethod === "UPI" && (
                <div>
                  <label className="text-[10px] text-brand-grey-400 block mb-1">
                    Optional UPI Transaction ID / UTR
                  </label>
                  <input
                    type="text"
                    value={upiRefNo}
                    onChange={(e) => setUpiRefNo(e.target.value)}
                    placeholder="e.g. 428190123849"
                    className="w-full px-3 py-1.5 rounded-lg bg-brand-grey-800 border border-brand-grey-700 text-xs text-white"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handleConfirmSettlement}
                disabled={isProcessing || totalBill <= 0}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Recording Settlement...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Payment of ₹{totalBill} &amp; Activate Warranty</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
