import React, { useEffect, useState } from "react";
import { fetchBanners, fetchFeaturedProducts, fetchProducts } from "../api";
import "../styles/HomePage.scss";
import ProductsGrid from "../components/ProductsGrid";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";

const HomePage = () => {
    const { t } = useTranslation();
    const [banners, setBanners] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [newProducts, setNewProducts] = useState([]);

    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const [bannersData, featuredData, allProducts] = await Promise.all([
                    fetchBanners(),
                    fetchFeaturedProducts(),
                    fetchProducts(),
                ]);
                if (ignore) return;
                setBanners(Array.isArray(bannersData) ? bannersData : []);
                setFeatured(Array.isArray(featuredData) ? featuredData : []);
                setNewProducts((Array.isArray(allProducts) ? allProducts : []).slice(0, 12));
            } catch (e) {
                console.error(e);
            }
        })();
        return () => { ignore = true; };
    }, []);

    const goToProduct = (p) => (window.location.href = `/product/${p.id}`);

    const sliderSettings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: banners.length > 1,
        autoplaySpeed: 4500,
        pauseOnHover: true,
    };

    return (
        <div className="home">
            {/* HERO */}
            {banners?.length > 0 && (
                <section className="hero">
                    {banners.length > 1 ? (
                        <Slider {...sliderSettings}>
                            {banners.map((b) => (
                                <a key={b.id} className="hero-slide" href={b.link_url || "#"}>
                                    <img src={b.image_url} alt={b.title || "Banner"} />
                                </a>
                            ))}
                        </Slider>
                    ) : (
                        <div className="hero-banner">
                            <a href={banners[0].link_url || "#"}>
                                <img src={banners[0].image_url} alt={banners[0].title || "Banner"} />
                            </a>
                        </div>
                    )}
                </section>
            )}

            {/* Featured */}
            <ProductsGrid
                title={t("home.featured_title", "Featured Products")}
                products={featured}
                onItemClick={goToProduct}
            />

            {/* New Arrivals */}
            <ProductsGrid
                title={t("home.new_arrivals", "New Arrivals")}
                products={newProducts}
                onItemClick={goToProduct}
            />

            {/* Brands */}
            <section className="brands">
                <h2>{t("home.selected_brands", "Selected Brands")}</h2>
                <div className="brands-logos">
                    <img src="https://catandog.co.il/wp-content/uploads/2022/11/2.png" alt="Royal Canin" />
                    <img src="https://www.purina.eu/sites/default/files/2024-06/purina-logo-new.png" alt="Purina" />
                    <img src="https://www.modernk9.ca/cdn/shop/collections/acana_1_460x@2x.png?v=1738528153" alt="Acana" />
                </div>
            </section>
        </div>
    );
};

export default HomePage;
