import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  const user = JSON.parse(localStorage.getItem("user"));
  const brandId = user?.brandId || user?.id; // 🔥 fallback safety

  const [chartData, setChartData] = useState([]);
  const [posData, setPosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!brandId) {
      setError("Brand not found");
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `http://localhost:5000/api/pos/summary/${brandId}`
        );

        if (!res.ok) throw new Error("Failed to fetch analytics");

        const data = await res.json();

        setChartData(Array.isArray(data.last7Days) ? data.last7Days : []);
        setPosData(Array.isArray(data.products) ? data.products : []);
      } catch (err) {
        console.error(err);
        setError("Unable to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [brandId]);

  if (loading) {
    return <p className="text-gray-500">Loading analytics...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-8">
      {/* SALES CHART */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold mb-4">
          Performance (Last 7 Days)
        </h3>

        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-400">No sales data yet</p>
        )}
      </div>

      {/* POS TABLE */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold mb-4">
          POS Product Performance
        </h3>

        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="py-2">Product</th>
              <th>Add to Cart</th>
              <th>Buy Now</th>
            </tr>
          </thead>
          <tbody>
            {posData.length > 0 ? (
              posData.map((p) => (
                <tr key={p.product_id || p._id}>
                  <td className="py-2">{p.product_name}</td>
                  <td>{p.cart_clicks || 0}</td>
                  <td>{p.buy_now_clicks || 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-gray-400 py-4">
                  No POS data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
