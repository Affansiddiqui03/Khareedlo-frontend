import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch product
  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!product) {
    return (
      <div className="py-24 text-center text-gray-500">
        Product not found
      </div>
    );
  }

  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  // 🔹 ADD TO CART + POS TRACK
  const handleAddToCart = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // POS TRACK
    fetch("http://localhost:5000/api/pos/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand_id: product.brand_id,
        product_id: product.id,
        action: "ADD_TO_CART",
      }),
    }).catch((err) => console.error("POS track failed", err));

    addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // 🔹 BUY NOW + POS TRACK + REDIRECT
  const handleBuyNow = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    // POS TRACK
    fetch("http://localhost:5000/api/pos/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand_id: product.brand_id,
        product_id: product.id,
        action: "BUY_NOW",
      }),
    }).catch((err) => console.error("POS track failed", err));

    // redirect to brand website
    if (product.brand_website) {
      window.open(product.brand_website, "_blank");
    }
  };

  const goToLogin = () => {
    setShowLoginModal(false);
    navigate("/auth");
  };

  return (
    <div className="bg-gradient-to-b from-red-100 to-[#fff4d9] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-14">

        {/* IMAGE */}
        <div className="rounded-3xl overflow-hidden shadow-xl">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[520px] object-cover hover:scale-105 transition"
          />
        </div>

        {/* INFO */}
        <div>
          <p className="text-indigo-600 font-medium text-sm">
            {product.brand}
          </p>

          <h1 className="text-4xl font-extrabold mt-2 text-gray-900">
            {product.title}
          </h1>

          <p className="text-2xl font-bold text-indigo-600 mt-4">
            PKR {product.price}
          </p>

          <p className="mt-6 text-gray-600 leading-relaxed">
            Premium quality fabric with modern stitching, perfect for everyday
            wear and special occasions.
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-gradient-to-r from-red-600 to-[#f2976a]
              hover:from-red-700 hover:to-[#f2a77a]
              transition-colors text-white px-8 py-3
              rounded-xl font-semibold"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="border border-gray-300 px-8 py-3 rounded-xl
              font-semibold hover:bg-gray-100 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* TOAST */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="backdrop-blur-xl bg-white/90 shadow-2xl rounded-2xl px-6 py-4 flex items-center gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <div>
              <p className="font-semibold text-gray-800">Added to Cart</p>
              <p className="text-sm text-gray-500">{product.title}</p>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative animate-slide-up">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Please Login First
            </h2>
            <p className="text-gray-600 mb-6">
              You need to login to buy this product.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={goToLogin}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"
              >
                Login Now
              </button>
            </div>
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
