import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminDashboard() {
  const [pending, setPending] = useState([]);
  const [stats, setStats] = useState({
    brands: 0,
    users: 0,
    products: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch pending brands
    fetch("http://localhost:5000/api/admin/brands/pending")
      .then((res) => res.json())
      .then((data) => setPending(Array.isArray(data) ? data : []));

    // Fetch users
    fetch("http://localhost:5000/api/admin/users")
      .then((res) => res.json())
      .then((data) =>
        setStats((prev) => ({ ...prev, users: data.length }))
      );

    // Fetch brands
    fetch("http://localhost:5000/api/admin/brands")
      .then((res) => res.json())
      .then((data) =>
        setStats((prev) => ({ ...prev, brands: data.length }))
      );

    // Fetch products
    fetch("http://localhost:5000/api/admin/products")
      .then((res) => res.json())
      .then((data) =>
        setStats((prev) => ({ ...prev, products: data.length }))
      )
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id, action) => {
    try {
      await fetch(
        `http://localhost:5000/api/admin/brands/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }
      );

      setPending((prev) =>
        prev.filter((b) => b.brand_id !== id)
      );
    } catch (err) {
      alert("Action failed");
    }
  };

  if (loading) return <p className="p-6">Loading dashboard...</p>;

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <h1 className="text-3xl font-extrabold mb-2">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 mb-8">
          Manage brands and platform approvals
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-sm text-gray-500">Total Brands</h3>
            <p className="text-3xl font-bold mt-2">
              {stats.brands}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-sm text-gray-500">Customers</h3>
            <p className="text-3xl font-bold mt-2">
              {stats.users}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-sm text-gray-500">Products</h3>
            <p className="text-3xl font-bold mt-2">
              {stats.products}
            </p>
          </div>
        </div>

        {/* Pending Brands */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">
            Pending Brand Requests
          </h2>

          {pending.length === 0 ? (
            <p className="text-gray-500">
              No pending brands 🎉
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2">Brand</th>
                  <th className="text-left">Email</th>
                  <th className="text-left">Phone</th>
                  <th className="text-left">Website</th>
                  <th className="text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {pending.map((b) => (
                  <tr
                    key={b.brand_id}
                    className="border-b"
                  >
                    <td className="py-2 font-semibold">
                      {b.brand_name}
                    </td>
                    <td>{b.email}</td>
                    <td>{b.phone || b.contact}</td>

                    <td>
                      {b.website ? (
                        <a
                          href={b.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Visit
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="space-x-2">
                      <button
                        onClick={() =>
                          handleAction(
                            b.brand_id,
                            "approve"
                          )
                        }
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleAction(
                            b.brand_id,
                            "reject"
                          )
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}