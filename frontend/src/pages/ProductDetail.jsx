// src/pages/ProductDetail.jsx
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { fetchProductById } from "../api";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");
    const [qty, setQty] = useState(1);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const p = await fetchProductById(id);
                if (!cancelled) setProduct(p);
            } catch (e) {
                console.error(e);
                if (!cancelled) setError("לא נמצא מוצר");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => (cancelled = true);
    }, [id]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 6, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error || !product) {
        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Alert severity="error">{error || "אירעה שגיאה"}</Alert>
                <Button component={Link} to="/catalog" sx={{ mt: 2 }} variant="outlined">
                    חזרה לקטלוג
                </Button>
            </Container>
        );
    }

    const { name, description, price, stock, image_url, category_id } = product;

    const onAddToCart = () => {
        if (!product) return;
        const safe = Math.max(1, Number(qty) || 1);
        addToCart(
            {
                id: product.id,
                name: product.name,
                price: Number(product.price || 0),
                image_url: product.image_url,
            },
            safe
        );
    };

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            borderRadius: 3,
                            overflow: "hidden",
                            boxShadow: 2,
                            aspectRatio: "1 / 1",
                            bgcolor: "#fafafa",
                        }}
                    >
                        <img
                            src={image_url || "https://placehold.co/800x800?text=PetStore"}
                            alt={name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h4" sx={{ fontWeight: 900 }}>
                        {name}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>
                        ₪{Number(price || 0).toFixed(2)}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ mt: 1 }}
                        color={Number(stock || 0) > 0 ? "success.main" : "error.main"}
                    >
                        {Number(stock || 0) > 0 ? `במלאי (${stock})` : "חסר במלאי"}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                        {description || "—"}
                    </Typography>

                    <Box sx={{ mt: 3, display: "flex", gap: 2, alignItems: "center" }}>
                        <TextField
                            label="כמות"
                            type="number"
                            size="small"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            inputProps={{ min: 1, max: 999 }}
                            sx={{ width: 120 }}
                        />
                        <Button
                            variant="contained"
                            size="large"
                            onClick={onAddToCart}
                            disabled={Number(stock || 0) <= 0}
                        >
                            הוסף לעגלה
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => (window.location.href = "/catalog")}
                        >
                            חזרה לקטלוג
                        </Button>
                    </Box>

                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="subtitle2" color="text.secondary">
                                קטגוריה: {category_id ?? "—"}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                                מזהה מוצר: {id}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
