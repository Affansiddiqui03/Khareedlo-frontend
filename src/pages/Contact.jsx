// src/pages/Contact.jsx
// FIXED: Removed "Quick Help" section from sidebar
// All other logic unchanged

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Footer from "../components/Footer";
import {
  Mail, Phone, Clock, MapPin,
  CheckCircle2, AlertCircle,
  Building2, Bug, Store, Shield,
  HelpCircle, Info, User, LogIn,
} from "lucide-react";

const TOPICS = [
  { value: "general",  label: "General Support",   icon: HelpCircle },
  { value: "brand",    label: "Brand Partnership",  icon: Building2  },
  { value: "pos",      label: "POS / Integration",  icon: Shield     },
  { value: "bug",      label: "Bug Report",         icon: Bug        },
  { value: "account",  label: "Account Issue",      icon: User       },
  { value: "product",  label: "Product Inquiry",    icon: Store      },
  { value: "other",    label: "Other",              icon: Info       },
];

export default function Contact() {
  const { user } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    name:       user?.name  || "",
    email:      user?.email || "",
    phone:      "",
    topic:      "general",
    brand_name: "",
    message:    "",
    agree:      false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [status,     setStatus]     = useState(null);

  const isGuest      = !user;
  const isBrandTopic = form.topic === "brand";
  const canSubmit    = !isGuest || isBrandTopic;

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!form.name.trim())    return "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email address.";
    if (!form.message.trim()) return "Please write your message.";
    if (!form.agree)          return "Please check the consent box.";
    if (isBrandTopic && !form.brand_name.trim())
      return "Please enter your brand name for partnership inquiries.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!canSubmit) {
      setStatus({ type: "err", msg: "Please login to send a message." });
      return;
    }

    const err = validate();
    if (err) { setStatus({ type: "err", msg: err }); return; }

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: user?.id || null,
          name:        form.name.trim(),
          email:       form.email.trim(),
          phone:       form.phone.trim() || null,
          topic:       form.topic,
          brand_name:  form.brand_name.trim() || null,
          message:     form.message.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed");

      setStatus({ type: "ok", msg: "Message sent! We'll get back to you within 24–48 hours. Check your email for confirmation." });
      setForm(f => ({ ...f, phone: "", topic: "general", brand_name: "", message: "", agree: false }));
    } catch (err) {
      setStatus({ type: "err", msg: err.message || "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-b from-[#f7f7ff] to-[#ffb48f] min-h-screen py-10 px-4 lg:px-6">

        <div className="max-w-7xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">Contact Us</h1>
          <p className="text-gray-800 mt-2">
            Support, brand partnership, technical issues — we're here to help.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Sidebar ── */}
          <div className="space-y-6">

            {/* Contact Info Card */}
            <Card>
              <CardRow icon={Mail} title="Email">
                <a className="text-indigo-600 hover:underline" href="mailto:khareedlo@gmail.com">
                  khareedlo@gmail.com
                </a>
              </CardRow>
              <CardRow icon={Phone} title="Phone">
                +92 300 0000000
              </CardRow>
              <CardRow icon={Clock} title="Support Hours">
                Mon–Sat • 11:00 AM – 8:00 PM (PKT)
              </CardRow>
              <CardRow icon={MapPin} title="Head Office">
                Karachi, Pakistan
              </CardRow>
            </Card>

            {/* Auth hint for guests */}
            {isGuest && (
              <Card>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <LogIn className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">Customer? Login first</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Logged-in customers can contact us about any topic.
                      Brands can submit partnership queries without logging in.
                    </p>
                    <button
                      onClick={() => navigate("/auth")}
                      className="mt-3 text-xs font-bold text-red-600 hover:text-red-700 underline"
                    >
                      Login / Register →
                    </button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* ── Form ── */}
          <div className="lg:col-span-2">

            {/* Status */}
            {status && (
              <div className={`mb-6 rounded-xl border p-4 flex items-start gap-3 ${
                status.type === "ok"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}>
                {status.type === "ok"
                  ? <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  : <AlertCircle  className="w-5 h-5 flex-shrink-0 mt-0.5" />
                }
                <span className="text-sm">{status.msg}</span>
              </div>
            )}

            {/* Guest non-brand warning */}
            {isGuest && !isBrandTopic && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">Login required for this topic</p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Only logged-in customers can submit this type of query.
                    Brands may submit <strong>Brand Partnership</strong> requests without an account.
                  </p>
                  <button
                    onClick={() => navigate("/auth")}
                    className="mt-2 text-xs font-bold text-amber-800 underline"
                  >
                    Login now →
                  </button>
                </div>
              </div>
            )}

            <form className="bg-white rounded-3xl shadow-lg p-8 space-y-6" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Field label="Your Name *">
                  <input
                    name="name" value={form.name} onChange={onChange}
                    disabled={!!user?.name} placeholder="e.g. Ali Hassan"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </Field>

                <Field label="Email *">
                  <input
                    name="email" type="email" value={form.email} onChange={onChange}
                    disabled={!!user?.email} placeholder="you@example.com"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </Field>

                <Field label="Phone (optional)">
                  <input
                    name="phone" value={form.phone} onChange={onChange}
                    placeholder="+92 3xx xxxxxxx"
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </Field>

                <Field label="Topic *">
                  <select
                    name="topic" value={form.topic} onChange={onChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                  >
                    {TOPICS.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </Field>

                {isBrandTopic && (
                  <Field className="md:col-span-2" label="Brand / Company Name *">
                    <input
                      name="brand_name" value={form.brand_name} onChange={onChange}
                      placeholder="Your brand or company name"
                      className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </Field>
                )}
              </div>

              <Field label="Message *">
                <textarea
                  name="message" rows={5} value={form.message} onChange={onChange}
                  placeholder="Describe your query in detail…"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </Field>

              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox" name="agree" checked={form.agree} onChange={onChange}
                  className="accent-indigo-600 w-4 h-4"
                />
                I agree to be contacted by the Khareedlo team regarding my query.
              </label>

              <button
                type="submit"
                disabled={submitting || (!canSubmit && !isBrandTopic)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-[#f2976a] text-white font-semibold hover:from-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Sending…
                  </span>
                ) : "Send Message"}
              </button>

              {user && (
                <p className="text-center text-xs text-gray-400">
                  Sending as <strong className="text-gray-600">{user.email}</strong>
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

/* ─── Helpers ─── */
function Card({ children }) {
  return <div className="bg-white rounded-2xl shadow-lg p-5">{children}</div>;
}

function CardRow({ icon: Icon, title, children }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="h-5 w-5 text-indigo-600 mt-0.5" />
      <div>
        <div className="font-semibold text-sm text-gray-800">{title}</div>
        <div className="text-sm text-gray-600">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <div className="font-medium mb-2 text-sm text-gray-700">{label}</div>
      {children}
    </label>
  );
}