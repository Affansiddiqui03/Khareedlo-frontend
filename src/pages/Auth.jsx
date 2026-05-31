// src/pages/Auth.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


export default function Auth() {
  const navigate = useNavigate();

  // ---------- General State ----------
  const { login } = useAuth();

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

  const [brandName, setBrandName] = useState("");
  const [brandEmail, setBrandEmail] = useState("");
  const [brandConfirm, setBrandConfirm] = useState("");
  const [brandLogoFile, setBrandLogoFile] = useState(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState(null);
  const [brandContact, setBrandContact] = useState("");
  const [brandWebsite, setBrandWebsite] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ---------- Helpers ----------
  const simpleEmail = (s) => /\S+@\S+\.\S+/.test(s);
  // const simplePhone = (s) => /^\+?[\d\s-]{7,15}$/.test(s);

  const switchMode = (m) => {
    setMode(m);
    setMsg(null);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ file type validation
    if (!file.type.startsWith("image/")) {
      setMsg("Only image files are allowed");
      return;
    }

    // ✅ size validation (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setMsg("Logo size must be under 2MB");
      return;
    }

    setBrandLogoFile(file);

    const reader = new FileReader();
    reader.onload = () => setBrandLogoPreview(reader.result);
    reader.readAsDataURL(file);
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

        const res = await fetch("https://khareedlo-backend-production.up.railway.app/api/auth/login", {
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

        login({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: "customer",
        });

        navigate("/");
      } else {
        // 📝 CUSTOMER REGISTER (REAL)
        if (!custName) return setMsg("Name required");
        if (!simpleEmail(custEmail)) return setMsg("Valid email required");
        if (!custPassword || custPassword.length < 6)
          return setMsg("Password min 6 chars");
        if (custPassword !== custConfirm)
          return setMsg("Passwords do not match");

        const res = await fetch("https://khareedlo-backend-production.up.railway.app/api/auth/register", {
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

  const handleBrandLogin = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch("https://khareedlo-backend-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Login failed");
        return;
      }

      if (data.user.role !== "brand") {
        setMsg("Not a brand account");
        return;
      }

      login(data.user);
      navigate("/brand");

    } catch (err) {
      setMsg("Server error");
    } finally {
      setLoading(false);
    }
  };


  // ---------- Brand Submit ----------
  // ---------- Brand Submit ----------
  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      if (password !== brandConfirm) {
        setMsg("Passwords do not match");
        return;
      }

      const formData = new FormData();
      formData.append("brandName", brandName);
      formData.append("email", brandEmail);
      formData.append("password", password);
      formData.append("contact", brandContact);
      formData.append("website", brandWebsite);
      formData.append("logo", brandLogoFile); // ✅ LOGO

      const res = await fetch("https://khareedlo-backend-production.up.railway.app/api/brand/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Registration failed");
        return;
      }

      setMsg("Brand registered successfully. Waiting for admin approval.");
      setIsLogin(true);
      setMode("brand");

    } catch (err) {
      setMsg("Server error");
    } finally {
      setLoading(false);
    }
  };




  const handleAdminLogin = async () => {
    setMsg(null);
    setLoading(true);

    try {
      const res = await fetch("https://khareedlo-backend-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Login failed");
        return;
      }

      if (data.user.role !== "admin") {
        setMsg("Not an admin account");
        return;
      }

      login(data.user);
      navigate("/admin");
    } catch (err) {
      setMsg("Server error");
    } finally {
      setLoading(false);
    }
  };





  return (
    <div className="min-h-screen flex justify-center items-start sm:items-center bg-gradient-to-br from-orange-600 via-slate-400 to-red-500 py-8 px-4">
      <div className="relative bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl rounded-3xl p-5 sm:p-6 w-full max-w-md overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        {/* Row 1: Login / Register tabs */}
        <div className="flex gap-2 bg-white/10 p-1 rounded-2xl mb-2">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${isLogin ? "bg-white/30 text-white shadow" : "text-white/60 hover:text-white"}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${!isLogin ? "bg-white/30 text-white shadow" : "text-white/60 hover:text-white"}`}
          >
            Register
          </button>
        </div>

        {/* Row 2: Customer / Brand tabs */}
        <div className="flex gap-2 bg-white/10 p-1 rounded-2xl mb-5">
          <button
            onClick={() => switchMode("customer")}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${mode === "customer" ? "bg-white/30 text-white shadow" : "text-white/60 hover:text-white"}`}
          >
            Customer
          </button>
          <button
            onClick={() => switchMode("brand")}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${mode === "brand" ? "bg-white/30 text-white shadow" : "text-white/60 hover:text-white"}`}
          >
            Brand
          </button>
        </div>

        {/* Title & description */ }
        <h1 className="text-3xl font-extrabold text-white text-center mb-1 drop-shadow-lg">
          { isLogin
            ? mode === "customer"
              ? "Customer Login!"
              : "Brand Login"
            : mode === "customer"
              ? "Create Your Account"
              : "Register Your Brand" }
        </h1>
        <p className="text-white/80 text-center mb-6 text-sm">
          { isLogin
            ? mode === "customer"
              ? "Sign in to continue"
              : "Brand login to manage products & orders"
            : mode === "customer"
              ? "Join KHAREEDLO and start shopping"
              : "Register your brand to upload inventory and get orders" }
        </p>

        {/* Message */ }
        { msg && (
          <div className="text-sm text-center text-white/90 bg-white/10 p-3 rounded-lg mb-3">
            { msg }
          </div>
        ) }

        {/* Customer Form */ }
        { mode === "customer" && (
          <form onSubmit={ handleCustomerSubmit } className="space-y-3">
            { !isLogin && (
              <input
                value={ custName }
                onChange={ (e) => setCustName(e.target.value) }
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
              />
            ) }
            <input
              value={ custEmail }
              onChange={ (e) => setCustEmail(e.target.value) }
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
            />
            <input
              value={ custPassword }
              onChange={ (e) => setCustPassword(e.target.value) }
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
            />
            { !isLogin && (
              <input
                value={ custConfirm }
                onChange={ (e) => setCustConfirm(e.target.value) }
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
              />
            ) }
            <button
              type="submit"
              disabled={ loading }
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-orange-500 via-orange-300 to-red-500 text-white font-semibold text-lg shadow-lg hover:scale-[1.02] transition"
            >
              { loading ? "Please wait..." : isLogin ? "Sign In" : "Sign Up" }
            </button>
          </form>
        ) }

        {/* Brand Form */ }
        { mode === "brand" && (
          <form
            onSubmit={ isLogin ? handleBrandLogin : handleBrandSubmit }
            className="space-y-3"
          >
            { isLogin ? (
              <>
                <input
                  value={ email }
                  onChange={ (e) => setEmail(e.target.value) }
                  placeholder="Username or Email"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />
                <input
                  value={ password }
                  onChange={ (e) => setPassword(e.target.value) }
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />
                <button
                  type="submit"
                  disabled={ loading }
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500  to-red-500 text-white font-semibold shadow-lg"
                >
                  { loading ? "Please wait..." : "Brand Login" }
                </button>
              </>
            ) : (
              <>
                <input
                  value={ brandName }
                  onChange={ (e) => setBrandName(e.target.value) }
                  placeholder="Brand Name"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />
                <input
                  value={ brandEmail }
                  onChange={ (e) => setBrandEmail(e.target.value) }
                  type="email"
                  placeholder="Brand Email"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />
                <input
                  value={ password }
                  onChange={ (e) => setPassword(e.target.value) }
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />
                <input
                  value={ brandConfirm }
                  onChange={ (e) => setBrandConfirm(e.target.value) }
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />

                {/* Logo */}
                <div className="space-y-1.5">
                  <label className="text-sm text-white/80 font-medium block">Brand Logo</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      onChange={handleLogoChange}
                      type="file"
                      accept="image/*"
                      className="text-sm text-white/70 flex-1 min-w-0"
                    />
                    {brandLogoPreview && (
                      <img src={brandLogoPreview} alt="logo preview"
                        className="h-10 w-10 rounded-lg object-cover border border-white/30 flex-shrink-0" />
                    )}
                  </div>
                </div>

                {/* Other Info */ }
                <input
                  value={ brandContact }
                  onChange={ (e) => setBrandContact(e.target.value) }
                  placeholder="Contact Number (+92...)"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />
                <input
                  value={ brandWebsite }
                  onChange={ (e) => setBrandWebsite(e.target.value) }
                  placeholder="Website or Social Link (optional)"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-white/70 placeholder:font-semibold"
                />

                <button
                  type="submit"
                  disabled={ loading }
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 via-white/30 to-red-500 text-white font-semibold shadow-lg"
                >
                  { loading ? "Please wait..." : "Register Brand" }
                </button>
              </>
            ) }
          </form>
        )}

        {/* Admin login — always at bottom, never overlaps form */}
        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <button
            onClick={handleAdminLogin}
            className="text-xs text-white/30 hover:text-white/60 transition-colors font-medium"
          >
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
}
