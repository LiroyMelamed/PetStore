import React from "react";
import styles from "./HomeSections.module.scss";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function HomeFooter() {
    const { t } = useTranslation();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerGrid}>
                <div>
                    <div className={styles.footerBrand}>🐾 PetShop</div>
                    <p className={styles.footerDesc}>
                        {t("home.welcome_sub", "Great deals for your best friends")}
                    </p>
                </div>

                <div>
                    <div className={styles.footerTitle}>{t("footer.shop", "Shop")}</div>
                    <ul>
                        <li><Link to="/catalog">{t("shop.catalog", "Catalog")}</Link></li>
                        <li><Link to="/my-orders">{t("shop.myOrders", "My Orders")}</Link></li>
                        <li><Link to="/cart">{t("shop.cart", "Cart")}</Link></li>
                    </ul>
                </div>

                <div>
                    <div className={styles.footerTitle}>{t("footer.company", "Company")}</div>
                    <ul>
                        <li><Link to="/about">{t("footer.about", "About us")}</Link></li>
                        <li><Link to="/contact">{t("footer.contact", "Contact us")}</Link></li>
                        <li><Link to="/careers">{t("footer.careers", "Careers")}</Link></li>
                    </ul>
                </div>

                <div>
                    <div className={styles.footerTitle}>{t("footer.legal", "Legal")}</div>
                    <ul>
                        <li><Link to="/terms">{t("footer.terms", "Terms & Conditions")}</Link></li>
                        <li><Link to="/privacy">{t("footer.privacy", "Privacy Policy")}</Link></li>
                        <li><Link to="/shipping">{t("footer.shipping", "Shipping & Returns")}</Link></li>
                    </ul>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <span>© {new Date().getFullYear()} PetShop</span>
                <span>{t("footer.rights", "All rights reserved.")}</span>
            </div>
        </footer>
    );
}
