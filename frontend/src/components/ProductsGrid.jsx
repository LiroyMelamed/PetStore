// frontend/src/components/ProductsGrid.jsx
import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
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

            {/* stretch rows so all items get equal height */}
            <Grid container spacing={2} alignItems="stretch" justifyContent={"center"}>
                {products.map((p) => (
                    <Grid
                        key={p.id}
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        sx={{ display: "flex" }}   // let child fill the cell
                    >
                        <Box sx={{ width: "100%" }}>
                            <ProductCard product={p} onClick={() => onItemClick?.(p)} />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
