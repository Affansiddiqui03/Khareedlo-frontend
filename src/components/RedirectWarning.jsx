// src/components/RedirectWarning.jsx
// Shows a confirmation dialog before redirecting to brand website
// Works on all screen sizes including mobile

import React from "react";
import { ExternalLink, X, ShieldCheck } from "lucide-react";

export default function RedirectWarning({ brand, link, onConfirm, onCancel }) {
  if (!link) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-end sm:items-center justify-center p-4">
      {/* Modal */}
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-amber-50 px-6 py-5 border-b border-amber-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <ExternalLink className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Leaving Khareedlo</p>
                <p className="text-xs text-amber-600 font-medium">External Website</p>
              </div>
            </div>
            <button onClick={onCancel}
              className="p-2 rounded-xl hover:bg-amber-100 transition text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-gray-700 leading-relaxed">
            You're about to be taken to{" "}
            <strong className="text-gray-900">{brand}'s official website</strong>{" "}
            to complete your purchase.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Khareedlo is not responsible for transactions on external websites.
          </p>

          {/* Trust badge */}
          <div className="flex items-center gap-2 mt-4 bg-emerald-50 rounded-2xl px-3 py-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <p className="text-xs text-emerald-700 font-medium">This is a verified brand on Khareedlo</p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition active:scale-[0.98]">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl text-white text-sm font-bold transition active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>
            <ExternalLink className="w-4 h-4" /> Continue
          </button>
        </div>
      </div>
    </div>
  );
}
