// src/components/RelatedProducts.jsx
import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { fetchCategoryProducts } from "../api";

export default function RelatedProducts({ categoryId, currentId }) {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [err, setErr] = useState("");

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                setErr("");
                const data = await fetchCategoryProducts(categoryId);
                const filtered = (data || []).filter((p) => String(p.id) !== String(currentId));
                if (!cancelled) setItems(filtered.slice(0, 6)); // עד 6 פריטים
            } catch (e) {
                if (!cancelled) setErr("לא ניתן לטעון מוצרים קשורים כרגע.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => (cancelled = true);
    }, [categoryId, currentId]);

    if (loading) return <Box sx={{ py: 2 }}><CircularProgress size={20} /></Box>;
    if (err) return <Alert severity="info">{err}</Alert>;
    if (!items.length) return <Typography variant="body2" color="text.secondary">אין מוצרים קשורים.</Typography>;

    return (
        <Grid container spacing={2}>
            {items.map((p) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
                    <Card sx={{ height: "100%" }}>
                        <CardActionArea component={RouterLink} to={`/product/${p.id}`} sx={{ height: "100%" }}>
                            <CardMedia
                                component="img"
                                image={p.image_url || "https://placehold.co/600x600?text=PetStore"}
                                alt={p.name}
                                sx={{ aspectRatio: "1 / 1", objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }} noWrap>
                                    {p.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ₪{Number(p.price || 0).toFixed(2)}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}
