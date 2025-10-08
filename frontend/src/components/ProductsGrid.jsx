// frontend/src/components/ProductsGrid.jsx
import * as React from "react";
import Grid from "@mui/material/Grid";           // ✅ במקום Grid2
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import ProductCard from "./ProductCard";

export default function ProductsGrid({ title, products = [], onItemClick }) {
    if (!products?.length) return null;

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {title && (
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>
                    {title}
                </Typography>
            )}

            <Grid container spacing={2}>
                {products.map((p) => (
                    <Grid key={p.id} item xs={12} sm={6} md={4} lg={3}>
                        <ProductCard product={p} onClick={() => onItemClick?.(p)} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
