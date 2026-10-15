import React, { useEffect, useState } from "react";
import { fetchBanners, fetchFeaturedProducts, fetchProducts, fetchCategories } from "../api";
import { useTranslation } from "react-i18next";
import useSEO, { generateOrganizationSchema } from "../hooks/useSEO";
import { SEOSection, SEOMeta } from "../components/SEO";
import HeroBanner from "../components/home/HeroBanner";
import ProductSlider from "../components/home/ProductSlider";
import CategorySlider from "../components/home/CategorySlider";
import BrandSlider from "../components/home/BrandSlider";
import HomeFooter from "../components/home/HomeFooter";
import "../styles/HomePage.scss";

export default function HomePage() {
    const { t, i18n } = useTranslation();
    const [banners, setBanners] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    // SEO hook for homepage
    useSEO({
        title: "Home",
        description: t("seo.home_description", "Welcome to PetStore - Your trusted online pet store for quality pet products, food, toys, and supplies for dogs, cats, and other pets."),
        keywords: t("seo.home_keywords", "pet store, pet products, dog food, cat food, pet toys, pet supplies, online pet shop"),
        canonical: window.location.origin,
        ogTitle: "PetStore - Quality Pet Products & Supplies",
        ogDescription: t("seo.home_description", "Welcome to PetStore - Your trusted online pet store for quality pet products, food, toys, and supplies for dogs, cats, and other pets."),
        ogImage: `${window.location.origin}/og-image-home.png`,
        ogType: "website",
        structuredData: generateOrganizationSchema()
    });

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const [bannersData, featuredData, allProducts, cats] = await Promise.all([
                    fetchBanners(),
                    fetchFeaturedProducts(),
                    fetchProducts(),
                    fetchCategories()
                ]);
                if (ignore) return;
                setBanners(Array.isArray(bannersData) ? bannersData : []);
                setFeatured(Array.isArray(featuredData) ? featuredData : []);
                const all = Array.isArray(allProducts) ? allProducts : [];
                setNewProducts(all.slice(0, 12));
                setCategories(Array.isArray(cats) ? cats : []);
            } catch (e) {
                console.error(e);
            }
        })();
        return () => { ignore = true; };
    }, []);

    const goToProduct = (p) => (window.location.href = `/product/${p.id}`);
    const goToCategory = (c) => (window.location.href = `/catalog?category=${c.id}`);

    const brands = [
        { name: "Royal Canin", logo: "https://catandog.co.il/wp-content/uploads/2022/11/2.png" },
        { name: "Purina", logo: "https://www.purina.eu/sites/default/files/2024-06/purina-logo-new.png" },
        { name: "Acana", logo: "https://www.modernk9.ca/cdn/shop/collections/acana_1_460x@2x.png?v=1738528153" }
    ];

    const recommended = featured.slice(0, 12);
    const moreNew = newProducts.slice(0, 12);

    return (
        <main className="home" role="main">
            {/* 1) Banner - Hero Section */}
            <header className="hero">
                <HeroBanner banners={banners} />
            </header>

            {/* 2) Featured Products */}
            <section className="featured-section" aria-labelledby="featured-title">
                <h2 id="featured-title">{t("home.featured_title", "Featured Products")}</h2>
                <ProductSlider
                    products={featured}
                    onItemClick={goToProduct}
                />
            </section>

            {/* 3) Categories slider (icons + cubes) */}
            <section className="categories-section" aria-labelledby="categories-title">
                <h2 id="categories-title">{t("home.categories_title", "Shop by Category")}</h2>
                <CategorySlider
                    categories={categories}
                    onCategoryClick={goToCategory}
                />
            </section>

            {/* 4) New Arrivals */}
            <section className="new-arrivals-section" aria-labelledby="new-arrivals-title">
                <h2 id="new-arrivals-title">{t("home.new_arrivals", "New Arrivals")}</h2>
                <ProductSlider
                    products={moreNew}
                    onItemClick={goToProduct}
                />
            </section>

            {/* 5) Recommended Products */}
            <section className="recommended-section" aria-labelledby="recommended-title">
                <h2 id="recommended-title">{t("home.recommended_title", "Recommended for You")}</h2>
                <ProductSlider
                    products={recommended}
                    onItemClick={goToProduct}
                />
            </section>

            {/* 6) Top Brands */}
            <section className="brands-section" aria-labelledby="brands-title">
                <h2 id="brands-title">{t("home.top_brands", "Top Brands")}</h2>
                <BrandSlider brands={brands} />
            </section>

            {/* Footer */}
            <footer>
                <HomeFooter />
            </footer>
        </main>
    );
}
