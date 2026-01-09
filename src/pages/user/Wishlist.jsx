// src/pages/user/Wishlist.jsx
import React, { useContext } from "react";
import { WishlistContext } from "../../contexts/WishlistContext";
import { FaTrashAlt } from "react-icons/fa";
import UserSidebar from "../../components/UserSideBar";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext);

  if (!wishlist) return null; // Safety for initial undefined

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex gap-8">
      
      {/* ✅ LEFT SIDEBAR */}
      <UserSidebar />

      {/* ✅ RIGHT CONTENT */}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">
          My Wishlist ❤️
        </h1>

        {wishlist.length === 0 ? (
          <p className="text-gray-600 text-lg">Your wishlist is empty.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow relative"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="text-lg font-semibold mt-3">{item.name}</h3>
                <p className="text-gray-700 mb-2">PKR {item.price}</p>

                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
