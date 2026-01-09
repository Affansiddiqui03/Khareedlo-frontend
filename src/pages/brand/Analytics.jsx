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
  const brandId = user?.brandId;

  const [chartData, setChartData] = useState([]);
  const [posData, setPosData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!brandId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:5000/api/pos/summary/${brandId}`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();

        // Defensive: handle both array or structured object
        if (Array.isArray(data)) {
          setPosData(data);
          setChartData([]); // no chart data available
        } else {
          setPosData(Array.isArray(data.products) ? data.products : []);
          setChartData(Array.isArray(data.last7Days) ? data.last7Days : []);
        }
      } catch (err) {
        console.error("Failed to fetch POS data:", err);
        setError("Failed to load analytics data.");
        setPosData([]);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [brandId]);

  return (
    <div className="space-y-8">
      {loading && <p className="text-gray-500">Loading analytics...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* SALES CHART */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold mb-4">Performance (Last 7 Days)</h3>
        {chartData.length > 0 ? (
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
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
          <p className="text-gray-400">No sales data available</p>
        )}
      </div>

      {/* POS TABLE */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold mb-4">POS Product Performance</h3>
        <table className="w-full text-left text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="py-2">Product</th>
              <th>Add To Cart</th>
              <th>Buy Now Clicks</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(posData) && posData.length > 0 ? (
              posData.map((p) => (
                <tr key={p.product_id}>
                  <td>{p.product_name}</td>
                  <td>{p.cart_clicks ?? 0}</td>
                  <td>{p.buy_now_clicks ?? 0}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-gray-400">
                  No POS data yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
