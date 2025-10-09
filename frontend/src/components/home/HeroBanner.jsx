import React from "react";
import Slider from "react-slick";
import styles from "./HomeSections.module.scss";

export default function HeroBanner({ banners = [] }) {
    if (!Array.isArray(banners) || banners.length === 0) return null;

    const sliderSettings = {
        dots: true, arrows: false, infinite: true, speed: 500,
        slidesToShow: 1, slidesToScroll: 1,
        autoplay: banners.length > 1, autoplaySpeed: 4500, pauseOnHover: true
    };

    return (
        <section className={styles.hero}>
            {banners.length > 1 ? (
                <Slider {...sliderSettings}>
                    {banners.map(b => (
                        <a key={b.id} className={styles.heroSlide} href={b.link_url || "#"}>
                            <img src={b.image_url} alt={b.title || "Banner"} />
                        </a>
                    ))}
                </Slider>
            ) : (
                <div className={styles.heroBanner}>
                    <a href={banners[0].link_url || "#"}>
                        <img src={banners[0].image_url} alt={banners[0].title || "Banner"} />
                    </a>
                </div>
            )}
        </section>
    );
}
