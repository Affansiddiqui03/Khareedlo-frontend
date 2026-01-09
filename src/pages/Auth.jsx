// src/pages/Auth.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();

  // ---------- General State ----------
  const [isLogin, setIsLogin] = useState(true);
  const [mode, setMode] = useState("customer"); // "customer" | "brand"
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // ---------- Customer State ----------
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custPassword, setCustPassword] = useState("");
  const [custConfirm, setCustConfirm] = useState("");

  // ---------- Brand State ----------
  const [brandIdentifier, setBrandIdentifier] = useState("");
  const [brandPassword, setBrandPassword] = useState("");
  const [brandName, setBrandName] = useState("");
  const [brandEmail, setBrandEmail] = useState("");
  const [brandConfirm, setBrandConfirm] = useState("");
  const [setBrandLogoFile] = useState(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState(null);
  const [brandCategory, setBrandCategory] = useState("");
  const [brandAddress, setBrandAddress] = useState("");
  const [brandCity, setBrandCity] = useState("");
  const [brandContact, setBrandContact] = useState("");
  const [brandDesc, setBrandDesc] = useState("");
  const [brandWebsite, setBrandWebsite] = useState("");

  // ---------- Helpers ----------
  const simpleEmail = (s) => /\S+@\S+\.\S+/.test(s);
  const simplePhone = (s) => /^\+?[\d\s-]{7,15}$/.test(s);

  const switchMode = (m) => {
    setMode(m);
    setMsg(null);
  };

  const handleLogoChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBrandLogoFile(f);
    const reader = new FileReader();
    reader.onload = () => setBrandLogoPreview(reader.result);
    reader.readAsDataURL(f);
  };

  // ---------- Customer Submit ----------
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      if (isLogin) {
        // 🔐 CUSTOMER LOGIN (REAL)
        if (!custEmail || !custPassword) {
          setMsg("Email & password required");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: custEmail, password: custPassword }),
        });

        const data = await res.json();

        if (!res.ok) {
          setMsg(data.message || "Login failed");
          setLoading(false);
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/brand");
      } else {
        // 📝 CUSTOMER REGISTER (REAL)
        if (!custName) return setMsg("Name required");
        if (!simpleEmail(custEmail)) return setMsg("Valid email required");
        if (!custPassword || custPassword.length < 6)
          return setMsg("Password min 6 chars");
        if (custPassword !== custConfirm)
          return setMsg("Passwords do not match");

        const res = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: custName, email: custEmail, password: custPassword }),
        });

        const data = await res.json();

        if (!res.ok) {
          setMsg(data.message || "Registration failed");
          setLoading(false);
          return;
        }

        setMsg("Customer registered successfully. Please login.");
        setCustName("");
        setCustEmail("");
        setCustPassword("");
        setCustConfirm("");
        setIsLogin(true);
      }
    } catch (err) {
      setMsg("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Brand Submit ----------
 const handleBrandSubmit = async (e) => {
  e.preventDefault();
  setMsg(null);
  setLoading(true);

  try {
    if (isLogin) {
      // ✅ Brand Login with real API
      if (!brandIdentifier || !brandPassword) {
        setMsg("Email & password required");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: brandIdentifier, // map identifier to email
          password: brandPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // ✅ Store actual backend response
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/brand"); // dashboard
    } else {
      // Brand Registration (demo/localStorage)
      if (!brandName) return setMsg("Brand name required");
      if (!simpleEmail(brandEmail)) return setMsg("Valid email required");
      if (!brandPassword || brandPassword.length < 6)
        return setMsg("Password min 6 chars");
      if (brandPassword !== brandConfirm)
        return setMsg("Passwords do not match");
      if (!brandCategory) return setMsg("Select brand category");
      if (!brandContact || !simplePhone(brandContact))
        return setMsg("Valid contact required");

      // Save brand info in localStorage for demo
      localStorage.setItem(
        "user",
        JSON.stringify({
          brandId: Math.floor(Math.random() * 1000) + 100,
          name: brandName,
          role: "brand",
          email: brandEmail,
          category: brandCategory,
          address: brandAddress,
          city: brandCity,
          contact: brandContact,
          desc: brandDesc,
          website: brandWebsite,
        })
      );

      setMsg("Brand registered. Dashboard available after admin approval.");
      // Reset form fields
      setBrandName("");
      setBrandEmail("");
      setBrandPassword("");
      setBrandConfirm("");
      setBrandCategory("");
      setBrandAddress("");
      setBrandCity("");
      setBrandContact("");
      setBrandDesc("");
      setBrandWebsite("");
      setBrandLogoPreview(null);
      setIsLogin(true);
    }
  } catch (err) {
    setMsg("Server error. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-600 via-slate-400 to-red-500 animate-gradient bg-[length:400%_400%] p-4">
      <div className="relative bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl rounded-3xl p-6 w-full max-w-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />

        {/* Top toggles */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <button
              onClick={() => setIsLogin(true)}
              className={`px-3 py-1 rounded-full font-semibold ${
                isLogin ? "bg-white/25 text-white" : "text-white/80"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-3 py-1 rounded-full font-semibold ${
                !isLogin ? "bg-white/25 text-white" : "text-white/80"
              }`}
            >
              Register
            </button>
          </div>

          <div>
            <button
              onClick={() => switchMode("customer")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                mode === "customer" ? "bg-white/25 text-white" : "text-white/80"
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => switchMode("brand")}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                mode === "brand" ? "bg-white/25 text-white" : "text-white/80"
              }`}
            >
              Brand
            </button>
          </div>
        </div>

        {/* Title & description */}
        <h1 className="text-3xl font-extrabold text-white text-center mb-1 drop-shadow-lg">
          {isLogin
            ? mode === "customer"
              ? "Customer Login!"
              : "Brand Login"
            : mode === "customer"
            ? "Create Your Account"
            : "Register Your Brand"}
        </h1>
        <p className="text-white/80 text-center mb-6 text-sm">
          {isLogin
            ? mode === "customer"
              ? "Sign in to continue"
              : "Brand login to manage products & orders"
            : mode === "customer"
            ? "Join KHAREEDLO and start shopping"
            : "Register your brand to upload inventory and get orders"}
        </p>

        {/* Message */}
        {msg && (
          <div className="text-sm text-center text-white/90 bg-white/10 p-3 rounded-lg mb-3">
            {msg}
          </div>
        )}

        {/* Customer Form */}
        {mode === "customer" && (
          <form onSubmit={handleCustomerSubmit} className="space-y-3">
            {!isLogin && (
              <input
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
              />
            )}
            <input
              value={custEmail}
              onChange={(e) => setCustEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
            />
            <input
              value={custPassword}
              onChange={(e) => setCustPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
            />
            {!isLogin && (
              <input
                value={custConfirm}
                onChange={(e) => setCustConfirm(e.target.value)}
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
              />
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-orange-500 via-orange-300 to-red-500 text-white font-semibold text-lg shadow-lg hover:scale-[1.02] transition"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>
        )}

        {/* Brand Form */}
        {mode === "brand" && (
          <form onSubmit={handleBrandSubmit} className="space-y-3">
            {isLogin ? (
              <>
                <input
                  value={brandIdentifier}
                  onChange={(e) => setBrandIdentifier(e.target.value)}
                  placeholder="Username or Email"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />
                <input
                  value={brandPassword}
                  onChange={(e) => setBrandPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500  to-red-500 text-white font-semibold shadow-lg"
                >
                  {loading ? "Please wait..." : "Brand Login"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // ✅ Demo Brand Login with brandId
                    localStorage.setItem(
                      "user",
                      JSON.stringify({ brandId: 101, name: "Demo Brand", role: "brand" })
                    );
                    navigate("/brand");
                  }}
                  className="w-full py-3 mt-2 rounded-xl bg-green-600 text-white font-semibold shadow-lg hover:scale-105 transition"
                >
                  Demo Brand Login
                </button>
              </>
            ) : (
              <>
                <input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Brand Name"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />
                <input
                  value={brandEmail}
                  onChange={(e) => setBrandEmail(e.target.value)}
                  type="email"
                  placeholder="Brand Email"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />
                <input
                  value={brandPassword}
                  onChange={(e) => setBrandPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />
                <input
                  value={brandConfirm}
                  onChange={(e) => setBrandConfirm(e.target.value)}
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />

                {/* Logo */}
                <div className="flex items-center space-x-3">
                  <label className="text-sm text-white/80 font-medium">Brand Logo</label>
                  <input
                    onChange={handleLogoChange}
                    type="file"
                    accept="image/*"
                    className="text-sm text-white/70"
                  />
                  {brandLogoPreview && (
                    <img
                      src={brandLogoPreview}
                      alt="logo preview"
                      className="h-12 w-12 rounded-md object-cover border"
                    />
                  )}
                </div>

                {/* Other Info */}
                <select
                  value={brandCategory}
                  onChange={(e) => setBrandCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                >
                  <option value="">Select Category</option>
                  <option value="mens">Men's Wear</option>
                  <option value="womens">Women's Wear</option>
                  <option value="kids">Kids</option>
                  <option value="unstitched">Unstitched</option>
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                </select>
                <input
                  value={brandAddress}
                  onChange={(e) => setBrandAddress(e.target.value)}
                  placeholder="Business / Outlet Address"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />
                <input
                  value={brandCity}
                  onChange={(e) => setBrandCity(e.target.value)}
                  placeholder="City"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />
                <input
                  value={brandContact}
                  onChange={(e) => setBrandContact(e.target.value)}
                  placeholder="Contact Number (+92...)"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />
                <textarea
                  value={brandDesc}
                  onChange={(e) => setBrandDesc(e.target.value)}
                  placeholder="Description / About Brand"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                  rows={3}
                />
                <input
                  value={brandWebsite}
                  onChange={(e) => setBrandWebsite(e.target.value)}
                  placeholder="Website or Social Link (optional)"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-white/30 to-red-500 text-white font-semibold shadow-lg"
                >
                  {loading ? "Please wait..." : "Register Brand"}
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
