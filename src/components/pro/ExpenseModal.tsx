"use client";

import React, { useState } from "react";
import { X, Camera, Receipt, Plus, Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { addJobExpenseAction } from "@/app/actions/proJobActions";
import { JobExpense } from "@/types/database";

interface ExpenseModalProps {
  jobId: string;
  onClose: () => void;
  onExpenseAdded: (expense: JobExpense) => void;
}

export function ExpenseModal({ jobId, onClose, onExpenseAdded }: ExpenseModalProps) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedQty = Math.max(1, Number(quantity) || 1);
  const parsedPrice = Math.max(0, Number(unitPrice) || 0);
  const totalPrice = parsedQty * parsedPrice;

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) {
      setError("Please enter the spare part or material name.");
      return;
    }
    if (parsedPrice <= 0) {
      setError("Please enter a valid price for the item.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await addJobExpenseAction(jobId, {
      item_name: itemName.trim(),
      quantity: parsedQty,
      unit_price: parsedPrice,
      receipt_photo_url: photoPreview || undefined,
      notes: notes.trim() || undefined,
    });

    if (res.success && res.expense) {
      onExpenseAdded(res.expense);
      onClose();
    } else {
      setError(res.error || "Failed to record expense. Please retry.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-lg bg-brand-grey-900 border border-brand-grey-800 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-brand-grey-800 flex items-center justify-between bg-brand-grey-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Add Spare Part / Hardware Bill
              </h2>
              <p className="text-xs text-brand-grey-400">
                Itemized parts cost at actuals + proof
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-brand-grey-400 hover:text-white hover:bg-brand-grey-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Part Name */}
          <div>
            <label className="block text-xs font-semibold text-brand-grey-300 mb-1.5">
              Item Name / Description <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Hindware Brass Angle Valve 1/2 inch"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-brand-grey-800/80 border border-brand-grey-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-brand-grey-500"
            />
          </div>

          {/* Qty & Unit Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-grey-300 mb-1.5">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-grey-800/80 border border-brand-grey-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-grey-300 mb-1.5">
                Unit Price (₹) <span className="text-amber-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="5"
                placeholder="250"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-brand-grey-800/80 border border-brand-grey-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-brand-grey-500"
              />
            </div>
          </div>

          {/* Live Total Calculation */}
          <div className="p-3 rounded-xl bg-brand-grey-800/60 border border-brand-grey-700/80 flex items-center justify-between text-xs">
            <span className="text-brand-grey-400">Total Item Cost:</span>
            <span className="text-base font-bold text-amber-400">
              ₹{totalPrice.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Hardware Shop Bill / Receipt Photo */}
          <div>
            <label className="block text-xs font-semibold text-brand-grey-300 mb-1.5">
              Receipt / Bill Photo Proof
            </label>
            <div className="flex flex-col gap-2">
              <label className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-brand-grey-700 hover:border-amber-500/60 rounded-xl cursor-pointer bg-brand-grey-800/40 hover:bg-brand-grey-800/60 transition group">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoCapture}
                />
                <div className="flex items-center gap-2 text-xs font-medium text-brand-grey-300 group-hover:text-amber-300">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>Snap Bill with Camera or Select Photo</span>
                </div>
                <span className="text-[10px] text-brand-grey-500 mt-0.5">
                  Takes photo of physical hardware store receipt
                </span>
              </label>

              {photoPreview && (
                <div className="relative rounded-xl overflow-hidden border border-brand-grey-700 max-h-36 bg-black flex items-center justify-center">
                  <img
                    src={photoPreview}
                    alt="Receipt preview"
                    className="max-h-36 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-semibold text-brand-grey-300 mb-1.5">
              Hardware Shop / Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Laxmi Hardware, Kondhwa · Bill #412"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-brand-grey-800/80 border border-brand-grey-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-brand-grey-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Recording Part...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Expense &amp; Update Bill</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
