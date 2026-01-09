import React from "react";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b to-[#fff4d9] z-[9999]">
      <div className="flex flex-col items-center space-y-4 animate-fadeIn">
        <div className="w-16 h-16 border-4 border-[#fff4d9] border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-2xl font-extrabold text-orange-600 tracking-wide animate-pulse">
          KHAREEDLO
        </h2>
      </div>
    </div>
  );
}
