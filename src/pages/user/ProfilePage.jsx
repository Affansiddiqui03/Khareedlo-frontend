// src/pages/user/ProfilePage.jsx  — REPLACE completely

import React, { useState } from "react";
import UserLayout from "../../components/UserLayout";
import { useAuth } from "../../contexts/AuthContext";
import {
  User, Mail, Calendar, Headset, HelpCircle,
  ChevronDown, ChevronUp, Send, CheckCircle, XCircle,
  MessageSquare, Shield
} from "lucide-react";

const FAQS = [
  { q: "What is Khareedlo?", a: "Khareedlo is Pakistan's premier fashion discovery platform. We connect you to the best local brands — J. by Junaid Jamshed, Zellbury, Alkaram, Limelight, and more. You can explore products, save wishlists, and be redirected to the brand's official website to complete your purchase." },
  { q: "How do I buy a product on Khareedlo?", a: "Khareedlo is a discovery platform, not a store. When you click 'Buy Now' on any product, you are redirected to the brand's official website where you can complete the purchase. All payments, deliveries, and returns are handled by the brand." },
  { q: "Is my account data safe?", a: "Yes. Your account information is securely stored and never shared with third parties. We only track your browsing activity on our platform (brands visited, products viewed) to personalize your dashboard experience." },
  { q: "Why do I get redirected when I click Buy Now?", a: "Khareedlo partners with verified Pakistani brands. When you click 'Buy Now', you are taken to that product's page on the brand's official website, ensuring you buy from an authentic source." },
  { q: "How do I add items to my Wishlist?", a: "When browsing products, click the heart icon on any product card. You must be logged in to save items. Your wishlist is accessible from your dashboard under 'My Wishlist'." },
  { q: "Can I track my orders on Khareedlo?", a: "Since purchases are completed on the brand's website, order tracking is handled by the brand directly. Please check your order confirmation email from the brand or visit their website." },
  { q: "How do I contact support?", a: "You can use the Support Contact form on this page. Our team will respond to your registered email address within 24-48 hours." },
  { q: "How do I register my brand on Khareedlo?", a: "Brands can register by going to the Login/Sign Up page and selecting 'Register as Brand'. After filling in your brand details, your application is reviewed by our admin team. Once approved, your brand appears on the platform." },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);
  const [showSupport, setShowSupport] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSupport = async () => {
    if (!message.trim()) return showToast("Please write your message first", "error");
    setSending(true);
    try {
      const res = await fetch("https://khareedlo-backend-production.up.railway.app/api/user/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: user?.id, name: user?.name, email: user?.email, message: message.trim() }),
      });
      if (!res.ok) throw new Error();
      setMessage("");
      setShowSupport(false);
      showToast("Message sent! We'll reply to your email within 24-48 hours.");
    } catch {
      showToast("Failed to send. Please try again.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <UserLayout>
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 max-w-sm ${toast.type === "error" ? "bg-red-600 text-white" : "bg-emerald-600 text-white"}`}>
          {toast.type === "error" ? <XCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Your account information, support and help center</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="h-24 bg-gradient-to-br from-red-600 via-red-500 to-orange-400 relative">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, white, transparent 60%)" }} />
          </div>
          <div className="px-6 pb-6 relative">
            <div className="-mt-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white font-black text-2xl shadow-lg border-4 border-white">
              {(user?.name || "U")[0].toUpperCase()}
            </div>
            <div className="mt-4">
              <h2 className="text-xl font-bold text-gray-900">{user?.name || "User"}</h2>
              <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" /> Verified Khareedlo Customer
              </p>
            </div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: User,     label: "Full Name",    value: user?.name  || "—" },
                { icon: Mail,     label: "Email",        value: user?.email || "—" },
                { icon: Calendar, label: "Member Since",  value: new Date().toLocaleDateString("en-PK", { year: "numeric", month: "long" }) },
                { icon: Shield,   label: "Account Type", value: "Customer" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400 flex items-center gap-1.5 mb-1"><Icon className="w-3.5 h-3.5" />{label}</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50">
            <h3 className="font-bold text-gray-900">Support</h3>
            <p className="text-xs text-gray-400 mt-0.5">Get help from the Khareedlo team</p>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button onClick={() => setShowSupport(true)}
              className="flex items-start gap-4 p-5 rounded-2xl border-2 border-dashed border-gray-200 hover:border-red-300 hover:bg-red-50/30 transition-all text-left group">
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                <Headset className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">Contact Support</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Send us a message. We'll respond to your email within 24-48 hours.</p>
                <p className="text-xs font-semibold text-red-500 mt-2">Send Message →</p>
              </div>
            </button>
            <a href="#help-center" className="flex items-start gap-4 p-5 rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50/30 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                <HelpCircle className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">Help Center</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Find answers to common questions about using Khareedlo.</p>
                <p className="text-xs font-semibold text-orange-500 mt-2">View FAQs ↓</p>
              </div>
            </a>
          </div>
        </div>

        {/* FAQs */}
        <div id="help-center" className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-orange-500" />
            <div>
              <h3 className="font-bold text-gray-900">Help Center — FAQs</h3>
              <p className="text-xs text-gray-400 mt-0.5">Frequently asked questions about Khareedlo</p>
            </div>
          </div>
          <div className="p-5 space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className={`rounded-xl border transition-all duration-200 overflow-hidden ${openFaq === i ? "border-orange-200 bg-orange-50/30" : "border-gray-100 hover:border-gray-200"}`}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-start justify-between gap-3 px-4 py-3.5 text-left">
                  <span className="text-sm font-semibold text-gray-800 leading-snug">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Support Modal */}
      {showSupport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Contact Support</h3>
                <p className="text-xs text-gray-400">We'll reply to {user?.email}</p>
              </div>
              <button onClick={() => setShowSupport(false)} className="ml-auto w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <XCircle className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400 mb-0.5">From</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                </div>
                <div className="bg-gray-50 rounded-xl px-4 py-3">
                  <p className="text-xs text-gray-400 mb-0.5">Reply to</p>
                  <p className="text-sm font-semibold text-gray-800 truncate">{user?.email}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Your Message <span className="text-red-500">*</span></label>
                <textarea rows={5} value={message} onChange={e => setMessage(e.target.value)}
                  placeholder="Describe your issue or question in detail..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-200" />
                <p className="text-xs text-gray-400 mt-1">{message.length}/500 characters</p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
                <p className="text-xs text-blue-700 leading-relaxed">📧 Our team will respond to <strong>{user?.email}</strong> within 24-48 hours.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowSupport(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleSupport} disabled={sending || !message.trim()}
                  className="flex-1 py-3 rounded-xl text-white text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #E53E3E, #F97316)" }}>
                  {sending ? "Sending..." : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </UserLayout>
  );
}