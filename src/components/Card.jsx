// src/components/Card.jsx
import React from "react";

export default function Card({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
      </div>
      <div>{icon}</div>
    </div>
  );
}
