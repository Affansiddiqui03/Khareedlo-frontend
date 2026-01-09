import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function Checkout() {
  const { cart, subtotal, discount, shipping, grandTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal: "",
    payment: "cod",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city) return alert("Please fill required fields.");

    setSubmitting(true);
    try {
      // Mock order placement
      await new Promise((r) => setTimeout(r, 900));
      clearCart();
      navigate("/products", { state: { success: "Order placed! We'll contact you soon." } });
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <Link to="/products" className="text-indigo-600 hover:underline">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={onSubmit} className="lg:col-span-2 bg-white rounded-2xl shadow p-6 space-y-5">
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name *">
              <input name="name" value={form.name} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
            </Field>
            <Field label="Phone *">
              <input name="phone" value={form.phone} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
            </Field>
            <Field label="Email">
              <input name="email" value={form.email} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
            </Field>
            <Field label="City *">
              <input name="city" value={form.city} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
            </Field>
            <Field label="Address *" className="md:col-span-2">
              <input name="address" value={form.address} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
            </Field>
            <Field label="Postal Code" className="md:col-span-2">
              <input name="postal" value={form.postal} onChange={onChange} className="w-full border rounded-lg px-3 py-2 max-w-xs" />
            </Field>
          </div>

          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">Payment Method</div>
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center gap-2 border rounded-lg px-3 py-2">
                <input type="radio" name="payment" value="cod" checked={form.payment === "cod"} onChange={onChange} />
                <span>Cash on Delivery</span>
              </label>
              <label className="inline-flex items-center gap-2 border rounded-lg px-3 py-2 opacity-60 cursor-not-allowed">
                <input type="radio" disabled />
                <span>Card (coming soon)</span>
              </label>
            </div>
          </div>

          <Field label="Order Note (optional)">
            <textarea name="note" value={form.note} onChange={onChange} rows={3} className="w-full border rounded-lg px-3 py-2" />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? "Placing Order…" : "Place Order"}
          </button>
        </form>

        {/* Summary */}
        <aside className="bg-white rounded-2xl shadow p-6 h-fit sticky top-24">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

          <div className="space-y-3 max-h-80 overflow-auto pr-1">
            {cart.map((i) => (
              <div key={i.id} className="flex items-center gap-3">
                <img src={i.image} alt={i.name} className="h-14 w-14 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 line-clamp-1">{i.name}</div>
                  <div className="text-xs text-gray-500">Qty: {i.qty}</div>
                </div>
                <div className="text-sm font-semibold">PKR {(i.price * i.qty).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={`PKR ${subtotal.toLocaleString()}`} />
            <Row label="Discount" value={`- PKR ${discount.toLocaleString()}`} />
            <Row label="Shipping" value={shipping === 0 ? "FREE" : `PKR ${shipping.toLocaleString()}`} />
            <div className="border-t pt-3 font-semibold text-gray-900 flex items-center justify-between">
              <span>Total</span>
              <span className="text-xl">PKR {grandTotal.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">Orders usually ship within 24–48 hours.</p>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
      {children}
    </label>
  );
}
function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}
