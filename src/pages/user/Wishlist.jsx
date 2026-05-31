// src/pages/user/Wishlist.jsx  — REPLACE completely

import React, { useState } from "react";
import UserLayout from "../../components/UserLayout";
import { useWishlist } from "../../contexts/WishlistContext";
import { Heart, Package, ExternalLink, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [removing, setRemoving] = useState(null);

  const handleRemove = (id) => {
    setRemoving(id);
    setTimeout(() => { removeFromWishlist(id); setRemoving(null); }, 300);
  };

  return (
    <UserLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-sm text-gray-500 mt-1">{wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}</p>
          </div>
          {wishlist.length > 0 && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 text-red-600">
              {wishlist.length} items
            </span>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-24 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-red-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Your wishlist is empty</h3>
            <p className="text-gray-400 text-sm mt-2 max-w-xs">Browse brands and products and click the heart icon to save items you love.</p>
            <Link to="/products"
              className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #E53E3E, #F97316)" }}>
              <ShoppingBag className="w-4 h-4" /> Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wishlist.map((item) => {
              const id = item.id || item.product_id;
              const isRemoving = removing === id;
              return (
                <div key={id}
                  className={`bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 ${isRemoving ? "opacity-40 scale-95" : ""}`}>
                  {/* Image */}
                  <div className="h-48 bg-gray-50 overflow-hidden relative">
                    {item.image && item.image !== "photos/" ? (
                      <img
                        src={item.image.startsWith("http") ? item.image : `https://khareedlo-backend-production.up.railway.app/${item.image}`}
                        alt={item.product_name || item.title || item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        onError={e => e.target.style.display = "none"}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-10 h-10 text-gray-200" />
                      </div>
                    )}
                    {/* Remove btn */}
                    <button onClick={() => handleRemove(id)}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm leading-snug line-clamp-2">
                      {item.product_name || item.title || item.name}
                    </h3>
                    {item.brand && <p className="text-xs text-gray-400 mt-0.5">{item.brand}</p>}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-base font-bold text-red-600">
                        PKR {Number(item.price).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex gap-2 mt-3">
                      {(item.buy_now_link || item.buyNowLink) && (
                        <a href={item.buy_now_link || item.buyNowLink} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-white text-xs font-semibold"
                          style={{ background: "linear-gradient(135deg, #E53E3E, #F97316)" }}>
                          <ExternalLink className="w-3.5 h-3.5" /> Buy Now
                        </a>
                      )}
                      <button onClick={() => handleRemove(id)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </UserLayout>
  );
}