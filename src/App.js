// src/App.js — FINAL with Platform Orders route added

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar  from "./components/Navbar";
import Loader  from "./components/Loader";

// Public pages
import Home           from "./pages/Home";
import Cart           from "./pages/cart";
import Auth           from "./pages/Auth";
import BrandListing   from "./pages/BrandListing";
import BrandDetail    from "./pages/BrandDetails";
import ProductsPublic from "./pages/ProductsPublic";
import Explore        from "./pages/Explore";
import Contact        from "./pages/Contact";
import ProductDetail  from "./pages/ProductDetails";

// User pages
import UserDashboard from "./pages/user/Dashboard";
import ProfilePage   from "./pages/user/ProfilePage";
import Wishlist      from "./pages/user/Wishlist";
import Settings      from "./pages/user/Settings";
import UserMessages  from "./pages/user/UserMessages";

// Admin pages
import AdminDashboard from "./dashboard/AdminDashboard";
import AdminBrands    from "./dashboard/AdminBrands";
import AdminProducts  from "./dashboard/AdminProducts";
import AdminApprovals from "./dashboard/AdminApprovals";
import AdminCustomers from "./dashboard/AdminCustomers";
import AdminMessages  from "./dashboard/AdminMessages";
import AdminSync      from "./dashboard/AdminSync";
import AdminSettings  from "./dashboard/AdminSettings";
import AdminRoute     from "./routes/AdminRoute";

// Brand dashboard
import BrandLayout    from "./dashboard/BrandLayout";
import BrandRoute     from "./routes/BrandRoute";
import Overview       from "./pages/brand/Overview";
import Analytics      from "./pages/brand/Analytics";
import Products       from "./pages/brand/Products";
import PlatformOrders from "./pages/brand/PlatformOrders";  // NEW
import SummaryReport  from "./pages/brand/SummaryReport";
import Profile        from "./pages/brand/Profile";

// Providers
import { AuthProvider }     from "./contexts/AuthContext";
import { CartProvider }     from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";

function WithNav({ children }) {
  return <><Navbar />{children}</>;
}
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [booting, setBooting] = useState(true);
  useEffect(() => { const t = setTimeout(() => setBooting(false), 1400); return () => clearTimeout(t); }, []);
  if (booting) return <Loader />;

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
              <ScrollToTop />

            <Routes>

              {/* ── PUBLIC ── */}
              <Route path="/"            element={<WithNav><Home /></WithNav>} />
              <Route path="/auth"        element={<WithNav><Auth /></WithNav>} />
              <Route path="/cart"        element={<WithNav><Cart /></WithNav>} />
              <Route path="/brands"      element={<WithNav><BrandListing /></WithNav>} />
              <Route path="/brands/:id"  element={<WithNav><BrandDetail /></WithNav>} />
              <Route path="/products"    element={<WithNav><ProductsPublic /></WithNav>} />
              <Route path="/product/:id" element={<WithNav><ProductDetail /></WithNav>} />
              <Route path="/explore"     element={<WithNav><Explore /></WithNav>} />
              <Route path="/contact-us"  element={<WithNav><Contact /></WithNav>} />

              {/* ── USER ── */}
              <Route path="/dashboard"              element={<WithNav><UserDashboard /></WithNav>} />
              <Route path="/dashboard/profile"      element={<WithNav><ProfilePage /></WithNav>} />
              <Route path="/dashboard/wishlist"     element={<WithNav><Wishlist /></WithNav>} />
              <Route path="/dashboard/settings"     element={<WithNav><Settings /></WithNav>} />
              <Route path="/dashboard/messages"     element={<WithNav><UserMessages /></WithNav>} />

              {/* ── ADMIN ── */}
              <Route path="/admin"                  element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/brands"           element={<AdminRoute><AdminBrands /></AdminRoute>} />
              <Route path="/admin/products"         element={<AdminRoute><AdminProducts /></AdminRoute>} />
              <Route path="/admin/approvals"        element={<AdminRoute><AdminApprovals /></AdminRoute>} />
              <Route path="/admin/customers"        element={<AdminRoute><AdminCustomers /></AdminRoute>} />
              <Route path="/admin/users"            element={<AdminRoute><AdminCustomers /></AdminRoute>} />
              <Route path="/admin/pending-products" element={<AdminRoute><AdminApprovals /></AdminRoute>} />
              <Route path="/admin/messages"         element={<AdminRoute><AdminMessages /></AdminRoute>} />
              <Route path="/admin/sync"             element={<AdminRoute><AdminSync /></AdminRoute>} />
              <Route path="/admin/settings"         element={<AdminRoute><AdminSettings /></AdminRoute>} />

              {/* ── BRAND ── */}
              <Route path="/brand" element={<BrandRoute><BrandLayout /></BrandRoute>}>
                <Route index              element={<Overview />} />
                <Route path="analytics"   element={<Analytics />} />
                <Route path="products"    element={<Products />} />
                <Route path="orders"      element={<PlatformOrders />} />
                <Route path="report"      element={<SummaryReport />} />
                <Route path="profile"     element={<Profile />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}