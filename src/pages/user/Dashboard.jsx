import React, { useState, useEffect } from "react";
import UserSidebar from "../../components/UserSideBar";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [stats, setStats] = useState({
    visitedBrands: 0,
    productClicks: 0,
    buyRedirects: 0
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/user/profile", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(data => {
        setStats(data?.activityStats || {
          visitedBrands: 0,
          productClicks: 0,
          buyRedirects: 0
        });

        setActivities(Array.isArray(data?.recentActivities) ? data.recentActivities : []);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex gap-8">
      <UserSidebar />

      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, <span className="text-indigo-600">{ user?.name }</span>
        </h1>
        <p className="text-gray-500 mb-6">
          Track your activity across brands on Khareedlo
        </p>

        {/* STATS */ }
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Visited Brands" value={ stats?.visitedBrands || 0 } />
          <StatCard title="Product Clicks" value={ stats?.productClicks || 0 } />
          <StatCard title="Buy Redirects" value={ stats?.buyRedirects || 0 } />
        </div>



        {/* RECENT ACTIVITY */ }
        <div className="mt-10 bg-white p-6 shadow rounded-xl">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <p className="text-sm text-gray-500">
            Products and brands you interacted with recently
          </p>

          { activities.length === 0 && (
            <p className="text-sm text-gray-400 mt-2">
              No recent activity yet
            </p>
          ) }

          { activities.map((a, i) => (
            <div key={ i } className="text-sm text-gray-600">
              { a.productName } – <span className="text-indigo-600">{ a.brandName }</span>
            </div>
          )) }

        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <p className="text-sm text-gray-500">{ title }</p>
      <p className="text-3xl font-bold text-indigo-600 mt-2">{ value }</p>
    </div>
  );
}
