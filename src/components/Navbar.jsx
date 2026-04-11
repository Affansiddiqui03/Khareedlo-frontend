import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
// import logo from "../assets/khareedlo.png";
import BrandLogo from "../assets/Brandlogo.png";
import pakistanFlag from "../assets/pakistan.svg";
import { CartContext } from "../contexts/CartContext";
import { brands } from "../data/demoData";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const location = useLocation();

  // Routes jahan navbar nahi chahiye
const pathname = location.pathname;

// EXACT dashboard routes only
const hideNavbar =
  pathname === "/admin" ||
  pathname.startsWith("/admin/") ||
  pathname === "/brand" ||
  pathname.startsWith("/brand/");

if (hideNavbar) return null;


  // Agar admin ya brand dashboard ho → navbar hide
  const links = [
    { label: "Home", to: "/" },
    { label: "Brands", to: "/brands" },
    { label: "Products", to: "/products" },
    { label: "Explore", to: "/explore" },
    { label: "Contact Us", to: "/contact-us" },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const brand = brands.find((b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (brand) navigate(`/brands/${brand._id}`);
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

        {/* Desktop Links (≥1024px) */}
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
          <button onClick={() => setShowSearch(true)}>
            <Search className="w-5 h-5 text-gray-300 hover:text-amber-400" />
          </button>

          <Link to="/cart" className="relative">
            <ShoppingCart className="w-5 h-5 text-gray-300 hover:text-amber-400" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Desktop User */}
          {user && user.role !== "brand" ? ( // Hide brand user's name
            <div className="hidden lg:block relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 text-gray-300 hover:text-white"
              >
                <User className="w-5 h-5" />
                <span className="text-sm">{user.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg p-2">
                  {user && (
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
                  )}
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

          <img
            src={pakistanFlag}
            alt="Pakistan"
            className="hidden lg:block h-6"
          />

          {/* Hamburger (0–1023px) */}
          <button onClick={() => setMobileOpen(true)} className="lg:hidden">
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

          {/* Drawer (FULL background here) */}
          <div className="relative w-72 h-full bg-[#0C0420]/80 backdrop-blur-xl border-3 border-white/10 shadow-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <span className="text-lg font-semibold"></span>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              {links.map((l) => (
                <NavLink
                  key={l.label}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg text-center font-medium text-black bg-red-50 cursor-pointer hover:bg-red-300 rounded-xl"
                >
                  {l.label}
                </NavLink>
              ))}

              {!user ? (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="mt-4 bg-gradient-to-r from-red-600 to-orange-500 text-white text-center py-3 rounded-xl font-semibold"
                >
                  Login / Sign Up
                </Link>
              ) : (
                <div className="mt-6 flex flex-col gap-4">
                  <Link to="/dashboard" className="hover:text-amber-400">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Search */}
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
                placeholder="Search brands..."
                className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
