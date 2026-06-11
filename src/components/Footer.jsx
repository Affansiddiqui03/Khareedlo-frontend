// src/components/Footer.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import {
  MapPin, Mail, Phone, Clock,
  ChevronRight, Heart, Shield, X,
} from "lucide-react";
import KhareedloLogo from "../assets/khareedlo.png";

const PRIVACY = `Privacy Policy

Last updated: June 2026

1. Information We Collect
We collect information you provide directly to us, such as your name, email address, and password when you create an account. We also collect usage data such as products viewed, brands visited, and items added to cart.

2. How We Use Your Information
We use the information we collect to operate and improve the Khareedlo platform, personalize your experience, show you trending and relevant products, and respond to your inquiries.

3. Information Sharing
We do not sell your personal information. We do not share your data with third parties except as necessary to operate our platform (e.g. brand partners whose products you interact with).

4. Data Security
We implement reasonable security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.

5. Cookies
We use cookies and similar technologies to enhance your browsing experience and analyze platform usage.

6. Your Rights
You may request access to, correction of, or deletion of your personal data by contacting us at khareedlo26@gmail.com.

7. Changes to This Policy
We may update this Privacy Policy from time to time. Continued use of Khareedlo after changes constitutes acceptance of the updated policy.

8. Contact
For privacy-related questions, contact us at khareedlo26@gmail.com.`;

const TERMS = `Terms of Service

Last updated: June 2026

1. Acceptance of Terms
By accessing or using Khareedlo, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.

2. About Khareedlo
Khareedlo is a fashion discovery platform that aggregates products from verified Pakistani clothing brands. We do not sell products directly — we redirect you to the official brand website for purchase.

3. User Accounts
You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information when registering and to notify us of any unauthorized use of your account.

4. Prohibited Conduct
You may not use Khareedlo to post false or misleading information, attempt to gain unauthorized access to any part of the platform, or engage in any activity that disrupts or interferes with the platform.

5. Brand Listings
Brands listed on Khareedlo are verified and approved by our team. Khareedlo is not responsible for the quality, availability, or pricing of products sold on brand websites.

6. Intellectual Property
All content on Khareedlo, including logos, design, and text, is the property of Khareedlo and may not be reproduced without permission.

7. Limitation of Liability
Khareedlo is provided "as is." We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.

8. Changes to Terms
We reserve the right to modify these Terms at any time. Continued use of the platform after changes constitutes your acceptance.

9. Contact
For questions about these Terms, contact us at khareedlo26@gmail.com.`;

function Modal({ title, content, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-extrabold text-gray-900">{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">
          {content.split("\n").map((line, i) => (
            line.trim() === "" ? <div key={i} className="h-2" /> :
            /^\d+\./.test(line.trim()) ? (
              <p key={i} className="text-sm font-bold text-gray-800 mt-4 mb-1">{line}</p>
            ) : line.trim().toUpperCase() === line.trim() && line.trim().length > 3 ? (
              <p key={i} className="text-base font-extrabold text-gray-900 mb-3">{line}</p>
            ) : (
              <p key={i} className="text-sm text-gray-600 leading-relaxed">{line}</p>
            )
          ))}
        </div>
        <div className="px-6 py-4 border-t border-gray-100">
          <button onClick={onClose}
            className="w-full py-2.5 rounded-xl text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [showAbout,   setShowAbout]   = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms,   setShowTerms]   = useState(false);
  const year = new Date().getFullYear();

  return (
    <>
      <footer
        className="relative overflow-hidden text-gray-800"
        style={{
          background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          fontFamily: "'Sora','DM Sans',sans-serif",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(circle, #E53E3E, transparent)" }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-5 translate-x-1/3 translate-y-1/3"
          style={{ background: "radial-gradient(circle, #F97316, transparent)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10">

          {/* Top grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-2 -mt-10">
                <img src={KhareedloLogo} alt="Khareedlo" className="h-28 lg:h-32 xl:h-36 w-auto object-contain" />
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-5">
                Pakistan's premium fashion discovery platform.
                Explore, compare, and shop from the country's top clothing brands — all in one place.
              </p>

              {/* Social — Instagram + Facebook only */}
              <div className="flex gap-3">
                <a href="https://www.instagram.com/khareedlostore387?igsh=MTBsbTd5cWxpeW12bQ%3D%3D&utm_source=qr"
                  target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all">
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a href="https://www.facebook.com/share/18JrxiL7S5/?mibextid=wwXIfr"
                  target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all">
                  <FaFacebookF className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { to: "/",           label: "Home"         },
                  { to: "/brands",     label: "Brands"       },
                  { to: "/products",   label: "Products"     },
                  { to: "/explore",    label: "Find Outlets" },
                  { to: "/contact-us", label: "Contact Us"   },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link to={to}
                      className="text-white/50 hover:text-white text-sm flex items-center gap-2 group transition-colors">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brands */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Our Brands</h4>
              <ul className="space-y-3">
                {[
                  { label: "J. By Junaid Jamshed", to: "/brands/1" },
                  { label: "Zellbury",              to: "/brands/2" },
                  { label: "Alkaram Studio",        to: "/brands/3" },
                  { label: "Limelight",             to: "/brands/4" },
                ].map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to}
                      className="text-white/50 hover:text-white text-sm flex items-center gap-2 group transition-colors">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/brands"
                    className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2 group transition-colors font-semibold">
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    View More →
                  </Link>
                </li>
                <li>
                  <button onClick={() => setShowAbout(true)}
                    className="text-white/50 hover:text-white text-sm flex items-center gap-2 group transition-colors">
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    About Us
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Get In Touch</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Email</p>
                    <a href="mailto:khareedlo26@gmail.com"
                      className="text-white/70 hover:text-white text-sm transition-colors">
                      khareedlo26@gmail.com
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Phone</p>
                    <p className="text-white/70 text-sm">+92 300 0000000</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Head Office</p>
                    <p className="text-white/70 text-sm">Karachi, Pakistan</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Support Hours</p>
                    <p className="text-white/70 text-sm">Mon–Sat, 11AM–8PM PKT</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Trust strip */}
          <div className="border-t border-white/10 pt-8 mb-8">
            <div className="flex flex-wrap justify-center gap-6 text-white/40 text-xs">
              {[
                { icon: <Shield className="w-3.5 h-3.5" />, text: "Verified Brands Only"     },
                { icon: <Heart  className="w-3.5 h-3.5" />, text: "Made with ❤️ in Pakistan" },
                { icon: <MapPin className="w-3.5 h-3.5" />, text: "Trusted"                  },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  {icon}<span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs">
              © {year} Khareedlo. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-white/30 text-xs">
              <button onClick={() => setShowPrivacy(true)}
                className="hover:text-white/60 transition-colors">
                Privacy Policy
              </button>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <button onClick={() => setShowTerms(true)}
                className="hover:text-white/60 transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* About modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 font-black text-2xl text-white"
              style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>K</div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">About KHAREEDLO</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              KHAREEDLO is Pakistan's centralized fashion discovery platform — built as an FYP project
              at Iqra University (Spring 2022). It aggregates multiple clothing brands, helping customers
              compare products, find nearby outlets, and get redirected to official brand websites for purchase.
            </p>
            <button onClick={() => setShowAbout(false)}
              className="px-7 py-2.5 rounded-xl text-white font-semibold"
              style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Privacy Policy modal */}
      {showPrivacy && (
        <Modal title="Privacy Policy" content={PRIVACY} onClose={() => setShowPrivacy(false)} />
      )}

      {/* Terms of Service modal */}
      {showTerms && (
        <Modal title="Terms of Service" content={TERMS} onClose={() => setShowTerms(false)} />
      )}
    </>
  );
}