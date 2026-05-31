// src/pages/user/Settings.jsx  — FIXED (no useState inside map)

import React, { useState } from "react";
import UserLayout from "../../components/UserLayout";
import { useAuth } from "../../contexts/AuthContext";
import { Lock, Eye, EyeOff, CheckCircle, XCircle, Shield, Bell, Trash2, AlertTriangle } from "lucide-react";

// Notifications state lives OUTSIDE map — fixed
const DEFAULT_NOTIFS = [
  { key: "newBrands",     label: "New brand arrivals",     sub: "When new brands join Khareedlo",   on: true  },
  { key: "productUpdates",label: "Product updates",         sub: "When saved products go on sale",   on: true  },
  { key: "announcements", label: "Platform announcements",  sub: "News and updates from Khareedlo",  on: false },
];

export default function Settings() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("security");

  // Password
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ cur: false, new: false, conf: false });
  const [saving, setSaving] = useState(false);

  // Notifications — proper state, NOT inside map
  const [notifs, setNotifs] = useState(DEFAULT_NOTIFS);

  const [toast, setToast] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const toggleNotif = (key) => {
    setNotifs(prev => prev.map(n => n.key === key ? { ...n, on: !n.on } : n));
  };

  const handlePasswordChange = async () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword)
      return showToast("Please fill all fields", "error");
    if (form.newPassword !== form.confirmPassword)
      return showToast("New passwords do not match", "error");
    if (form.newPassword.length < 6)
      return showToast("Password must be at least 6 characters", "error");

    setSaving(true);
    try {
      const res = await fetch("https://khareedlo-backend-production.up.railway.app/api/user/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: user?.id,
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showToast("Password changed successfully!");
    } catch (err) {
      showToast(err.message || "Failed to change password", "error");
    } finally {
      setSaving(false);
    }
  };

  const passwordStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 4) score++;
    if (pw.length >= 6) score++;
    if (pw.length >= 8) score++;
    if (/[^a-zA-Z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(form.newPassword);
  const strengthColors = ["bg-gray-100", "bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-emerald-400"];
  const strengthLabels = ["", "Too weak", "Weak", "Medium", "Strong"];

  const TABS = [
    { key: "security",      label: "Security"      },
    { key: "notifications", label: "Notifications" },
    { key: "account",       label: "Account"       },
  ];

  return (
    <UserLayout>
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 max-w-sm ${
          toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
        }`}>
          {toast.type === "error" ? <XCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account security and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Security Tab ── */}
        {tab === "security" && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Change Password</h3>
                <p className="text-xs text-gray-400 mt-0.5">Keep your account secure with a strong password</p>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: "currentPassword", label: "Current Password",     showKey: "cur"  },
                { key: "newPassword",     label: "New Password",         showKey: "new"  },
                { key: "confirmPassword", label: "Confirm New Password", showKey: "conf" },
              ].map(({ key, label, showKey }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">{label}</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={show[showKey] ? "text" : "password"}
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                    />
                    <button type="button"
                      onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {show[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}

              {/* Strength bar */}
              {form.newPassword && (
                <div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : "bg-gray-100"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{strengthLabels[strength]}</p>
                </div>
              )}

              <button onClick={handlePasswordChange} disabled={saving}
                className="w-full py-3 rounded-xl text-white text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                style={{ background: "linear-gradient(135deg, #E53E3E, #F97316)" }}>
                {saving
                  ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving...</>
                  : <><Shield className="w-4 h-4" />Update Password</>
                }
              </button>
            </div>
          </div>
        )}

        {/* ── Notifications Tab ── */}
        {tab === "notifications" && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Notification Preferences</h3>
                <p className="text-xs text-gray-400 mt-0.5">Choose what updates you want to receive</p>
              </div>
            </div>
            <div className="p-6 space-y-1">
              {notifs.map(({ key, label, sub, on }) => (
                <div key={key} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
                  </div>
                  <button onClick={() => toggleNotif(key)}
                    className={`w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ml-4 ${on ? "bg-red-500" : "bg-gray-200"}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${on ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
              <p className="text-xs text-gray-400 pt-3">Note: Email notifications will be enabled in a future update.</p>
            </div>
          </div>
        )}

        {/* ── Account Tab ── */}
        {tab === "account" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-gray-900 mb-1">Account Information</h3>
              <p className="text-xs text-gray-400 mb-4">Your current account details</p>
              <div className="space-y-3">
                {[
                  { label: "Name",         value: user?.name  },
                  { label: "Email",        value: user?.email },
                  { label: "Account Type", value: "Customer ✓", green: true },
                ].map(({ label, value, green }) => (
                  <div key={label} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className={`text-sm font-semibold ${green ? "text-emerald-600" : "text-gray-800"}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-red-100 p-6">
              <h3 className="font-bold text-red-600 mb-1">Danger Zone</h3>
              <p className="text-xs text-gray-400 mb-4">Irreversible actions — proceed with caution</p>
              <button onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" /> Delete My Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirm Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-7 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Delete Account?</h3>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              This will permanently delete your account and all your data. This cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => { logout(); window.location.href = "/"; }}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}