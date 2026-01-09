import React from "react";
import UserSidebar from "../../components/UserSideBar";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex gap-8">
      <UserSidebar />

      <div className="bg-white p-8 shadow rounded-xl flex-1">
        <h2 className="text-3xl font-bold mb-6">Profile Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold text-gray-700">Full Name</label>
            <input className="w-full mt-1 p-3 border rounded-lg" placeholder="User Name" />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Email</label>
            <input className="w-full mt-1 p-3 border rounded-lg" placeholder="user@email.com" />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Phone</label>
            <input className="w-full mt-1 p-3 border rounded-lg" placeholder="03XX-XXXXXXX" />
          </div>

          <div>
            <label className="font-semibold text-gray-700">City</label>
            <input className="w-full mt-1 p-3 border rounded-lg" placeholder="City" />
          </div>
        </div>

        <button className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg">
          Save Changes
        </button>
      </div>
    </div>
  );
}
