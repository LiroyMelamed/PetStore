// src/components/ShopTopBar.jsx
import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box, Drawer, List, ListItem, ListItemButton, ListItemText, Divider } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import styles from "./ShopTopBar.module.scss";

export default function ShopTopBar() {
    const { token, logout } = useAuth();
    const { count } = useCart();
    const { t, i18n } = useTranslation();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isRTL = i18n.language === "he";

    const closeDrawer = () => setDrawerOpen(false);
    const handleLogout = () => { logout(); closeDrawer(); };

    return (
        <>
            <AppBar position="sticky" elevation={0} color="default" className={styles.topbar}>
                <Toolbar className={styles.toolbar}>
                    <IconButton size="large" edge="start" color="inherit" onClick={() => setDrawerOpen(true)} className={styles.mobileMenuBtn} aria-label="menu">
                        <MenuIcon />
                    </IconButton>

                    <Typography component={RouterLink} to="/" className={styles.brand} onClick={closeDrawer}>
                        🐾 <span className={styles.brandText}>PetShop</span>
                    </Typography>

                    <Box className={styles.desktopNav}>
                        <Button component={RouterLink} to="/" className={styles.link}>{t("shop.home")}</Button>
                        <Button component={RouterLink} to="/catalog" className={styles.link}>{t("shop.catalog")}</Button>
                    </Box>

                    <Box className={styles.spacer} />

                    <IconButton component={RouterLink} to="/cart" className={styles.cartBtn} aria-label={t("shop.cart")} onClick={closeDrawer}>
                        <Badge badgeContent={count || 0} overlap="circular" className={styles.badge}>
                            <span className={styles.cartIcon}>🛒</span>
                        </Badge>
                    </IconButton>

                    <LanguageSwitcher className={styles.langBtn} />

                    {!token ? (
                        <Box className={styles.desktopAuth}>
                            <Button component={RouterLink} to="/login" className={styles.authOutlined}>{t("login.title")}</Button>
                            <Button component={RouterLink} to="/register" className={styles.authPrimary}>{t("register.title")}</Button>
                        </Box>
                    ) : (
                        <Box className={styles.desktopAuth}>
                            <Button component={RouterLink} to="/my-orders" className={styles.link}>{t("shop.myOrders")}</Button>
                            <Button onClick={logout} className={styles.authOutlined}>{t("login.logout")}</Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer anchor={isRTL ? "right" : "left"} open={drawerOpen} onClose={closeDrawer} PaperProps={{ className: styles.drawerPaper }}>
                <Box className={styles.drawerHeader}>
                    <Typography variant="h6">🐾 {t("shop.menu")}</Typography>
                    <IconButton onClick={closeDrawer} className={styles.drawerClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider />
                <List className={styles.drawerMenu}>
                    {[{ label: t("shop.home"), path: "/" }, { label: t("shop.catalog"), path: "/catalog" }].map((item) => (
                        <ListItem key={item.path} disablePadding>
                            <ListItemButton component={RouterLink} to={item.path} onClick={closeDrawer}>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List className={styles.drawerAuth}>
                    {(!token ? [{ label: t("login.title"), path: "/login" }, { label: t("register.title"), path: "/register" }] : [{ label: t("shop.myOrders"), path: "/my-orders" }]).map((item) => (
                        <ListItem key={item.path} disablePadding>
                            <ListItemButton component={RouterLink} to={item.path} onClick={closeDrawer}>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    {token && <ListItem disablePadding><ListItemButton onClick={handleLogout}><ListItemText primary={t("login.logout")} /></ListItemButton></ListItem>}
                </List>
                <Divider />
                <Box className={styles.drawerLanguage}><LanguageSwitcher /></Box>
            </Drawer>
        </>
    );
}
