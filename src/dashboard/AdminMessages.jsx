// src/dashboard/AdminMessages.jsx
// Admin inbox — view all contact messages, mark read, send email replies

import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  Mail, MailOpen, Clock, User, Phone, Tag,
  Building2, MessageSquare, Send, CheckCircle,
  RefreshCw, Search, Filter, X, ExternalLink,
  AlertCircle, ChevronDown, Inbox,
} from "lucide-react";

const TOPIC_LABELS = {
  general:  "General Support",
  brand:    "Brand Partnership",
  pos:      "POS / Integration",
  bug:      "Bug Report",
  account:  "Account Issue",
  product:  "Product Inquiry",
  other:    "Other",
};

const TOPIC_COLORS = {
  general:  { bg: "#EFF6FF", text: "#1D4ED8" },
  brand:    { bg: "#F0FDF4", text: "#15803D" },
  pos:      { bg: "#F5F3FF", text: "#6D28D9" },
  bug:      { bg: "#FEF2F2", text: "#DC2626" },
  account:  { bg: "#FFF7ED", text: "#C2410C" },
  product:  { bg: "#ECFDF5", text: "#059669" },
  other:    { bg: "#F9FAFB", text: "#374151" },
};

function TopicBadge({ topic }) {
  const c = TOPIC_COLORS[topic] || TOPIC_COLORS.other;
  return (
    <span style={{ background: c.bg, color: c.text }}
      className="text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
      {TOPIC_LABELS[topic] || topic}
    </span>
  );
}

function timeAgo(ts) {
  const diff = (Date.now() - new Date(ts)) / 1000;
  if (diff < 60)   return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff/3600)}h ago`;
  return new Date(ts).toLocaleDateString("en-PK", { day:"numeric", month:"short", year:"numeric" });
}

export default function AdminMessages() {
  const [messages,   setMessages]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState(null);   // full message detail
  const [replyText,  setReplyText]  = useState("");
  const [replying,   setReplying]   = useState(false);
  const [replyStatus,setReplyStatus]= useState(null);   // {type,msg}
  const [filterTopic,setFilterTopic]= useState("all");
  const [filterRead, setFilterRead] = useState("all");  // "all"|"unread"|"read"
  const [search,     setSearch]     = useState("");
  const [toast,      setToast]      = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://khareedlo-backend-production.up.railway.app/api/contact");
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  // Mark as read when opening a message
  const openMessage = async (msg) => {
    setSelected(msg);
    setReplyText("");
    setReplyStatus(null);

    if (!msg.is_read) {
      try {
        await fetch(`https://khareedlo-backend-production.up.railway.app/api/contact/${msg.id}/read`, {
          method: "PATCH",
        });
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: 1 } : m));
        setSelected(prev => prev ? { ...prev, is_read: 1 } : prev);
      } catch {}
    }
  };

  const sendReply = async () => {
    if (!replyText.trim()) return;
    setReplying(true);
    setReplyStatus(null);

    try {
      const res = await fetch(`https://khareedlo-backend-production.up.railway.app/api/contact/${selected.id}/reply`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply_text: replyText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setReplyStatus({ type: "ok", msg: `Reply sent to ${selected.email}` });
      setMessages(prev => prev.map(m => m.id === selected.id ? { ...m, replied: 1, reply_text: replyText.trim() } : m));
      setSelected(prev => prev ? { ...prev, replied: 1, reply_text: replyText.trim() } : prev);
      setReplyText("");
      showToast(`Reply sent to ${selected.email}`);
    } catch (err) {
      setReplyStatus({ type: "err", msg: err.message || "Failed to send reply." });
    } finally {
      setReplying(false);
    }
  };

  // Filtered list
  const filtered = messages.filter(m => {
    if (filterTopic !== "all" && m.topic !== filterTopic) return false;
    if (filterRead === "unread" && m.is_read)             return false;
    if (filterRead === "read"   && !m.is_read)            return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <AdminLayout>
      <div className="h-full flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
              <Inbox className="w-6 h-6 text-red-500" />
              Contact Messages
              {unreadCount > 0 && (
                <span className="ml-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{messages.length} total messages</p>
          </div>
          <button
            onClick={fetchMessages}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {/* ── Filters ── */}
        <div className="flex flex-wrap gap-3 mb-5 flex-shrink-0">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name, email, message…"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Topic filter */}
          <select
            value={filterTopic}
            onChange={e => setFilterTopic(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-200 cursor-pointer"
          >
            <option value="all">All Topics</option>
            {Object.entries(TOPIC_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>

          {/* Read status filter */}
          <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm">
            {[["all","All"],["unread","Unread"],["read","Read"]].map(([val,label]) => (
              <button
                key={val}
                onClick={() => setFilterRead(val)}
                className={`px-4 py-2.5 font-semibold transition-colors ${
                  filterRead === val ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Split Panel ── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-5 min-h-0">

          {/* ── Message List ── */}
          <div className="xl:col-span-2 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto space-y-2 pr-1" style={{ scrollbarWidth: "thin" }}>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                        <div className="h-2.5 bg-gray-100 rounded-full w-1/2" />
                        <div className="h-2.5 bg-gray-100 rounded-full w-3/4" />
                      </div>
                    </div>
                  </div>
                ))
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100">
                  <Inbox className="w-12 h-12 text-gray-200 mb-3" />
                  <p className="font-bold text-gray-500">No messages found</p>
                  <p className="text-xs text-gray-400 mt-1">Try changing your filters</p>
                </div>
              ) : filtered.map(m => (
                <div
                  key={m.id}
                  onClick={() => openMessage(m)}
                  className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 ${
                    selected?.id === m.id
                      ? "border-red-300 ring-2 ring-red-100 shadow-md"
                      : !m.is_read
                      ? "border-blue-100 bg-blue-50/30"
                      : "border-gray-100"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                      m.is_read ? "bg-gray-100 text-gray-500" : "bg-red-100 text-red-600"
                    }`}>
                      {m.name?.[0]?.toUpperCase() || "?"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className={`text-sm truncate ${m.is_read ? "font-medium text-gray-700" : "font-extrabold text-gray-900"}`}>
                          {m.name}
                        </p>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {!m.is_read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                          {m.replied  && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-400 truncate">{m.email}</p>

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <TopicBadge topic={m.topic} />
                        <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                          <Clock className="w-3 h-3" /> {timeAgo(m.created_at)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {m.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Message Detail & Reply ── */}
          <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col min-h-0">
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-300" />
                </div>
                <p className="font-bold text-gray-500">Select a message to view</p>
                <p className="text-xs text-gray-400 mt-1">Click any message from the list</p>
              </div>
            ) : (
              <>
                {/* Detail header */}
                <div className="p-5 border-b border-gray-100 flex-shrink-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0">
                        {selected.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-lg leading-tight">{selected.name}</h3>
                        <a href={`mailto:${selected.email}`}
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" /> {selected.email}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {selected.replied && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                          <CheckCircle className="w-3.5 h-3.5" /> Replied
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{timeAgo(selected.created_at)}</span>
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="flex flex-wrap gap-3 mt-3">
                    <TopicBadge topic={selected.topic} />
                    {selected.phone && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Phone className="w-3.5 h-3.5" /> {selected.phone}
                      </span>
                    )}
                    {selected.brand_name && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Building2 className="w-3.5 h-3.5" /> {selected.brand_name}
                      </span>
                    )}
                    {selected.customer_id && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                        <User className="w-3.5 h-3.5" /> Registered customer
                      </span>
                    )}
                  </div>
                </div>

                {/* Message body */}
                <div className="p-5 flex-1 overflow-y-auto">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Message</p>
                  <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </div>

                  {/* Previous reply (if any) */}
                  {selected.reply_text && (
                    <div className="mt-5">
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-3">
                        Your Previous Reply
                      </p>
                      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-sm text-emerald-800 leading-relaxed whitespace-pre-wrap">
                        {selected.reply_text}
                      </div>
                      {selected.replied_at && (
                        <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Replied {timeAgo(selected.replied_at)}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Reply status */}
                  {replyStatus && (
                    <div className={`mt-4 p-3.5 rounded-xl flex items-start gap-2.5 text-sm ${
                      replyStatus.type === "ok"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-red-50 text-red-700 border border-red-100"
                    }`}>
                      {replyStatus.type === "ok"
                        ? <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      }
                      {replyStatus.msg}
                    </div>
                  )}
                </div>

                {/* Reply box */}
                <div className="p-5 border-t border-gray-100 flex-shrink-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Send Reply to {selected.email}
                  </p>
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    rows={4}
                    placeholder="Type your reply here — this will be emailed directly to the sender…"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-200 transition"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-[11px] text-gray-400">
                      Email will be sent from <strong>khareedlo@gmail.com</strong>
                    </p>
                    <button
                      onClick={sendReply}
                      disabled={!replyText.trim() || replying}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:-translate-y-0.5"
                      style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}
                    >
                      {replying ? (
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {replying ? "Sending…" : "Send Reply"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold ${
          toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
        }`}>
          <CheckCircle className="w-4 h-4" />
          {toast.msg}
        </div>
      )}
    </AdminLayout>
  );
}