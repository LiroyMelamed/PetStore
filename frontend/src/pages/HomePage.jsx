import React, { useEffect, useState } from "react";
import { fetchBanners, fetchFeaturedProducts, fetchProducts, fetchCategories } from "../api";
import { useTranslation } from "react-i18next";
import HeroBanner from "../components/home/HeroBanner";
import ProductSlider from "../components/home/ProductSlider";
import CategorySlider from "../components/home/CategorySlider";
import BrandSlider from "../components/home/BrandSlider";
import HomeFooter from "../components/home/HomeFooter";

export default function HomePage() {
    const { t } = useTranslation();
    const [banners, setBanners] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const [categories, setCategories] = useState([]);

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
        <div className="home">
            {/* 1) Banner */}
            <HeroBanner banners={banners} />

            {/* 2) Featured */}
            <ProductSlider
                title={t("home.featured_title", "Featured Products")}
                products={featured}
                onItemClick={goToProduct}
            />

            {/* 3) Categories slider (icons + cubes) */}
            <CategorySlider
                title={t("home.categories_title", "Shop by Category")}
                categories={categories}
                onCategoryClick={goToCategory}
            />

            {/* 4) More sliders: New arrivals, Recommended, Top brands */}
            <ProductSlider
                title={t("home.new_arrivals", "New Arrivals")}
                products={moreNew}
                onItemClick={goToProduct}
            />
            <ProductSlider
                title={t("home.recommended_title", "Recommended for You")}
                products={recommended}
                onItemClick={goToProduct}
            />
            <BrandSlider
                title={t("home.top_brands", "Top Brands")}
                brands={brands}
            />

            {/* Footer */}
            <HomeFooter />
        </div>
    );
}
