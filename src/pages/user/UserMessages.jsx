// src/pages/user/UserMessages.jsx
// Shows customer's own contact messages + admin replies as a chat thread
// Route: /dashboard/messages

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import UserLayout from "../../components/UserLayout";
import {
  MessageSquare, Clock, CheckCircle, ChevronRight,
  User, Headphones, Tag, RefreshCw, Plus, AlertCircle,
} from "lucide-react";

const TOPIC_LABELS = {
  general: "General Support", brand: "Brand Partnership",
  pos: "POS / Integration",   bug: "Bug Report",
  account: "Account Issue",   product: "Product Inquiry", other: "Other",
};

const TOPIC_COLORS = {
  general:  { bg: "#EFF6FF", color: "#1D4ED8" },
  brand:    { bg: "#F0FDF4", color: "#15803D" },
  pos:      { bg: "#F5F3FF", color: "#6D28D9" },
  bug:      { bg: "#FEF2F2", color: "#DC2626" },
  account:  { bg: "#FFF7ED", color: "#C2410C" },
  product:  { bg: "#ECFDF5", color: "#059669" },
  other:    { bg: "#F9FAFB", color: "#374151" },
};

function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) +
    " at " + d.toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" });
}

function TopicBadge({ topic }) {
  const c = TOPIC_COLORS[topic] || TOPIC_COLORS.other;
  return (
    <span style={{ background: c.bg, color: c.color }}
      className="text-[11px] font-bold px-2.5 py-0.5 rounded-full">
      {TOPIC_LABELS[topic] || topic}
    </span>
  );
}

// ── Single message thread card ─────────────────────────────────
function MessageThread({ msg }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
      msg.replied ? "border-emerald-100" : "border-gray-100"
    } shadow-sm`}>
      {/* Header — click to expand */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50/50 transition-colors"
      >
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          msg.replied ? "bg-emerald-50" : "bg-gray-100"
        }`}>
          <MessageSquare className={`w-5 h-5 ${msg.replied ? "text-emerald-500" : "text-gray-400"}`} />
        </div>

        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <TopicBadge topic={msg.topic} />
            {msg.replied ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <CheckCircle className="w-3 h-3" /> Replied
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600">
                <Clock className="w-3 h-3" /> Awaiting reply
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 line-clamp-1 font-medium">{msg.message}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{fmtDate(msg.created_at)}</p>
        </div>

        <ChevronRight className={`w-4 h-4 text-gray-300 flex-shrink-0 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {/* Expanded thread */}
      {open && (
        <div className="border-t border-gray-50 px-5 pb-5 pt-4 space-y-4">

          {/* Your message */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center flex-shrink-0 mt-0.5">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-gray-700">You</span>
                <span className="text-[10px] text-gray-400">{fmtDate(msg.created_at)}</span>
              </div>
              <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </div>
              {msg.brand_name && (
                <p className="text-[11px] text-gray-400 mt-1 ml-1">Brand: {msg.brand_name}</p>
              )}
            </div>
          </div>

          {/* Admin reply */}
          {msg.replied && msg.reply_text ? (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Headphones className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-700">Khareedlo Support</span>
                  <span className="text-[10px] text-gray-400">{fmtDate(msg.replied_at)}</span>
                </div>
                <div className="bg-violet-50 border border-violet-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {msg.reply_text}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 rounded-xl px-4 py-3 border border-amber-100">
              <Clock className="w-4 h-4 flex-shrink-0" />
              Our team will reply within 24–48 hours.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function UserMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  const fetchMessages = async () => {
    if (!user?.id) return;
    setLoading(true); setError("");
    try {
      const res  = await fetch(`http://localhost:5000/api/contact/user/${user.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not load messages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, [user?.id]);

  const unreplied = messages.filter(m => !m.replied).length;

  return (
    <UserLayout>
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-red-500" />
              My Messages
              {unreplied > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black text-white bg-amber-500">
                  {unreplied} pending
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Your conversations with Khareedlo support
            </p>
          </div>
          <button
            onClick={fetchMessages}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {/* Send new message CTA */}
        <Link
          to="/contact-us"
          className="flex items-center justify-between px-5 py-4 rounded-2xl text-white font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
          style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}
        >
          <div className="flex items-center gap-3">
            <Plus className="w-5 h-5" />
            <div>
              <p className="font-bold">Send a new message</p>
              <p className="text-red-200 text-xs font-normal mt-0.5">We reply within 24–48 hours</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-red-200" />
        </Link>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Messages */}
        {loading ? (
          <div className="space-y-3">
            {[1,2].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                    <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center shadow-sm">
            <div className="w-14 h-14 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-7 h-7 text-gray-300" />
            </div>
            <p className="font-bold text-gray-600 mb-1">No messages yet</p>
            <p className="text-sm text-gray-400 mb-5">Contact our support team whenever you need help</p>
            <Link to="/contact-us"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>
              <Plus className="w-4 h-4" /> Send First Message
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map(msg => (
              <MessageThread key={msg.id} msg={msg} />
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  );
}