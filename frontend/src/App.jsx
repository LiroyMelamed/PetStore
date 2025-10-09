// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { Container } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Admin
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./ProtectedRoute";

// Shop
import HomePage from "./pages/HomePage";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import OrderDetails from "./pages/OrderDetails";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminLayout from "./components/admin/AdminLayout";
import AdminBanners from "./pages/AdminBanners";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import ShopTopBar from "./components/ShopTopBar";

function ShopLayout({ children }) {
  return (
    <>
      <ShopTopBar />
      <Container maxWidth="lg">{children}</Container>
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public shop */}
      <Route path="/" element={<ShopLayout><HomePage /></ShopLayout>} />
      <Route path="/catalog" element={<ShopLayout><Catalog /></ShopLayout>} />
      <Route path="/product/:id" element={<ShopLayout><ProductDetail /></ShopLayout>} />
      <Route path="/cart" element={<ShopLayout><Cart /></ShopLayout>} />
      <Route path="/checkout" element={<ShopLayout><Checkout /></ShopLayout>} />
      <Route path="/order-success" element={<ShopLayout><OrderSuccess /></ShopLayout>} />
      <Route path="/order-success/:id" element={<ShopLayout><OrderSuccess /></ShopLayout>} />
      <Route path="/login" element={<ShopLayout><Login /></ShopLayout>} />
      <Route path="/register" element={<ShopLayout><Register /></ShopLayout>} />

      <Route
        path="/my-orders"
        element={
          <ProtectedRoute>
            <ShopLayout><MyOrders /></ShopLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/order/:id"
        element={
          <ProtectedRoute>
            <ShopLayout><OrderDetails /></ShopLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin area */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
      </Route>

    </Routes>
  );
}
