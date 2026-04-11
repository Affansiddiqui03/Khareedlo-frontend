import React, { useEffect, useState } from "react";

export default function SummaryReport() {
  const user = JSON.parse(localStorage.getItem("user"));
  const brandName = user?.name;
  const brandId = user?.id;

  const [summary, setSummary] = useState({
    total_products: 0,
    cart_clicks: 0,
    buy_clicks: 0,
    top_product: "—",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!brandId) return;

    fetch(`/api/brand/summary/${brandId}`)
      .then(res => res.json())
      .then(data => {
        setSummary({
          total_products: data.total_products || 0,
          cart_clicks: data.cart_clicks || 0,
          buy_clicks: data.buy_clicks || 0,
          top_product: data.top_product || "—",
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Summary fetch error:", err);
        setLoading(false);
      });
  }, [brandId]);

  if (loading) {
    return <p className="text-gray-500">Loading report...</p>;
  }

  return (
    <div className="bg-white p-10 rounded-xl shadow print:p-0">
      <h1 className="text-3xl font-bold mb-2">{brandName}</h1>
      <p className="text-gray-500 mb-6">Brand Performance Summary</p>

      <ul className="space-y-3 text-gray-700">
        <li>
          <strong>Total Products:</strong> {summary.total_products}
        </li>
        <li>
          <strong>Add To Cart Clicks:</strong> {summary.cart_clicks}
        </li>
        <li>
          <strong>Buy Now Redirects:</strong> {summary.buy_clicks}
        </li>
        <li>
          <strong>Top Performing Product:</strong>{" "}
          {summary.top_product || "N/A"}
        </li>
      </ul>

      <button
        onClick={() => window.print()}
        className="mt-8 px-6 py-2 bg-indigo-600 text-white rounded print:hidden"
      >
        Print Report
      </button>
    </div>
  );
}
