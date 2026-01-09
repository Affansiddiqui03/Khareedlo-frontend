// src/components/AppSkeleton.jsx
import React from "react";
import Skeleton from "./Skeleton";

/*
  Usage:
  <AppSkeleton variant="products" />
  variants: "hero", "products", "brands", "list"
*/

export default function AppSkeleton({ variant = "products" }) {
  if (variant === "hero") {
    return (
      <div className="space-y-6">
        <Skeleton className="w-full h-64" rounded="lg" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36" rounded="md" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "brands") {
    return (
      <div className="space-y-6">
        <Skeleton className="w-1/3 h-10" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-20 w-full" rounded="lg" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-8 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // default: products grid
  return (
    <div>
      <div className="mb-6">
        <Skeleton className="w-48 h-8" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white p-3 rounded-2xl shadow">
            <Skeleton className="w-full h-44 rounded-xl" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
