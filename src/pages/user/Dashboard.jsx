import React from "react";
import UserSidebar from "../../components/UserSideBar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex gap-8">
      <UserSidebar />

      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-orange-400 text-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold">Total Orders</h2>
            <p className="text-3xl font-bold mt-2">12</p>
          </div>

          <div className="bg-purple-400 text-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold">Wishlist Items</h2>
            <p className="text-3xl font-bold mt-2">8</p>
          </div>

          <div className="bg-green-500 text-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold">Messages</h2>
            <p className="text-3xl font-bold mt-2">2</p>
          </div>

        </div>

        <div className="mt-10 bg-white p-6 shadow rounded-xl">
          <h2 className="text-2xl font-bold mb-3">Recent Orders</h2>
          <p className="text-gray-600 text-sm">Backend will populate this automatically later.</p>
        </div>
      </div>
    </div>
  );
}
