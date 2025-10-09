import React from "react";
import Slider from "react-slick";
import styles from "./HomeSections.module.scss";
import { useTranslation } from "react-i18next";

const iconFor = (name = "") => {
    const n = name.toLowerCase();
    if (n.includes("dog")) return "🐶";
    if (n.includes("cat")) return "🐱";
    if (n.includes("bird")) return "🦜";
    if (n.includes("fish") || n.includes("aqu")) return "🐠";
    if (n.includes("toy")) return "🧸";
    if (n.includes("food") || n.includes("treat")) return "🍖";
    if (n.includes("access")) return "🎒";
    return "📦";
};

export default function CategorySlider({ title, categories = [], onCategoryClick, includeAll, onAllClick }) {
    const { t } = useTranslation();
    if (!categories?.length) return null;

    const settings = {
        dots: false, arrows: true, infinite: false, speed: 400,
        slidesToShow: 8, slidesToScroll: 8,
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 6, slidesToScroll: 6 } },
            { breakpoint: 960, settings: { slidesToShow: 5, slidesToScroll: 5 } },
            { breakpoint: 640, settings: { slidesToShow: 4, slidesToScroll: 4 } }
        ]
    };

    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2>{title}</h2>
            </div>

            <Slider {...settings} className={styles.categoriesSlider}>
                {includeAll && (
                    <div className={styles.catSlide}>
                        <div className={styles.categoryCube} onClick={() => onAllClick?.()}>
                            <div className={styles.categoryIcon}>🌐</div>
                            <div className={styles.categoryName}>{t("common.all_option", "All")}</div>
                        </div>
                    </div>
                )}
                {categories.map(c => (
                    <div key={c.id} className={styles.catSlide}>
                        <div className={styles.categoryCube} onClick={() => onCategoryClick?.(c)}>
                            <div className={styles.categoryIcon}>{iconFor(c.name)}</div>
                            <div className={styles.categoryName} title={c.name}>{c.name}</div>
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
}
