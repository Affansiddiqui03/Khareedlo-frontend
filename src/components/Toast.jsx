// src/components/Toast.jsx
import React from "react";

export default function Toast({ id, type = "info", children, onClose }) {
  const bg = {
    info: "bg-indigo-600",
    success: "bg-emerald-600",
    error: "bg-red-600",
  }[type] || "bg-gray-600";

  return (
    <div className={`text-white px-4 py-3 rounded-xl shadow ${bg} flex items-start gap-3`}>
      <div className="flex-1 text-sm">{children}</div>
      <button onClick={() => onClose(id)} className="opacity-80 hover:opacity-100">✕</button>
    </div>
  );
}
