import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Mail, Phone, Globe, MapPin, FileText,
  Save, CheckCircle, XCircle, Building2,
  Lock, Eye, EyeOff, Upload, Image
} from "lucide-react";

const API = "https://khareedlo-backend-production.up.railway.app";

export default function Profile() {
  const { theme, brandName } = useOutletContext();
  const { user } = useAuth();
  const brandId = user?.id;

  const [form, setForm]       = useState({ name: "", email: "", contact: "", website: "", city: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState(null);

  // Banner
  const [banner, setBanner]         = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerRef = useRef();

  // Logo
  const [logo, setLogo]             = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoRef = useRef();

  // Password
  const [pwForm, setPwForm]   = useState({ current: "", new: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [showPw, setShowPw]   = useState({ current: false, new: false, confirm: false });
  const [pwErr, setPwErr]     = useState("");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!brandId) return;
    fetch(`${API}/api/brand-profile/${brandId}`)
      .then(r => r.json())
      .then(data => {
        setForm({ name: data.name || "", email: data.email || "", contact: data.contact || "", website: data.website || "", city: data.city || "", description: data.description || "" });
        if (data.banner) setBannerPreview(data.banner.startsWith("http") ? data.banner : `${API}/${data.banner}`);
        if (data.logo) setLogoPreview(data.logo.startsWith("http") ? data.logo : `${API}/${data.logo}`);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [brandId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/brand-profile/${brandId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      showToast("Profile updated successfully!");
    } catch { showToast("Failed to save. Try again.", "error"); }
    finally { setSaving(false); }
  };

  const handleBannerUpload = async () => {
    if (!banner) return;
    setUploadingBanner(true);
    try {
      const fd = new FormData();
      fd.append("banner", banner);
      const res = await fetch(`${API}/api/brand-profile/${brandId}/banner`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBannerPreview(data.banner);
      setBanner(null);
      showToast("Banner updated!");
    } catch (e) { showToast(e.message || "Upload failed", "error"); }
    finally { setUploadingBanner(false); }
  };

  const handleLogoUpload = async () => {
    if (!logo) return;
    setUploadingLogo(true);
    try {
      const fd = new FormData();
      fd.append("logo", logo);
      const res = await fetch(`${API}/api/brand-profile/${brandId}/logo`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLogoPreview(data.logo);
      setLogo(null);
      showToast("Logo updated!");
    } catch (e) { showToast(e.message || "Upload failed", "error"); }
    finally { setUploadingLogo(false); }
  };

  const handlePasswordChange = async () => {
    setPwErr("");
    if (!pwForm.current) { setPwErr("Enter current password"); return; }
    if (pwForm.new.length < 6) { setPwErr("New password must be at least 6 characters"); return; }
    if (pwForm.new !== pwForm.confirm) { setPwErr("Passwords do not match"); return; }
    setPwSaving(true);
    try {
      const res = await fetch(`${API}/api/brand-profile/${brandId}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.new }),
      });
      const data = await res.json();
      if (!res.ok) { setPwErr(data.error || "Failed"); return; }
      showToast("Password changed successfully!");
      setPwForm({ current: "", new: "", confirm: "" });
    } catch { setPwErr("Server error. Try again."); }
    finally { setPwSaving(false); }
  };

  const fields = [
    { key: "name",    label: "Brand Name",    icon: Building2, type: "text",  disabled: true,  placeholder: "Brand name" },
    { key: "email",   label: "Email Address", icon: Mail,      type: "email", disabled: true,  placeholder: "Email" },
    { key: "contact", label: "Contact / Phone",icon: Phone,    type: "text",  disabled: false, placeholder: "+92 300 1234567" },
    { key: "website", label: "Website URL",   icon: Globe,     type: "url",   disabled: false, placeholder: "https://www.yourbrand.com" },
    { key: "city",    label: "City",          icon: MapPin,    type: "text",  disabled: false, placeholder: "e.g. Lahore" },
  ];

  const accentStyle = { background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})` };

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 ${
          toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
        }`}>
          {toast.type === "error" ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Brand Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage how your brand appears on Khareedlo</p>
      </div>

      {/* ── Banner Upload ────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Image className="w-4 h-4" /> Brand Banner
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">This appears at the top of your brand page</p>
        </div>
        {/* Banner Preview */}
        <div className="relative h-32 sm:h-44 bg-gray-100 overflow-hidden">
          {(bannerPreview) ? (
            <img src={bannerPreview} alt="banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Image className="w-12 h-12" />
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-orange-500 transition border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 hover:bg-orange-50">
            <Upload className="w-4 h-4" />
            <span className="truncate max-w-[160px]">{banner ? banner.name : "Choose Banner Image"}</span>
            <input type="file" accept="image/*" className="hidden" ref={bannerRef}
              onChange={e => {
                const f = e.target.files?.[0];
                if (!f) return;
                setBanner(f);
                const r = new FileReader();
                r.onload = () => setBannerPreview(r.result);
                r.readAsDataURL(f);
              }} />
          </label>
          {banner && (
            <button onClick={handleBannerUpload} disabled={uploadingBanner}
              className="px-4 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60 flex items-center gap-2"
              style={accentStyle}>
              {uploadingBanner ? "Uploading..." : <><Upload className="w-4 h-4" /> Upload Banner</>}
            </button>
          )}
          <p className="text-xs text-gray-400 ml-auto">Max 5MB · JPG/PNG/WEBP</p>
        </div>
      </div>

      {/* ── Logo + Profile Info Card ─────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Logo */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md flex items-center justify-center"
            style={accentStyle}>
            {logoPreview ? (
              <img src={logoPreview} alt="logo" className="w-full h-full object-contain" />
            ) : (
              <span className="text-3xl font-black text-white">{(brandName || "B")[0]}</span>
            )}
          </div>
          <label className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer border border-gray-100 hover:bg-orange-50 transition">
            <Upload className="w-3 h-3 text-gray-500" />
            <input type="file" accept="image/*" className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (!f) return;
                setLogo(f);
                const r = new FileReader();
                r.onload = () => setLogoPreview(r.result);
                r.readAsDataURL(f);
              }} />
          </label>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-lg">{brandName}</p>
          <p className="text-sm text-gray-500 mt-0.5">Verified Brand on Khareedlo</p>
          {logo && (
            <button onClick={handleLogoUpload} disabled={uploadingLogo}
              className="mt-2 px-3 py-1.5 rounded-xl text-white text-xs font-semibold disabled:opacity-60 flex items-center gap-1.5"
              style={accentStyle}>
              {uploadingLogo ? "Uploading..." : <><Upload className="w-3 h-3" /> Save Logo</>}
            </button>
          )}
        </div>
      </div>

      {/* ── Profile Form ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
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
                  <input type={type} value={form[key]} disabled={disabled} placeholder={placeholder}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 ${
                      disabled ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed" : "border-gray-200 text-gray-800"
                    }`} />
                </div>
                {disabled && <p className="text-xs text-gray-400 mt-1">This field cannot be changed</p>}
              </div>
            ))}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Brand Description</label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <textarea rows={4} value={form.description} placeholder="Tell customers what makes your brand unique..."
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 resize-none" />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              style={accentStyle}>
              {saving ? "Saving..." : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </div>
        )}
      </div>

      {/* ── Change Password ──────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6">
        <h3 className="font-bold text-gray-900 mb-1 text-sm uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4" /> Change Password
        </h3>
        <p className="text-xs text-gray-400 mb-5">Update your brand account password</p>

        <div className="space-y-3">
          {[
            { key: "current", label: "Current Password", placeholder: "Enter current password" },
            { key: "new",     label: "New Password",     placeholder: "Min 6 characters" },
            { key: "confirm", label: "Confirm Password", placeholder: "Repeat new password" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPw[key] ? "text" : "password"}
                  placeholder={placeholder}
                  value={pwForm[key]}
                  onChange={e => setPwForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2"
                />
                <button type="button" onClick={() => setShowPw(p => ({ ...p, [key]: !p[key] }))}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}

          {pwErr && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> {pwErr}
            </p>
          )}

          <button onClick={handlePasswordChange} disabled={pwSaving}
            className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            style={accentStyle}>
            {pwSaving ? "Updating..." : <><Lock className="w-4 h-4" /> Change Password</>}
          </button>
        </div>
      </div>
    </div>
  );
}
