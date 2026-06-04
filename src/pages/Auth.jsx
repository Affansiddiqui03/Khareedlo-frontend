// src/pages/Auth.jsx — Premium + Fully Responsive
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import KhareedloLogo from "../assets/khareedlo.png";
import {
  Eye, EyeOff, Mail, Lock, User, Store,
  Phone, Globe, ShieldCheck, ArrowLeft, Upload,
  CheckCircle, AlertCircle,
} from "lucide-react";

const API = "https://khareedlo-backend-production.up.railway.app/api";
const validEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());

function Field({ icon: Icon, type = "text", placeholder, value, onChange, error, rightEl }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <Icon size={15} />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-9 ${rightEl ? "pr-9" : "pr-3"} py-2.5 sm:py-3 rounded-xl border text-sm bg-white text-gray-800 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-orange-300 focus:border-orange-400 ${error ? "border-red-400 bg-red-50" : "border-gray-200"}`}
      />
      {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
      {error && <p className="text-xs text-red-500 mt-1 pl-1">{error}</p>}
    </div>
  );
}

function PasswordField({ placeholder, value, onChange, error }) {
  const [show, setShow] = useState(false);
  return (
    <Field
      icon={Lock}
      type={show ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      rightEl={
        <button type="button" onClick={() => setShow(!show)} className="text-gray-400 hover:text-gray-600">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      }
    />
  );
}

function Tab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
        active
          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

function MsgBox({ msg }) {
  if (!msg) return null;
  const isSuccess = msg.toLowerCase().includes("success") || msg.toLowerCase().includes("updated") || msg.toLowerCase().includes("created");
  return (
    <div className={`flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium mb-4 ${
      isSuccess ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"
    }`}>
      {isSuccess ? <CheckCircle size={14} className="mt-0.5 flex-shrink-0" /> : <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />}
      <span>{msg}</span>
    </div>
  );
}

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [tab, setTab]         = useState("customer");
  const [mode, setMode]       = useState("login");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]         = useState(null);

  const [cName, setCName]       = useState("");
  const [cEmail, setCEmail]     = useState("");
  const [cPass, setCPass]       = useState("");
  const [cConfirm, setCConfirm] = useState("");

  const [bName, setBName]           = useState("");
  const [bEmail, setBEmail]         = useState("");
  const [bPass, setBPass]           = useState("");
  const [bConfirm, setBConfirm]     = useState("");
  const [bContact, setBContact]     = useState("");
  const [bWebsite, setBWebsite]     = useState("");
  const [bLogo, setBLogo]           = useState(null);
  const [bLogoPreview, setBLogoPreview] = useState(null);

  const [aEmail, setAEmail] = useState("");
  const [aPass, setAPass]   = useState("");

  const [fpEmail, setFpEmail]     = useState("");
  const [fpNew, setFpNew]         = useState("");
  const [fpConfirm, setFpConfirm] = useState("");

  const [errs, setErrs] = useState({});

  const clearAll = () => {
    setMsg(null); setErrs({});
    setCName(""); setCEmail(""); setCPass(""); setCConfirm("");
    setBName(""); setBEmail(""); setBPass(""); setBConfirm("");
    setBContact(""); setBWebsite(""); setBLogo(null); setBLogoPreview(null);
    setAEmail(""); setAPass("");
    setFpEmail(""); setFpNew(""); setFpConfirm("");
  };

  const switchTab  = (t) => { clearAll(); setTab(t);  setMode("login"); };
  const switchMode = (m) => { clearAll(); setMode(m); };

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setMsg("Only image files allowed"); return; }
    if (file.size > 2 * 1024 * 1024) { setMsg("Logo must be under 2MB"); return; }
    setBLogo(file);
    const r = new FileReader();
    r.onload = () => setBLogoPreview(r.result);
    r.readAsDataURL(file);
  };

  const handleCustomer = async (e) => {
    e.preventDefault(); setMsg(null); setErrs({});
    const e2 = {};
    if (mode === "login") {
      if (!validEmail(cEmail)) e2.cEmail = "Enter a valid email address";
      if (!cPass) e2.cPass = "Password is required";
      if (Object.keys(e2).length) { setErrs(e2); return; }
      setLoading(true);
      try {
        const res = await fetch(`${API}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: cEmail.trim(), password: cPass }) });
        const data = await res.json();
        if (!res.ok) { setMsg(data.message || "Login failed"); return; }
        login({ id: data.user.id, name: data.user.name, email: data.user.email, role: "customer" });
        navigate("/");
      } catch { setMsg("Server error. Try again."); } finally { setLoading(false); }
    } else {
      if (!cName.trim()) e2.cName = "Full name is required";
      if (!validEmail(cEmail)) e2.cEmail = "Enter a valid email (e.g. name@example.com)";
      if (!cPass || cPass.length < 6) e2.cPass = "Password must be at least 6 characters";
      if (cPass !== cConfirm) e2.cConfirm = "Passwords do not match";
      if (Object.keys(e2).length) { setErrs(e2); return; }
      setLoading(true);
      try {
        const res = await fetch(`${API}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: cName.trim(), email: cEmail.trim(), password: cPass }) });
        const data = await res.json();
        if (!res.ok) { setMsg(data.message || "Registration failed"); return; }
        setMsg("Account created! Please login.");
        switchMode("login");
      } catch { setMsg("Server error. Try again."); } finally { setLoading(false); }
    }
  };

  const handleBrand = async (e) => {
    e.preventDefault(); setMsg(null); setErrs({});
    const e2 = {};
    if (mode === "login") {
      if (!validEmail(bEmail)) e2.bEmail = "Enter a valid email address";
      if (!bPass) e2.bPass = "Password is required";
      if (Object.keys(e2).length) { setErrs(e2); return; }
      setLoading(true);
      try {
        const res = await fetch(`${API}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: bEmail.trim(), password: bPass }) });
        const data = await res.json();
        if (!res.ok) { setMsg(data.message || "Login failed"); return; }
        if (data.user.role !== "brand") { setMsg("Not a brand account"); return; }
        login(data.user); navigate("/brand");
      } catch { setMsg("Server error. Try again."); } finally { setLoading(false); }
    } else {
      if (!bName.trim()) e2.bName = "Brand name is required";
      if (!validEmail(bEmail)) e2.bEmail = "Enter a valid email (e.g. brand@example.com)";
      if (!bPass || bPass.length < 6) e2.bPass = "Password must be at least 6 characters";
      if (bPass !== bConfirm) e2.bConfirm = "Passwords do not match";
      if (Object.keys(e2).length) { setErrs(e2); return; }
      setLoading(true);
      try {
        const fd = new FormData();
        fd.append("brandName", bName.trim()); fd.append("email", bEmail.trim());
        fd.append("password", bPass); fd.append("contact", bContact); fd.append("website", bWebsite);
        if (bLogo) fd.append("logo", bLogo);
        const res = await fetch(`${API}/brand/register`, { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) { setMsg(data.message || "Registration failed"); return; }
        setMsg("Brand registered! Waiting for admin approval."); switchMode("login");
      } catch { setMsg("Server error. Try again."); } finally { setLoading(false); }
    }
  };

  const handleAdmin = async (e) => {
    e.preventDefault(); setMsg(null); setErrs({});
    const e2 = {};
    if (!validEmail(aEmail)) e2.aEmail = "Enter a valid email address";
    if (!aPass) e2.aPass = "Password is required";
    if (Object.keys(e2).length) { setErrs(e2); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: aEmail.trim(), password: aPass }) });
      const data = await res.json();
      if (!res.ok) { setMsg(data.message || "Login failed"); return; }
      if (data.user.role !== "admin") { setMsg("Not an admin account"); return; }
      login(data.user); navigate("/admin");
    } catch { setMsg("Server error. Try again."); } finally { setLoading(false); }
  };

  const handleForgot = async (e) => {
    e.preventDefault(); setMsg(null); setErrs({});
    const e2 = {};
    if (!validEmail(fpEmail)) e2.fpEmail = "Enter a valid email address";
    if (!fpNew || fpNew.length < 6) e2.fpNew = "Password must be at least 6 characters";
    if (fpNew !== fpConfirm) e2.fpConfirm = "Passwords do not match";
    if (Object.keys(e2).length) { setErrs(e2); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: fpEmail.trim(), newPassword: fpNew, userType: tab === "admin" ? "customer" : tab }) });
      const data = await res.json();
      if (!res.ok) { setMsg(data.message || "Reset failed"); return; }
      setMsg("Password updated! Please login.");
      setTimeout(() => switchMode("login"), 1500);
    } catch { setMsg("Server error. Try again."); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f7f7ff] to-[#ffb48f] px-4 py-8 sm:py-12">

      {/* Logo */}
      <Link to="/" className="mb-5 sm:mb-6">
      </Link>

      {/* Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden w-full max-w-[95vw] sm:max-w-md">

        {/* Tabs */}
        <div className="flex gap-1 p-1.5 sm:p-2 bg-gray-50 border-b border-gray-100">
          <Tab active={tab === "customer"} onClick={() => switchTab("customer")}>
            <span className="flex items-center justify-center gap-1"><User size={12} className="hidden xs:block sm:block" /> Customer</span>
          </Tab>
          <Tab active={tab === "brand"} onClick={() => switchTab("brand")}>
            <span className="flex items-center justify-center gap-1"><Store size={12} className="hidden xs:block sm:block" /> Brand</span>
          </Tab>
          <Tab active={tab === "admin"} onClick={() => switchTab("admin")}>
            <span className="flex items-center justify-center gap-1"><ShieldCheck size={12} className="hidden xs:block sm:block" /> Admin</span>
          </Tab>
        </div>

        <div className="p-4 sm:p-6">

          {/* Login / Register toggle */}
          {tab !== "admin" && mode !== "forgot" && (
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4 sm:mb-5">
              <button type="button" onClick={() => switchMode("login")}
                className={`flex-1 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${mode === "login" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500"}`}>
                Login
              </button>
              <button type="button" onClick={() => switchMode("register")}
                className={`flex-1 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${mode === "register" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500"}`}>
                Register
              </button>
            </div>
          )}

          {/* Back for forgot */}
          {mode === "forgot" && (
            <button type="button" onClick={() => switchMode("login")}
              className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-gray-700 mb-4 transition">
              <ArrowLeft size={13} /> Back to Login
            </button>
          )}

          {/* Heading */}
          <div className="mb-4 sm:mb-5">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">
              {mode === "forgot" ? "Reset Password"
                : mode === "login"
                ? tab === "customer" ? "Welcome back!" : tab === "brand" ? "Brand Login" : "Admin Login"
                : tab === "customer" ? "Create Account" : "Register Your Brand"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              {mode === "forgot" ? `Enter your ${tab} email to reset password`
                : mode === "login" ? "Sign in to continue to Khareedlo"
                : tab === "customer" ? "Join Khareedlo and start exploring"
                : "Register and reach thousands of shoppers"}
            </p>
          </div>

          <MsgBox msg={msg} />

          {/* ── FORGOT ── */}
          {mode === "forgot" && (
            <form onSubmit={handleForgot} className="space-y-3">
              <Field icon={Mail} type="email" placeholder="Your registered email"
                value={fpEmail} onChange={e => setFpEmail(e.target.value)} error={errs.fpEmail} />
              <PasswordField placeholder="New password (min 6 chars)"
                value={fpNew} onChange={e => setFpNew(e.target.value)} error={errs.fpNew} />
              <PasswordField placeholder="Confirm new password"
                value={fpConfirm} onChange={e => setFpConfirm(e.target.value)} error={errs.fpConfirm} />
              <button type="submit" disabled={loading}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-lg hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60">
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          )}

          {/* ── CUSTOMER ── */}
          {tab === "customer" && mode !== "forgot" && (
            <form onSubmit={handleCustomer} className="space-y-2.5 sm:space-y-3">
              {mode === "register" && (
                <Field icon={User} placeholder="Full Name"
                  value={cName} onChange={e => setCName(e.target.value)} error={errs.cName} />
              )}
              <Field icon={Mail} type="email" placeholder="Email address"
                value={cEmail} onChange={e => setCEmail(e.target.value)} error={errs.cEmail} />
              <PasswordField placeholder="Password"
                value={cPass} onChange={e => setCPass(e.target.value)} error={errs.cPass} />
              {mode === "register" && (
                <PasswordField placeholder="Confirm password"
                  value={cConfirm} onChange={e => setCConfirm(e.target.value)} error={errs.cConfirm} />
              )}
              {mode === "login" && (
                <div className="text-right">
                  <button type="button" onClick={() => switchMode("forgot")}
                    className="text-xs text-orange-500 hover:text-orange-600 font-medium transition">
                    Forgot password?
                  </button>
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-lg hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60">
                {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>
          )}

          {/* ── BRAND ── */}
          {tab === "brand" && mode !== "forgot" && (
            <form onSubmit={handleBrand} className="space-y-2.5 sm:space-y-3">
              {mode === "login" ? (
                <>
                  <Field icon={Mail} type="email" placeholder="Brand email"
                    value={bEmail} onChange={e => setBEmail(e.target.value)} error={errs.bEmail} />
                  <PasswordField placeholder="Password"
                    value={bPass} onChange={e => setBPass(e.target.value)} error={errs.bPass} />
                  <div className="text-right">
                    <button type="button" onClick={() => switchMode("forgot")}
                      className="text-xs text-orange-500 hover:text-orange-600 font-medium transition">
                      Forgot password?
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Field icon={Store} placeholder="Brand Name"
                    value={bName} onChange={e => setBName(e.target.value)} error={errs.bName} />
                  <Field icon={Mail} type="email" placeholder="Brand Email"
                    value={bEmail} onChange={e => setBEmail(e.target.value)} error={errs.bEmail} />
                  <PasswordField placeholder="Password (min 6 chars)"
                    value={bPass} onChange={e => setBPass(e.target.value)} error={errs.bPass} />
                  <PasswordField placeholder="Confirm Password"
                    value={bConfirm} onChange={e => setBConfirm(e.target.value)} error={errs.bConfirm} />
                  {/* Contact + Website side by side on larger screens */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <Field icon={Phone} placeholder="Contact (+92...)"
                      value={bContact} onChange={e => setBContact(e.target.value)} />
                    <Field icon={Globe} placeholder="Website (optional)"
                      value={bWebsite} onChange={e => setBWebsite(e.target.value)} />
                  </div>
                  {/* Logo Upload */}
                  <div className="border border-dashed border-gray-200 rounded-xl p-2.5 sm:p-3 flex items-center gap-3 bg-gray-50">
                    <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-gray-500 hover:text-orange-500 transition flex-1 min-w-0">
                      <Upload size={14} className="flex-shrink-0" />
                      <span className="truncate">{bLogo ? bLogo.name : "Upload Brand Logo"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                    </label>
                    {bLogoPreview && (
                      <img src={bLogoPreview} alt="preview" className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg object-cover flex-shrink-0 border" />
                    )}
                  </div>
                </>
              )}
              <button type="submit" disabled={loading}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-lg hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60">
                {loading ? "Please wait..." : mode === "login" ? "Brand Login" : "Register Brand"}
              </button>
            </form>
          )}

          {/* ── ADMIN ── */}
          {tab === "admin" && mode !== "forgot" && (
            <form onSubmit={handleAdmin} className="space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                <ShieldCheck size={13} className="text-amber-500 flex-shrink-0" />
                <p className="text-xs text-amber-700 font-medium">Restricted access — Admin only</p>
              </div>
              <Field icon={Mail} type="email" placeholder="Admin email"
                value={aEmail} onChange={e => setAEmail(e.target.value)} error={errs.aEmail} />
              <PasswordField placeholder="Admin password"
                value={aPass} onChange={e => setAPass(e.target.value)} error={errs.aPass} />
              <button type="submit" disabled={loading}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold text-sm shadow-lg hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60">
                {loading ? "Verifying..." : "Admin Login"}
              </button>
            </form>
          )}

          {/* Bottom links */}
          {tab !== "admin" && mode === "login" && (
            <p className="text-center text-xs text-gray-400 mt-4">
              Don't have an account?{" "}
              <button type="button" onClick={() => switchMode("register")}
                className="text-orange-500 font-semibold hover:underline">Sign up free</button>
            </p>
          )}
          {tab !== "admin" && mode === "register" && (
            <p className="text-center text-xs text-gray-400 mt-4">
              Already have an account?{" "}
              <button type="button" onClick={() => switchMode("login")}
                className="text-orange-500 font-semibold hover:underline">Sign in</button>
            </p>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-white/60 mt-5">
        © {new Date().getFullYear()} Khareedlo — Pakistan's Fashion Platform
      </p>
    </div>
  );
}