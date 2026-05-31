import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

import BrandLogo from "../assets/Brandlogo.png";
import pakistanFlag from "../assets/pakistan.svg";

import { CartContext } from "../contexts/CartContext";
import { brands } from "../data/demoData";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  // ✅ Updated CartContext
  const { cart, totalItems } = useContext(CartContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const { user, logout } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Hide navbar on dashboards
  const pathname = location.pathname;

  const hideNavbar =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/brand" ||
    pathname.startsWith("/brand/");

  if (hideNavbar) return null;

  // Nav links
  const links = [
    { label: "Home", to: "/" },
    { label: "Brands", to: "/brands" },
    { label: "Products", to: "/products" },
    { label: "Explore", to: "/explore" },
    { label: "Contact Us", to: "/contact-us" },
  ];

  // Search
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    const brand = brands.find((b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (brand) {
      navigate(`/brands/${brand._id}`);
    } else {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }

    setShowSearch(false);
    setSearchQuery("");
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0C0420]/50 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center justify-start">
          <img
            src={BrandLogo}
            alt="Khareedlo"
            className="h-[3rem] sm:h-[4rem] md:h-[4rem] lg:h-[4rem] w-auto object-contain ml-0 mr-0"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              className={({ isActive }) =>
                isActive
                  ? "text-white font-semibold"
                  : "text-gray-300 hover:text-amber-400 transition"
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          
          {/* Search Button */}
          <button onClick={() => setShowSearch(true)}>
            <Search className="w-5 h-5 text-gray-300 hover:text-amber-400" />
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-5 h-5 text-gray-300 hover:text-amber-400" />

            {/* ✅ Updated badge */}
            {user && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>

          {/* Desktop User */}
          {user && user.role !== "brand" ? (
            <div
              className="hidden lg:block relative"
              ref={dropdownRef}
            >
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 text-gray-300 hover:text-white"
              >
                <User className="w-5 h-5" />

                <span className="text-sm">
                  {user.name}
                </span>

                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg p-2">
                  
                  <Link
                    to={
                      user.role === "admin"
                        ? "/admin"
                        : user.role === "brand"
                        ? "/brand"
                        : "/dashboard"
                    }
                    className="block px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/cart"
                    className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    <span>My Cart</span>

                    {totalItems > 0 && (
                      <span className="text-xs font-bold text-red-600">
                        {totalItems}
                      </span>
                    )}
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-500 text-white px-4 py-2.5 rounded-full text-sm font-semibold"
            >
              <User className="w-4 h-4" />
              Login / Sign Up
            </Link>
          )}

          {/* Flag */}
          <img
            src={pakistanFlag}
            alt="Pakistan"
            className="hidden lg:block h-6"
          />

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden"
          >
            <Menu className="w-7 h-7 text-gray-200" />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER — always mounted, slides in/out */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />

        {/* Drawer panel — slides from left */}
        <div
          className={`absolute left-0 top-0 h-full z-10 flex flex-col text-white transition-transform duration-300 ease-out ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{
            width: "min(80vw, 300px)",
            background: "linear-gradient(160deg, #0C0420 0%, #100818 60%, #0C0420 100%)",
            boxShadow: "6px 0 40px rgba(0,0,0,0.6)",
          }}
        >
          {/* Decorative top gradient blob */}
          <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none overflow-hidden rounded-none">
            <div className="absolute -top-6 -left-6 w-40 h-40 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #DC2626, transparent)" }} />
          </div>

          {/* Header */}
          <div className="relative flex items-center justify-between px-5 pt-6 pb-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>
                <span className="text-white font-black text-sm">K</span>
              </div>
              <div>
                <p className="text-white font-bold text-base leading-tight">Khareedlo</p>
                <p className="text-white/30 text-[10px] tracking-widest uppercase">Pakistan Fashion</p>
              </div>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>
          </div>

          {/* User card */}
          {user && (
            <div className="mx-4 mt-4 px-3.5 py-3 rounded-2xl flex items-center gap-3"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-lg"
                style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                <p className="text-white/35 text-[11px] truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Nav links */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-3 mb-3">Menu</p>
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    isActive
                      ? "text-white"
                      : "text-white/50 hover:text-white/90 hover:bg-white/5"
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? { background: "linear-gradient(135deg, rgba(220,38,38,0.25), rgba(234,88,12,0.15))", border: "1px solid rgba(220,38,38,0.2)" }
                    : {}
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: "linear-gradient(180deg,#DC2626,#EA580C)" }} />}
                    {l.label}
                  </>
                )}
              </NavLink>
            ))}

            <div className="my-3 border-t border-white/[0.08]" />

            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : user.role === "brand" ? "/brand" : "/dashboard"}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/50 hover:text-white/90 hover:bg-white/5 transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 mt-3 py-3.5 rounded-2xl font-bold text-sm text-white shadow-xl transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #DC2626, #EA580C)" }}
              >
                Login / Sign Up
              </Link>
            )}
          </nav>

          {/* Bottom branding */}
          <div className="px-5 py-4 border-t border-white/[0.06]">
            <p className="text-white/20 text-[10px] text-center tracking-wider">© 2025 Khareedlo</p>
          </div>
        </div>
      </div>

      {/* SEARCH MODAL */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-24 px-4">
          
          <div className="bg-white w-full max-w-xl p-6 rounded-2xl relative">
            
            <button
              onClick={() => setShowSearch(false)}
              className="absolute top-3 right-3"
            >
              <X />
            </button>

            <form onSubmit={handleSearchSubmit}>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search brands or products..."
                className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}