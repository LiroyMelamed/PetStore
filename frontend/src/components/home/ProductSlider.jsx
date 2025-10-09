import React from "react";
import Slider from "react-slick";
import styles from "./HomeSections.module.scss";
import { useTranslation } from "react-i18next";

export default function ProductSlider({ title, products = [], onItemClick }) {
    const { t } = useTranslation();

    console.log('Rendering ProductSlider with products:', products);

    if (!products?.length) return null;

    const settings = {
        dots: false, arrows: true, infinite: false, speed: 400,
        slidesToShow: 5, slidesToScroll: 5,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 4 } },
            { breakpoint: 960, settings: { slidesToShow: 3, slidesToScroll: 3 } },
            { breakpoint: 640, settings: { slidesToShow: 2, slidesToScroll: 2 } }
        ]
    };



    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2>{title}</h2>
            </div>

            <Slider {...settings} className={styles.productsSlider}>
                {products.map(p => (
                    <div key={p.id} className={styles.productCard} onClick={() => onItemClick?.(p)}>
                        <div className={styles.productThumb}>
                            <img src={p.image_url || p.image || "/placeholder.png"} alt={p.name} />
                        </div>
                        <div className={styles.productInfo}>
                            <div className={styles.productName} title={p.name}>{p.name}</div>
                            <div className={styles.productPrice}>
                                {typeof p.price === "number" ? p.price.toFixed(2) : (p.price ?? 0).toFixed?.(2) ?? p.price}
                                <span className={styles.currency}>₪</span>
                            </div>
                            <button className="btn btn--primary">{t("common.add_button", "Add")}</button>
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
}
