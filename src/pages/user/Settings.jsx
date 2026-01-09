import React from "react";
import UserSidebar from "../../components/UserSideBar";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 flex gap-8">
      <UserSidebar />

      <div className="bg-white p-8 rounded-xl shadow flex-1">
        <h2 className="text-3xl font-bold mb-6">Account Settings</h2>

        <div className="space-y-6">

          <div>
            <label className="font-semibold">Change Password</label>
            <input type="password" className="w-full mt-1 p-3 border rounded-lg" placeholder="New password" />
          </div>

          <div>
            <label className="font-semibold text-red-600">Delete Account</label>
            <button className="w-full mt-1 bg-red-600 text-white py-3 rounded-lg">
              Delete My Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
