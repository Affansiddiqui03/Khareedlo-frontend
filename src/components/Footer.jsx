// src/components/Footer.jsx
// Shared footer for: Home, Brands, Products, Explore, Contact Us
// Sexy gradient design matching Khareedlo brand colors

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
import {
  MapPin, Mail, Phone, Clock,
  ChevronRight, Heart, Shield,
} from "lucide-react";
import KhareedloLogo from "../assets/khareedlo.png";

export default function Footer() {
  const [showAbout, setShowAbout] = useState(false);
  const year = new Date().getFullYear();

  return (
    <>
      <footer
        className="relative overflow-hidden text-gray-800"
        style={ {
          background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          fontFamily: "'Sora','DM Sans',sans-serif",
        } }
      >
        {/* Decorative blobs */ }
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2"
          style={ { background: "radial-gradient(circle, #E53E3E, transparent)" } } />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-5 translate-x-1/3 translate-y-1/3"
          style={ { background: "radial-gradient(circle, #F97316, transparent)" } } />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-10">

          {/* Top grid */ }
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

            {/* Brand Column */ }
            <div>
              <div className="flex items-center gap-2 mb-1 -mt-8">
                <img src={ KhareedloLogo } alt="Khareedlo" className="h-28 lg:h-28 xl:h-32 w-auto object-contain" />
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-5">
                Pakistan's premium fashion discovery platform.
                Explore, compare, and shop from the country's top clothing brands — all in one place.
              </p>

              {/* Social */ }
              <div className="flex gap-3">
                { [
                  { Icon: FaInstagram, href: "#", label: "Instagram" },
                  { Icon: FaFacebookF, href: "#", label: "Facebook" },
                  { Icon: FaTwitter, href: "#", label: "Twitter" },
                ].map(({ Icon, href, label }) => (
                  <a key={ label } href={ href } aria-label={ label }
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all">
                    <Icon className="w-4 h-4" />
                  </a>
                )) }
              </div>
            </div>

            {/* Quick Links */ }
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Quick Links</h4>
              <ul className="space-y-3">
                { [
                  { to: "/", label: "Home" },
                  { to: "/brands", label: "Brands" },
                  { to: "/products", label: "Products" },
                  { to: "/explore", label: "Find Outlets" },
                  { to: "/contact-us", label: "Contact Us" },
                ].map(({ to, label }) => (
                  <li key={ to }>
                    <Link to={ to }
                      className="text-white/50 hover:text-white text-sm flex items-center gap-2 group transition-colors">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      { label }
                    </Link>
                  </li>
                )) }
              </ul>
            </div>

            {/* Brands */ }
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Our Brands</h4>
              <ul className="space-y-3">
                { [
                  { label: "J. By Junaid Jamshed", to: "/brands/1" },
                  { label: "Zellbury", to: "/brands/2" },
                  { label: "Alkaram Studio", to: "/brands/3" },
                  { label: "Limelight", to: "/brands/4" },
                ].map(({ label, to }) => (
                  <li key={ label }>
                    <Link to={ to }
                      className="text-white/50 hover:text-white text-sm flex items-center gap-2 group transition-colors">
                      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      { label }
                    </Link>
                  </li>
                )) }
                <li>
                  <button
                    onClick={ () => setShowAbout(true) }
                    className="text-white/50 hover:text-white text-sm flex items-center gap-2 group transition-colors">
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    About Us
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */ }
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5">Get In Touch</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">Email</p>
                    <a href="mailto:khareedlo@gmail.com"
                      className="text-white/70 hover:text-white text-sm transition-colors">
                      khareedlo@gmail.com
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

          {/* Trust strip */ }
          <div className="border-t border-white/10 pt-8 mb-8">
            <div className="flex flex-wrap justify-center gap-6 text-white/40 text-xs">
              { [
                { icon: <Shield className="w-3.5 h-3.5" />, text: "Verified Brands Only" },
                { icon: <Heart className="w-3.5 h-3.5" />, text: "Made with ❤️ in Pakistan" },
                { icon: <MapPin className="w-3.5 h-3.5" />, text: " Trusted " },
              ].map(({ icon, text }) => (
                <div key={ text } className="flex items-center gap-2">
                  { icon }
                  <span>{ text }</span>
                </div>
              )) }
            </div>
          </div>

          {/* Bottom bar */ }
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/30 text-xs">
              © { year } Khareedlo. All rights reserved. IU FYP Project — Spring 2022 Batch.
            </p>
            <div className="flex items-center gap-4 text-white/30 text-xs">
              <span>Privacy Policy</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

      {/* About modal */ }
      { showAbout && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 font-black text-2xl text-white"
              style={ { background: "linear-gradient(135deg, #DC2626, #EA580C)" } }>K</div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">About KHAREEDLO</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              KHAREEDLO is Pakistan's centralized fashion discovery platform — built as an FYP project
              at Iqra University (Spring 2022). It aggregates multiple clothing brands, helping customers
              compare products, find nearby outlets, and get redirected to official brand websites for purchase.
            </p>
            <button onClick={ () => setShowAbout(false) }
              className="px-7 py-2.5 rounded-xl text-white font-semibold"
              style={ { background: "linear-gradient(135deg, #DC2626, #EA580C)" } }>
              Close
            </button>
          </div>
        </div>
      ) }
    </>
  );
}