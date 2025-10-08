import "../../styles/admin-base.scss";
import { Link, Outlet } from "react-router-dom";
import s from "./AdminLayout.module.scss";
import useDirection from "../../hooks/useDirection";
import { useTranslation } from "react-i18next";

export default function AdminLayout() {
    useDirection();
    const { t } = useTranslation();

    return (
        <div className={s.wrapper}>
            <aside className={s.sidebar}>
                <h2 className={s.brand}>🐶 PetStore Admin</h2>
                <div className={s.sub}>{t("dashboard.welcome_message")}</div>
                <nav className={s.nav}>
                    <Link to="/admin">{t("dashboard.title")}</Link>
                    <Link to="orders">{t("dashboard.menu.orders")}</Link>
                    <Link to="users">{t("dashboard.menu.manage_admins")}</Link>
                    <Link to="products">{t("dashboard.menu.products")}</Link>
                    <Link to="categories">{t("dashboard.menu.categories")}</Link>
                    <Link to="banners">{t("admin.nav.banners")}</Link>
                </nav>
            </aside>
            <main className={s.main}>
                <Outlet />
            </main>
        </div>
    );
}
