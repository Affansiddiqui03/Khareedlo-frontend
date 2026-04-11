// src/pages/brand/Overview.jsx
import React, { useEffect, useState } from "react";
import { Package, ShoppingCart, Zap } from "lucide-react";
import Card from "../../components/Card";
import { useAuth } from "../../contexts/AuthContext";


export default function Overview() {
const { user } = useAuth();
const brandId = user?.id;
const brandName = user?.name || "Your Brand";

  const [stats, setStats] = useState({
    total_products: 0,
    cart_clicks: 0,
    buy_clicks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  console.log("OVERVIEW brandId:", brandId);
}, [brandId]);

  useEffect(() => {
if (!brandId) return;


    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/brand/overview/${brandId}`)
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch overview:", err);
        setError("Failed to load overview data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [brandId]);

  return (
    <div>
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, <span className="text-indigo-600">{brandName}</span>
          </h1>
          <p className="text-sm text-gray-500">Overview of your store performance</p>
        </div>
      </header>

      {/* LOADING / ERROR */}
      {loading && <p className="text-gray-500 mb-4">Loading overview...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* STATS CARDS */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
          <Card
            title="Products"
            value={stats.total_products}
            icon={<Package className="w-6 h-6 text-blue-500" />}
          />
          <Card
            title="Add To Cart"
            value={stats.cart_clicks}
            icon={<ShoppingCart className="w-6 h-6 text-green-500" />}
          />
          <Card
            title="Buy Now"
            value={stats.buy_clicks}
            icon={<Zap className="w-6 h-6 text-yellow-500" />}
          />
          <Card
            title="Top Product"
            value="0"
            icon={<Zap className="w-6 h-6 text-purple-500" />}
          />
        </div>
      )}
    </div>
  );
}
