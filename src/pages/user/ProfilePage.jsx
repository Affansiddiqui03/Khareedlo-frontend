import React from "react";
import UserSidebar from "../../components/UserSideBar";
import { Headset, HelpCircle } from "lucide-react";

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex gap-8">
      <UserSidebar />

      <div className="bg-white p-8 shadow rounded-xl flex-1">
        <h2 className="text-3xl font-bold mb-6">Profile Information</h2>

        {/* BASIC INFO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="font-semibold text-gray-700">Full Name</label>
            <input
              value={user?.name || ""}
              disabled
              className="w-full mt-1 p-3 border rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="font-semibold text-gray-700">Email</label>
            <input
              value={user?.email || ""}
              disabled
              className="w-full mt-1 p-3 border rounded-lg bg-gray-100"
            />
          </div>
        </div>

        {/* SUPPORT SECTION */}
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">Support</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-5 border rounded-xl hover:shadow transition cursor-pointer">
              <Headset className="text-indigo-600" size={32} />
              <div>
                <p className="font-semibold">Customer Care</p>
                <p className="text-sm text-gray-500">
                  Contact admin for account-related issues
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 border rounded-xl hover:shadow transition cursor-pointer">
              <HelpCircle className="text-indigo-600" size={32} />
              <div>
                <p className="font-semibold">Help Center</p>
                <p className="text-sm text-gray-500">
                  FAQs & platform usage guidelines
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
