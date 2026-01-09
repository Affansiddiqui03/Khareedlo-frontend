import React from "react";
import { Minus, Plus } from "lucide-react";

export default function QuantityControl({ qty, onDec, onInc }) {
  return (
    <div className="inline-flex items-center rounded-lg border bg-white">
      <button
        type="button"
        onClick={onDec}
        className="px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <div className="px-4 py-1.5 min-w-[2.5rem] text-center font-medium">{qty}</div>
      <button
        type="button"
        onClick={onInc}
        className="px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
