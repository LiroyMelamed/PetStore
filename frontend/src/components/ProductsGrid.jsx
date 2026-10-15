// frontend/src/components/ProductsGrid.jsx
import * as React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ProductCard from "./ProductCard";
import styles from "./ProductsGrid.module.scss";

export default function ProductsGrid({ title, products = [], onItemClick }) {
    if (!products?.length) return null;

    return (
        <div className={styles.container}>
            {title && (
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                    {title}
                </Typography>
            )}

            <div className={styles.grid}>
                {products.map((p) => (
                    <div key={p.id} className={styles.gridItem}>
                        <ProductCard product={p} onClick={() => onItemClick?.(p)} />
                    </div>
                ))}
            </div>
        </div>
    );
}
