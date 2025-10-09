import React from "react";
import Slider from "react-slick";
import styles from "./HomeSections.module.scss";

export default function BrandSlider({ title, brands = [] }) {
    if (!brands?.length) return null;

    const settings = {
        dots: false, arrows: true, infinite: false, speed: 400,
        slidesToShow: 6, slidesToScroll: 6,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 5, slidesToScroll: 5 } },
            { breakpoint: 960, settings: { slidesToShow: 4, slidesToScroll: 4 } },
            { breakpoint: 640, settings: { slidesToShow: 3, slidesToScroll: 3 } }
        ]
    };

    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2>{title}</h2>
            </div>

            <Slider {...settings} className={styles.brandsSlider}>
                {brands.map((b, i) => (
                    <div key={i} className={styles.brandTile}>
                        <img src={b.logo} alt={b.name} />
                    </div>
                ))}
            </Slider>
        </section>
    );
}
