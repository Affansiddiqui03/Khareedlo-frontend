// src/pages/brand/Profile.jsx  — REPLACE existing

import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Mail, Phone, Globe, MapPin, FileText,
  Save, CheckCircle, XCircle, Building2
} from "lucide-react";

export default function Profile() {
  const { theme, brandName } = useOutletContext();
  const { user } = useAuth();
  const brandId = user?.id;

  const [form, setForm]       = useState({ name: "", email: "", contact: "", website: "", city: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!brandId) return;
    fetch(`https://khareedlo-backend-production.up.railway.app/api/brand-profile/${brandId}`)
      .then(r => r.json())
      .then(data => { setForm({ name: data.name || "", email: data.email || "", contact: data.contact || "", website: data.website || "", city: data.city || "", description: data.description || "" }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [brandId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`https://khareedlo-backend-production.up.railway.app/api/brand-profile/${brandId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      showToast("Profile updated successfully!");
    } catch {
      showToast("Failed to save. Try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: "name",        label: "Brand Name",    icon: Building2, type: "text",     disabled: true,  placeholder: "Brand name" },
    { key: "email",       label: "Email Address", icon: Mail,      type: "email",    disabled: true,  placeholder: "Email" },
    { key: "contact",     label: "Contact / Phone",icon: Phone,    type: "text",     disabled: false, placeholder: "+92 300 1234567" },
    { key: "website",     label: "Website URL",   icon: Globe,     type: "url",      disabled: false, placeholder: "https://www.yourbrand.com" },
    { key: "city",        label: "City",          icon: MapPin,    type: "text",     disabled: false, placeholder: "e.g. Lahore" },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 ${
          toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
        }`}>
          {toast.type === "error" ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Brand Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage how your brand appears on Khareedlo</p>
      </div>

      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})` }}
        >
          {(brandName || "B")[0]}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-lg">{brandName}</p>
          <p className="text-sm text-gray-500 mt-0.5">Verified Brand on Khareedlo</p>
          <p className="text-xs mt-2 px-3 py-1 rounded-full font-semibold inline-block"
            style={{ background: `${theme.accent}15`, color: theme.accent }}>
            ✓ Active Account
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider">Profile Information</h3>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map(({ key, label, icon: Icon, type, disabled, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">{label}</label>
                <div className="relative">
                  <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={type}
                    value={form[key]}
                    disabled={disabled}
                    placeholder={placeholder}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
                      disabled
                        ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
                        : "border-gray-200 text-gray-800 focus:border-transparent"
                    }`}
                    style={!disabled ? { "--tw-ring-color": theme.accent + "44" } : {}}
                  />
                </div>
                {disabled && <p className="text-xs text-gray-400 mt-1">This field cannot be changed</p>}
              </div>
            ))}

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Brand Description</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <textarea
                  rows={4}
                  value={form.description}
                  placeholder="Tell customers what makes your brand unique..."
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 resize-none"
                  style={{ "--tw-ring-color": theme.accent + "44" }}
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})` }}
            >
              {saving ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Saving...</>
              ) : (
                <><Save className="w-4 h-4" /> Save Changes</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}