// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import { ToastProvider } from "./components/ToastProvider";

// Public
import Home from "./pages/Home";
import Cart from "./pages/cart";
import Auth from "./pages/Auth";
import BrandListing from "./pages/BrandListing";
import BrandDetail from "./pages/BrandDetails";
import ProductsPublic from "./pages/ProductsPublic";
import Explore from "./pages/Explore";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetails";

// User
import Dashboard from "./pages/user/Dashboard";
import ProfilePage from "./pages/user/ProfilePage";
import Wishlist from "./pages/user/Wishlist";
import Settings from "./pages/user/Settings";
import MyOrders from "./pages/user/MyOrders";

// Admin
import AdminDashboard from "./dashboard/AdminDashboard";
import AdminRoute from "./routes/AdminRoute";

// Brand Layout + Guard
import BrandLayout from "./dashboard/BrandLayout";
import BrandRoute from "./routes/BrandRoute";

// ✅ BRAND PAGES (REAL ONES)
import Overview from "./pages/brand/Overview";
import Products from "./pages/brand/Products";
import Analytics from "./pages/brand/Analytics";
import SummaryReport from "./pages/brand/SummaryReport";
import Profile from "./pages/brand/Profile";

// Contexts
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <Loader />;

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ToastProvider>
            <Router>
              <Navbar />

              <Routes>
                {/* ===== Public ===== */}
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/cart" element={<Cart />} />


                <Route path="/brands" element={<BrandListing />} />
                <Route path="/brands/:id" element={<BrandDetail />} />

                <Route path="/products" element={<ProductsPublic />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/contact-us" element={<Contact />} />

                {/* ===== Admin ===== */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />

                {/* ===== User Dashboard ===== */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/profile" element={<ProfilePage />} />
                <Route path="/dashboard/orders" element={<MyOrders />} />
                <Route path="/dashboard/wishlist" element={<Wishlist />} />
                <Route path="/dashboard/settings" element={<Settings />} />

                {/* ===== ✅ BRAND DASHBOARD (FULLY WIRED) ===== */}
                <Route
                  path="/brand"
                  element={
                    <BrandRoute>
                      <BrandLayout />
                    </BrandRoute>
                  }
                >
                  {/* /brand */}
                  <Route index element={<Overview />} />

                  {/* /brand/analytics */}
                  <Route path="analytics" element={<Analytics />} />

                  {/* /brand/products */}
                  <Route path="products" element={<Products />} />

                  {/* /brand/report */}
                  <Route path="report" element={<SummaryReport />} />

                  {/* /brand/profile */}
                  <Route path="profile" element={<Profile />} />
                </Route>
              </Routes>
            </Router>
          </ToastProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
