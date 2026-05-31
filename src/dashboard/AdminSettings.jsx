// src/dashboard/AdminSettings.jsx
// Admin platform settings — email config status, platform info, about

import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import {
  Settings, Mail, CheckCircle, AlertCircle,
  Info, Shield, Globe, Code, RefreshCw,
} from "lucide-react";

function SettingRow({ icon: Icon, label, children, description }) {
  return (
    <div className="flex items-start gap-4 py-5 border-b border-gray-50 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-violet-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default function AdminSettings() {
  const [emailStatus, setEmailStatus] = useState(null);   // null | "ok" | "err"
  const [testLoading, setTestLoading] = useState(false);
  const [toast,       setToast]       = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Test email configuration
  const testEmail = async () => {
    setTestLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/api/contact/unread-count");
      if (res.ok) {
        setEmailStatus("ok");
        showToast("Backend connection is working. Email depends on EMAIL_PASS in .env");
      } else {
        setEmailStatus("err");
        showToast("Backend not reachable", "error");
      }
    } catch {
      setEmailStatus("err");
      showToast("Could not connect to backend", "error");
    } finally {
      setTestLoading(false);
    }
  };

  const PLATFORM_INFO = [
    { label: "Platform Name",    value: "Khareedlo"                        },
    { label: "Version",          value: "1.0.0 — FYP Spring 2022"          },
    { label: "University",       value: "Iqra University, Karachi"          },
    { label: "Backend",          value: "Node.js + Express + MySQL"         },
    { label: "Frontend",         value: "React.js + Tailwind CSS"           },
    { label: "Map Provider",     value: "OpenStreetMap (Leaflet) — Free"    },
    { label: "Email",            value: "Gmail SMTP (Nodemailer)"           },
    { label: "Auth",             value: "Session-based (AuthContext)"       },
    { label: "POS Tracking",     value: "Custom pos_activity table"         },
  ];

  return (
    <AdminLayout>
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
            <Settings className="w-6 h-6 text-violet-500" />
            Platform Settings
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Configuration status and platform information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Email Configuration ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-violet-500" />
              <h2 className="font-bold text-gray-900">Email Configuration</h2>
            </div>
            <div className="px-6">
              <SettingRow icon={Mail} label="SMTP Provider" description="Gmail via Nodemailer">
                <span className="text-xs font-semibold text-gray-500">Gmail SMTP</span>
              </SettingRow>

              <SettingRow icon={Mail} label="Sender Address" description="Set in .env as EMAIL_USER">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-600">
                  khareedlo@gmail.com
                </code>
              </SettingRow>

              <SettingRow icon={Shield} label="App Password" description="Set in .env as EMAIL_PASS">
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                  Check .env
                </span>
              </SettingRow>

              <SettingRow icon={RefreshCw} label="Connection Test" description="Check backend is reachable">
                <button
                  onClick={testEmail}
                  disabled={testLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white disabled:opacity-50 transition-all"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #5B21B6)" }}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testLoading ? "animate-spin" : ""}`} />
                  {testLoading ? "Testing…" : "Test"}
                </button>
              </SettingRow>

              {emailStatus && (
                <div className={`mx-0 mb-4 p-3 rounded-xl flex items-center gap-2 text-sm ${
                  emailStatus === "ok"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}>
                  {emailStatus === "ok"
                    ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                  {emailStatus === "ok"
                    ? "Backend reachable. Email works if EMAIL_PASS is set in .env"
                    : "Backend not reachable. Make sure server is running."}
                </div>
              )}
            </div>
          </div>

          {/* ── Setup Guide ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-amber-500" />
              <h2 className="font-bold text-gray-900">Email Setup Guide</h2>
            </div>
            <div className="px-6 py-5 space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-black flex-shrink-0">1</span>
                <p>Go to <strong>myaccount.google.com</strong> → Security → 2-Step Verification → Enable it</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-black flex-shrink-0">2</span>
                <p>Security → <strong>App Passwords</strong> → App: "Mail", Device: "Other: Khareedlo" → Generate</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-black flex-shrink-0">3</span>
                <p>Copy the 16-character password into your <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">.env</code> file:</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400">
                EMAIL_USER=khareedlo@gmail.com<br />
                EMAIL_PASS=xxxx xxxx xxxx xxxx
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-black flex-shrink-0">4</span>
                <p>Restart backend: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">node server.js</code></p>
              </div>
            </div>
          </div>

          {/* ── Platform Info ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-2">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-blue-500" />
              <h2 className="font-bold text-gray-900">Platform Information</h2>
            </div>
            <div className="px-6 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
                {PLATFORM_INFO.map(({ label, value }) => (
                  <div key={label} className="py-3.5 border-b border-gray-50 last:border-0 pr-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── About / FYP Info ── */}
          <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl shadow-lg overflow-hidden lg:col-span-2 text-white">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Info className="w-5 h-5 text-violet-200" />
                <h2 className="font-bold text-lg">About Khareedlo</h2>
              </div>
              <p className="text-violet-100 text-sm leading-relaxed mb-5">
                Khareedlo is a Final Year Project (FYP) developed at Iqra University, Karachi (Spring 2022 batch).
                It is a multi-vendor clothing aggregation and ordering web platform with POS integration,
                SEO-based product discovery, and outlet finder functionality.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Supervisor",    value: "Dr. Wakeel Shah"        },
                  { label: "Co-Supervisor", value: "Mr. Syed Affan Ahmed"   },
                  { label: "Batch",         value: "Spring 2022"            },
                  { label: "Dept.",         value: "Computer Science"       },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/10 rounded-xl p-3">
                    <p className="text-[10px] text-violet-300 font-bold uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold text-white ${
          toast.type === "error" ? "bg-red-600" : "bg-emerald-600"
        }`}>
          {toast.type === "error"
            ? <AlertCircle className="w-4 h-4" />
            : <CheckCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}
    </AdminLayout>
  );
}