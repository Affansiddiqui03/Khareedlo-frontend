// src/pages/brand/Inventory.jsx
import React, { useEffect, useState } from "react";

export default function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // TODO: load inventory from API
    setItems([
      { id: 1, name: "Linen Kurta", stock: 12, low: false },
      { id: 2, name: "Silk Shirt", stock: 3, low: true },
    ]);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Inventory</h2>

      <div className="grid gap-3">
        {items.map(it => (
          <div key={it.id} className="bg-white p-4 rounded-2xl shadow flex items-center justify-between">
            <div>
              <div className="font-medium">{it.name}</div>
              <div className="text-sm text-gray-500">Stock: {it.stock}</div>
            </div>
            <div className="flex items-center gap-3">
              {it.low && <div className="text-sm text-red-600 font-semibold">Low stock</div>}
              <button className="px-3 py-2 rounded bg-indigo-600 text-white">Restock</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
