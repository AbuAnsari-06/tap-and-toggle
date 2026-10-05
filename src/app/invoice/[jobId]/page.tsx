"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Printer,
  ShieldCheck,
  CheckCircle2,
  Building,
  Wrench,
  Zap,
  ArrowLeft,
  Receipt,
  Download,
} from "lucide-react";
import { fetchCustomerTrackingAction, CustomerTrackingData } from "@/app/actions/trackJob";

export default function InvoicePage() {
  const params = useParams();
  const rawJobId = params?.jobId as string;
  const jobId = Array.isArray(rawJobId) ? rawJobId[0] : rawJobId;

  const [ticket, setTicket] = useState<CustomerTrackingData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;
    fetchCustomerTrackingAction(jobId).then((res) => {
      if (res.success && res.data) {
        setTicket(res.data);
      }
      setLoading(false);
    });
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-grey-50 flex items-center justify-center text-xs text-brand-grey-500">
        Generating tax invoice &amp; warranty certificate...
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-brand-grey-50 p-8 text-center text-xs text-brand-grey-500">
        Invoice not found.
      </div>
    );
  }

  const invoiceDate = new Date(ticket.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const warrantyExpires = new Date(
    new Date(ticket.created_at).getTime() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const laborCost = Number(ticket.estimate_amount) || 250;
  const partsCost = Number(ticket.parts_amount) || 0;
  const handlingCost = Number(ticket.handling_fee) || 30;
  const totalAmount = Number(ticket.final_amount) || laborCost + partsCost + handlingCost;

  return (
    <div className="min-h-screen bg-brand-grey-100 py-8 px-4 sm:px-6 print:p-0 print:bg-white text-brand-grey-900">
      {/* Top Action Bar (Hidden on print) */}
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/track/${jobId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-teal-800 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Live Tracker</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-brand-teal-700 hover:bg-brand-teal-800 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Invoice Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-brand-grey-200 shadow-xl print:shadow-none print:border-none print:p-0 space-y-8">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-brand-grey-200 pb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-brand-teal-900 tracking-tight">
                Tap &amp; Toggle
              </span>
              <span className="px-2 py-0.5 rounded bg-brand-teal-100 text-brand-teal-800 text-[10px] font-bold uppercase">
                Hyperlocal Pune
              </span>
            </div>
            <p className="text-xs text-brand-grey-500 mt-1">
              Plumbing &amp; Electrical Services · NIBM &amp; South Pune
            </p>
            <p className="text-xs text-brand-grey-400 mt-0.5">
              DPDP Act 2023 Compliant · Merchant of Record
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-xl font-black text-brand-grey-900 block font-mono">
              TAX INVOICE
            </span>
            <span className="text-xs text-brand-grey-500 font-mono block mt-0.5">
              Invoice #{jobId.slice(-8).toUpperCase()}
            </span>
            <span className="text-xs text-brand-grey-500 block mt-0.5">
              Date: {invoiceDate}
            </span>
          </div>
        </div>

        {/* Customer & Job Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <span className="text-[10px] font-bold text-brand-grey-400 uppercase tracking-wider block mb-1">
              Billed To Resident
            </span>
            <span className="font-bold text-brand-grey-900 text-sm block">
              Flat {ticket.flat_no}
            </span>
            <span className="text-brand-grey-600 block mt-0.5">
              {ticket.society_name}, NIBM Road, Pune, MH
            </span>
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-bold text-brand-grey-400 uppercase tracking-wider block mb-1">
              Service Details
            </span>
            <span className="font-bold text-brand-grey-900 text-sm block capitalize">
              {ticket.service} Maintenance
            </span>
            <span className="text-brand-grey-600 block mt-0.5 max-w-xs sm:ml-auto">
              {ticket.description}
            </span>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="border border-brand-grey-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-grey-50 border-b border-brand-grey-200 text-brand-grey-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Item &amp; Description</th>
                <th className="py-3 px-4 text-center">Type</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-grey-200 text-brand-grey-800">
              <tr>
                <td className="py-3 px-4">
                  <span className="font-bold block">Technician Labor &amp; Diagnostic Inspection</span>
                  <span className="text-[11px] text-brand-grey-500">
                    Hand-vetted bench pro: {ticket.pro?.name || "Assigned Technician"}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">Labor</td>
                <td className="py-3 px-4 text-right font-semibold">₹{laborCost}</td>
              </tr>

              {/* Spare parts items */}
              {ticket.expenses && ticket.expenses.length > 0 ? (
                ticket.expenses.map((exp) => (
                  <tr key={exp.id}>
                    <td className="py-3 px-4">
                      <span className="font-medium block">{exp.item_name}</span>
                      <span className="text-[10px] text-brand-grey-400 font-mono">
                        Hardware actuals (Qty {exp.quantity} × ₹{exp.unit_price})
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">Material</td>
                    <td className="py-3 px-4 text-right font-semibold">₹{exp.total_price}</td>
                  </tr>
                ))
              ) : partsCost > 0 ? (
                <tr>
                  <td className="py-3 px-4 font-medium">Spare Parts at Actual Hardware Store Cost</td>
                  <td className="py-3 px-4 text-center">Material</td>
                  <td className="py-3 px-4 text-right font-semibold">₹{partsCost}</td>
                </tr>
              ) : null}

              {handlingCost > 0 && (
                <tr>
                  <td className="py-3 px-4">
                    <span className="font-medium block">Parts Procurement &amp; Arrangement Fee</span>
                    <span className="text-[10px] text-brand-grey-400">Fixed convenience fee</span>
                  </td>
                  <td className="py-3 px-4 text-center">Handling</td>
                  <td className="py-3 px-4 text-right font-semibold">₹{handlingCost}</td>
                </tr>
              )}
            </tbody>
            <tfoot className="bg-brand-grey-50/80 border-t border-brand-grey-200 font-bold">
              <tr>
                <td colSpan={2} className="py-3.5 px-4 text-sm text-brand-grey-900">
                  Total Paid via UPI
                </td>
                <td className="py-3.5 px-4 text-right text-base text-emerald-700 font-black">
                  ₹{totalAmount}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment Confirmation Badge */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>PAYMENT STATUS: SETTLED IN FULL</span>
          </div>
          <span className="text-[11px] text-emerald-800 font-mono">Merchant: Tap &amp; Toggle</span>
        </div>

        {/* Official 7-Day Workmanship Warranty Certificate */}
        <div className="p-6 rounded-3xl bg-brand-teal-50 border-2 border-brand-teal-300 text-brand-teal-950 space-y-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-teal-700" />
            <h3 className="text-sm font-extrabold uppercase tracking-wide">
              Official 7-Day Digital Workmanship Warranty Certificate
            </h3>
          </div>
          <p className="text-xs leading-relaxed text-brand-teal-900">
            This certifies that the repair work conducted for Flat {ticket.flat_no}, {ticket.society_name} is protected under the <strong>Tap &amp; Toggle 7-Day Workmanship Guarantee</strong>. If the exact same issue recurs on or before <strong>{warrantyExpires}</strong>, Tap &amp; Toggle will dispatch a technician to resolve it at ₹0 additional labor charge.
          </p>
          <div className="pt-2 flex items-center justify-between text-[11px] text-brand-teal-800 font-semibold border-t border-brand-teal-200">
            <span>Valid Until: {warrantyExpires}</span>
            <span>Support: +91 80509 59001</span>
          </div>
        </div>

        {/* Footer legal disclaimer */}
        <div className="text-center text-[10px] text-brand-grey-400 pt-4 border-t border-brand-grey-100 space-y-0.5">
          <p>Tap &amp; Toggle Hyperlocal Services · NIBM Pune · Customer Support: hello@tapandtoggle.in</p>
          <p>Computer-generated digital receipt. No signature required.</p>
        </div>
      </div>
    </div>
  );
}
