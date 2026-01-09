// ✅ App.js (FIXED & CLEAN)
import React, { useState, useEffect }from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/cart";
import Auth from "./pages/Auth";
import { CartProvider } from "./contexts/CartContext";
import BrandListing from "./pages/BrandListing";
import BrandDetail from "./pages/BrandDetails";
// import Brands from "./pages/brands";
import BrandLayout from "./dashboard/BrandLayout";
import Overview from "./pages/brand/Overview";
import Products from "./pages/brand/Products";
import Orders from "./pages/brand/Orders";
import Inventory from "./pages/brand/Inventory";
import Profile from "./pages/brand/Profile";
import Analytics from "./pages/brand/Analytics";
import Support from "./pages/brand/Support";
import AddProduct from "./pages/brand/AddProduct";
import EditProduct from "./pages/brand/EditProduct";
import SummaryReport from "./pages/brand/SummaryReport";
import ProductsPublic from "./pages/ProductsPublic";
import Explore from "./pages/Explore";
import Contact from "./pages/Contact";
import ProductDetail from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/user/Dashboard";
import ProfilePage from "./pages/user/ProfilePage";
import Wishlist from "./pages/user/Wishlist";
import Settings from "./pages/user/Settings"; 
import MyOrders from "./pages/user/MyOrders";
import { WishlistProvider } from "./contexts/WishlistContext";
import Loader from "./components/Loader";
import { ToastProvider } from "./components/ToastProvider";
// import BrandDashboard from "./dashboard/BrandDashboard";


function App() {
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); // 1.5s splash
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Loader />;

  return (
    <CartProvider>
            <WishlistProvider>
                    <ToastProvider>

      <Router>
        <Navbar />

        <Routes>
          {/* ✅ Public Routes */ }
          <Route path="/" element={ <Home /> } />
          <Route path="/cart" element={ <Cart /> } />
          <Route path="/checkout" element={ <Checkout /> } />

          <Route path="/auth" element={ <Auth /> } />
          <Route path="/brands" element={ <BrandListing /> } />
          <Route path="/brands/:id" element={ <BrandDetail /> } />
          {/* <Route path="/all-brands" element={ <Brands /> } /> */}


          <Route path="/dashboard" element={ <Dashboard /> } />
          <Route path="/dashboard/profile" element={ <ProfilePage /> } />
          <Route path="/dashboard/orders" element={ <MyOrders /> } />
          <Route path="/dashboard/wishlist" element={ <Wishlist /> } />
          <Route path="/dashboard/settings" element={ <Settings /> } />


          {/* ✅ PUBLIC PRODUCT PAGE SHOULD BE OUTSIDE */ }
          <Route path="/products" element={ <ProductsPublic /> } />
          <Route path="/explore" element={ <Explore /> } />
          <Route path="/contact-us" element={ <Contact /> } />
          <Route path="/product/:id" element={ <ProductDetail /> } />




          {/* ✅ Brand Dashboard (protected layout) */ }
          <Route path="/brand" element={ <BrandLayout /> }>
            <Route index element={ <Overview /> } />
            <Route path="products" element={ <Products /> } />
            <Route path="products/new" element={ <AddProduct /> } />
            <Route path="products/edit/:id" element={ <EditProduct /> } />
            <Route path="orders" element={ <Orders /> } />
            <Route path="inventory" element={ <Inventory /> } />
            <Route path="profile" element={ <Profile /> } />
            <Route path="analytics" element={ <Analytics /> } />
              <Route path="report" element={<SummaryReport />} />

            <Route path="support" element={ <Support /> } />
            
            {/* <Route index element={<BrandDashboard />} /> */}
          </Route>
        </Routes>
      </Router>
            </ToastProvider>

            </WishlistProvider>

    </CartProvider>
  );
}

export default App;
