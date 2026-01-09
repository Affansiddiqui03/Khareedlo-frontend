import React from "react";
import UserSidebar from "../../components/UserSideBar";

export default function MyOrders() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex gap-8">
      <UserSidebar />

      <div className="flex-1">

        <h2 className="text-3xl font-bold mb-6">My Orders</h2>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">No orders yet.</p>
        </div>

      </div>
    </div>
  );
}
