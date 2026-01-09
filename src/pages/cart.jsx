import React from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import QuantityControl from "../components/QuantityControl";
import { useCart } from "../contexts/CartContext";
import { brands } from "../data/demoData";

export default function Cart() {
  const {
    cart,
    inc,
    dec,
    removeFromCart,
    clearCart,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-b from-purple-100 to-white px-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Your Cart is Empty
        </h1>
        <p className="text-gray-600 mt-2">
          Let’s find something you love.
        </p>
        <Link
          to="/products"
          className="mt-6 px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-800"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const getBrandWebsite = (brandIdOrName) => {
    const brand = brands.find(
      (b) => b._id === brandIdOrName || b.name === brandIdOrName
    );
    return brand?.website;
  };

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Your Cart
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow divide-y">
          {cart.map((it) => {
            const brandWebsite = getBrandWebsite(it.brand || it.brandId);

            return (
              <div key={it.id} className="p-5 flex flex-col sm:flex-row gap-4">
                {/* IMAGE */}
                <img
                  src={it.image}
                  alt={it.name}
                  className="h-24 w-24 rounded-xl object-cover"
                />

                {/* INFO */}
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {it.name}
                  </div>

                  {it.brand && (
                    <div className="text-xs text-gray-500">
                      Brand: {it.brand}
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <QuantityControl
                      qty={it.qty}
                      onDec={() => dec(it.id)}
                      onInc={() => inc(it.id)}
                    />

                    <button
                      onClick={() => removeFromCart(it.id)}
                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>

                {/* PRICE + BUY */}
                <div className="sm:text-right flex sm:flex-col justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-500">Total</div>
                    <div className="font-semibold text-lg">
                      PKR {(it.price * it.qty).toLocaleString()}
                    </div>
                  </div>

                  <a
                    href={brandWebsite || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-xl text-center font-semibold transition
                      ${
                        brandWebsite
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    onClick={(e) => {
                      if (!brandWebsite) e.preventDefault();
                    }}
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
