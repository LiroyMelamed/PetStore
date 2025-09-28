import React, { useEffect, useState } from "react";
import { fetchBanners, fetchFeaturedProducts, fetchProducts } from "../api";
import "../styles/HomePage.scss";

const HomePage = () => {
    const [banners, setBanners] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [newProducts, setNewProducts] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const bannersData = await fetchBanners();
                const featuredData = await fetchFeaturedProducts();
                const allProducts = await fetchProducts();

                setBanners(bannersData || []);
                setFeatured(featuredData || []);
                setNewProducts(allProducts?.slice(0, 8) || []);
            } catch (err) {
                console.error("Error loading homepage data:", err);
            }
        };
        loadData();
    }, []);

    return (
        <div className="homepage">
            {/* Hero Banner */}
            <section className="hero">
                {banners.length > 0 && (
                    <div className="hero-banner">
                        <img src={banners[0].image_url} alt={banners[0].title} />
                        <div className="hero-content">
                            <h1>{banners[0].title}</h1>
                            <p>{banners[0].subtitle}</p>
                            <button className="cta-btn">קנה עכשיו</button>
                        </div>
                    </div>
                )}
            </section>

            {/* USPs */}
            <section className="usp">
                <div className="usp-item">🚚 משלוח חינם מעל 199₪</div>
                <div className="usp-item">⭐ מוצרים איכותיים בלבד</div>
                <div className="usp-item">📞 שירות לקוחות 24/7</div>
            </section>

            {/* Featured Products */}
            <section className="products-section">
                <h2>מוצרים מומלצים</h2>
                <div className="products-grid">
                    {featured.map((p) => (
                        <div className="product-card" key={p.id}>
                            <img src={p.image_url} alt={p.name} />
                            <h3>{p.name}</h3>
                            <p>{p.price} ₪</p>
                            <button>הוסף לעגלה</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mid Banner */}
            <section className="mid-banner">
                <div className="mid-banner-content">
                    <h2>30% הנחה בהזמנה ראשונה!</h2>
                    <button className="cta-btn">לפרטים</button>
                </div>
            </section>

            {/* New Products */}
            <section className="products-section">
                <h2>מוצרים חדשים</h2>
                <div className="products-grid">
                    {newProducts.map((p) => (
                        <div className="product-card" key={p.id}>
                            <img src={p.image_url} alt={p.name} />
                            <h3>{p.name}</h3>
                            <p>{p.price} ₪</p>
                            <button>הוסף לעגלה</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Brands */}
            <section className="brands">
                <h2>מותגים נבחרים</h2>
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
