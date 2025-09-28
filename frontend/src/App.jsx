import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Box, AppBar, Toolbar, Button, Container, Typography, IconButton, Badge } from "@mui/material";
import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";
import { useTranslation } from "react-i18next";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Admin
import Dashboard from "./components/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import ProductManager from "./components/ProductManager";
import CategoryManager from "./components/CategoryManager";
import OrdersPage from "./components/OrdersPage";
import ManageAdmins from "./components/ManageAdmins";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./ProtectedRoute";

// Shop
import HomePage from "./pages/HomePage";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "he" ? "en" : "he";
    i18n.changeLanguage(newLang);
    localStorage.setItem("i18nextLng", newLang);

    // שינוי כיוון דף
    document.documentElement.dir = newLang === "he" ? "rtl" : "ltr";
  };

  return (
    <Button onClick={toggleLanguage} color="inherit">
      {i18n.language === "he" ? "EN" : "עב"}
    </Button>
  );
}

function ShopTopBar() {
  const { token, logout } = useAuth();
  const { items } = useCart();
  const { t } = useTranslation();

  return (
    <AppBar position="sticky" color="default" elevation={2} sx={{ bgcolor: "#1E3A8A", color: "white" }}>
      <Toolbar sx={{ gap: 3 }}>
        {/* לוגו */}
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          🐾 PetShop
        </Typography>

        {/* ניווט */}
        <Button component={Link} to="/" sx={{ color: "white" }}>{t("shop.home")}</Button>
        <Button component={Link} to="/catalog" sx={{ color: "white" }}>{t("shop.catalog")}</Button>

        {/* עגלה */}
        <IconButton component={Link} to="/cart" sx={{ color: "white" }}>
          <Badge badgeContent={items.length} color="secondary">
            {/* <ShoppingCartIcon /> */}
          </Badge>
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {/* שפה */}
        <LanguageSwitcher />

        {/* התחברות/התנתקות */}
        {!token ? (
          <>
            <Button component={Link} to="/login" variant="outlined" color="inherit">{t("login.title")}</Button>
            <Button component={Link} to="/register" variant="contained" sx={{ bgcolor: "#06B6D4" }}>{t("register.title")}</Button>
          </>
        ) : (
          <>
            <Button component={Link} to="/my-orders" sx={{ color: "white" }}>{t("shop.myOrders")}</Button>
            <Button onClick={logout} color="inherit">{t("logout_button")}</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

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

      {/* Admin area */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductManager />} />
        <Route path="categories" element={<CategoryManager />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="admins" element={<ManageAdmins />} />
      </Route>
    </Routes>
  );
}
