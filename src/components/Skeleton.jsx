// src/components/Skeleton.jsx
import React from "react";

export default function Skeleton({ className = "", rounded = "md" }) {
  const r = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }[rounded] || "rounded-md";

  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${r} ${className}`}
      aria-hidden="true"
    />
  );
}
