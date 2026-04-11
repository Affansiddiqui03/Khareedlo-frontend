import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";



export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { user, authLoading } = useAuth();

  const [allProducts, setAllProducts] = useState([]);
  const [compareId, setCompareId] = useState("");

  const compareProduct = allProducts.find(p => p.id == compareId);

  // 🔹 Fetch single product
  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error(err));
  }, [id]);

  // 🔹 Fetch all products (for comparison)
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(setAllProducts)
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token || !product) return;

  fetch("http://localhost:5000/api/user/track/product-click", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      productName: product.title,
      brandName: product.brand
    })
  });
}, [product]);

  // 🔹 ADD TO CART + POS TRACK
  const handleAddToCart = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }


    fetch("http://localhost:5000/api/pos/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brand_id: product.brand_id,
        product_id: product.id,
        action: "ADD_TO_CART",
      }),
    }).catch(err => console.error("POS track failed", err));

    addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // 🔹 BUY NOW + POS TRACK
const handleBuyNow = async () => {
  const token = localStorage.getItem("token");

  // 🔹 Track buy redirect (user analytics)
  if (token) {
    try {
      await fetch("http://localhost:5000/api/user/track/buy-redirect", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("Buy redirect tracking failed", err);
    }
  } else {
    // agar login nahi hai to modal dikhao
    setShowLoginModal(true);
    return;
  }

  // 🔹 POS TRACK (brand side)
  fetch("http://localhost:5000/api/pos/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      brand_id: product.brand_id,
      product_id: product.id,
      action: "BUY_NOW",
    }),
  }).catch(err => console.error("POS track failed", err));

  // 🔹 Redirect to brand website
  if (product.brand_website) {
    window.open(product.brand_website, "_blank");
  }
};


  const goToLogin = () => {
    setShowLoginModal(false);
    navigate("/auth");
  };

  // ✅ SAFE conditional render AFTER hooks
  if (!product) {
    return (
      <div className="py-24 text-center text-gray-500">
        Product not found
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-red-100 to-[#fff4d9] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-14">

        {/* IMAGE */ }
        <div className="rounded-3xl overflow-hidden shadow-xl">
          <img
            src={ `http://localhost:5000/${product.image}` }
            alt={ product.title }
            className="w-full h-[520px] object-cover hover:scale-105 transition"
          />
        </div>

        {/* INFO */ }
        <div>
          <p className="text-indigo-600 font-medium text-sm">
            { product.brand }
          </p>

          <h1 className="text-4xl font-extrabold mt-2 text-gray-900">
            { product.title }
          </h1>

          <p className="text-2xl font-bold text-orange-600 mt-4">
            PKR { product.price }
          </p>

          <p className="mt-3 text-sm text-red-900">
            Note: Prices May Differ on the website
          </p>

          <p className="mt-6 text-gray-600 leading-relaxed">
            Crafted from premium quality materials with meticulous attention to
            detail, combining modern design with exceptional durability.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
  <button
    onClick={user ? handleAddToCart : () => setShowLoginModal(true)}
    className={`px-8 py-3 rounded-xl font-semibold transition-all
      ${user
        ? "bg-gradient-to-r from-red-600 to-orange-500 text-white hover:scale-[1.03]"
        : "bg-gray-300 text-gray-600 cursor-pointer"
      }`}
  >
    🛒 Add to Cart
  </button>

  <button
    onClick={user ? handleBuyNow : () => setShowLoginModal(true)}
    className={`px-8 py-3 rounded-xl font-semibold transition-all border
      ${user
        ? "border-gray-400 hover:bg-gray-100"
        : "border-gray-300 text-gray-500 cursor-pointer"
      }`}
  >
    ⚡ Buy Now
  </button>

  {!user && (
    <p className="w-full text-sm text-red-600 mt-2 font-medium">
      ⚠ Login first to add to cart or buy now!
    </p>
  )}
</div>
        </div>
      </div>

      {/* ===== COMPARISON ===== */ }
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-2xl font-bold mb-6">Compare Products</h2>

        <select
          value={ compareId }
          onChange={ e => setCompareId(e.target.value) }
          className="mb-6 border px-4 py-2 rounded-lg"
        >
          <option value="">Select product to compare</option>
          { allProducts.map(p => (
            <option key={ p.id } value={ p.id }>
              { p.title }
            </option>
          )) }
        </select>

        { compareProduct && (
          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Feature</th>
                  <th className="p-4 text-left">Current Product</th>
                  <th className="p-4 text-left">Compared Product</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-4 font-semibold">Image</td>
                  <td className="p-4">
                    <img
                      src={ `http://localhost:5000/${product.image}` }
                      className="h-32 rounded" alt="img"
                    />
                  </td>
                  <td className="p-4">
                    <img
                      src={ `http://localhost:5000/${compareProduct.image}` }
                      className="h-32 rounded" alt="img"
                    />
                  </td>
                </tr>

                <tr className="border-t">
                  <td className="p-4 font-semibold">Price</td>
                  <td className="p-4">PKR { product.price }</td>
                  <td className="p-4">PKR { compareProduct.price }</td>
                </tr>

                <tr className="border-t">
                  <td className="p-4 font-semibold">Brand</td>
                  <td className="p-4">{ product.brand }</td>
                  <td className="p-4">{ compareProduct.brand }</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) }
      </div>

      {/* TOAST */ }
      { showToast && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-white shadow-2xl rounded-2xl px-6 py-4 flex gap-3">
            <span className="text-green-600 text-xl">✔</span>
            <div>
              <p className="font-semibold">Added to Cart</p>
              <p className="text-sm text-gray-500">{ product.title }</p>
            </div>
          </div>
        </div>
      ) }

      {/* LOGIN MODAL */ }
      { showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4">Please Login First</h2>
            <p className="text-gray-600 mb-6">
              You need to login to buy this product.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={ () => setShowLoginModal(false) }
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={ goToLogin }
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Login Now
              </button>
            </div>
          </div>
        </div>
      ) }
    </div>
  );
}
