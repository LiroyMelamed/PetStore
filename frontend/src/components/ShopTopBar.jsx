// src/components/ShopTopBar.jsx
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import styles from "./ShopTopBar.module.scss";

export default function ShopTopBar() {
    const { token, logout } = useAuth();
    const { count } = useCart();
    const { t } = useTranslation();

    return (
        <AppBar position="sticky" elevation={2} color="default" className={styles.topbar}>
            <Toolbar className={styles.toolbar}>
                {/* Brand */}
                <Typography component={Link} to="/" variant="h6" className={styles.brand}>
                    🐾 <span>PetShop</span>
                </Typography>

                {/* Nav */}
                <Button component={Link} to="/" className={styles.link}>
                    {t("shop.home")}
                </Button>
                <Button component={Link} to="/catalog" className={styles.link}>
                    {t("shop.catalog")}
                </Button>

                {/* Cart */}
                <IconButton component={Link} to="/cart" className={styles.iconBtn} aria-label={t("shop.cart")}>
                    <Badge badgeContent={count || 0} className={styles.badge} overlap="circular">
                        <span role="img" aria-label="cart" style={{ fontSize: 20 }}>🛒</span>
                    </Badge>
                </IconButton>

                {/* Spacer */}
                <Box className={styles.spacer} />

                {/* Language */}
                <LanguageSwitcher className={styles.langBtn} />

                {/* Auth */}
                {!token ? (
                    <>
                        <Button component={Link} to="/login" className={styles.authOutlined}>
                            {t("login.title")}
                        </Button>
                        <Button component={Link} to="/register" className={styles.authPrimary}>
                            {t("register.title")}
                        </Button>
                    </>
                ) : (
                    <>
                        <Button component={Link} to="/my-orders" className={styles.link}>
                            {t("shop.myOrders")}
                        </Button>
                        <Button onClick={logout} className={styles.link}>
                            {t("logout_button")}
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}
