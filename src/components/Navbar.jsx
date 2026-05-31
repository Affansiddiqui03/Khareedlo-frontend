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

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer */}
          <div className="relative w-72 h-full flex flex-col bg-[#0C0420] backdrop-blur-xl shadow-2xl text-white">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xs">K</span>
                </div>
                <span className="text-white font-bold text-base tracking-tight">Khareedlo</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User greeting */}
            {user && (
              <div className="mx-4 mt-4 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-white/40 text-xs truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {links.map((l) => (
                <NavLink
                  key={l.label}
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg"
                        : "text-white/60 hover:text-white hover:bg-white/8"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}

              {/* Divider */}
              <div className="my-3 border-t border-white/10" />

              {/* Auth links */}
              {user ? (
                <>
                  <Link
                    to={user.role === "admin" ? "/admin" : user.role === "brand" ? "/brand" : "/dashboard"}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/8 transition-all"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 mt-2 bg-gradient-to-r from-red-600 to-orange-500 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                >
                  Login / Sign Up
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}

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