// src/pages/brand/Orders.jsx
import React, { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // TODO: fetch real orders
    setOrders([
      { id: 101, customer: "Ali", total: 2499, status: "Pending" },
      { id: 102, customer: "Sara", total: 3999, status: "Shipped" },
    ]);
  }, []);

  const updateStatus = (id, newStatus) => {
    setOrders((s) => s.map(o => o.id===id ? {...o,status:newStatus} : o));
    // TODO: call update order status API
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Orders</h2>
      <div className="space-y-4">
        {orders.map(o => (
          <div key={o.id} className="bg-white p-4 rounded-2xl shadow flex items-center justify-between">
            <div>
              <div className="font-semibold">Order #{o.id} — {o.customer}</div>
              <div className="text-sm text-gray-500">Total: PKR {o.total}</div>
            </div>
            <div className="flex items-center gap-3">
              <select value={o.status} onChange={(e)=>updateStatus(o.id, e.target.value)} className="p-2 border rounded">
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
              <button className="px-3 py-2 border rounded">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
