import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { fetchCategories, fetchProducts, fetchProductsByCategory } from "../api";
import { Container, Grid, Paper, MenuItem, TextField, Typography, Button } from "@mui/material";

export default function Catalog() {
    const [params, setParams] = useSearchParams();
    const [cats, setCats] = useState([]);
    const [items, setItems] = useState([]);
    const catId = params.get("category");

    useEffect(() => { fetchCategories().then(setCats); }, []);
    useEffect(() => {
        if (catId) fetchProductsByCategory(catId).then(setItems);
        else fetchProducts().then(setItems);
    }, [catId]);

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>קטלוג</Typography>
            <TextField
                select label="קטגוריה" size="small" sx={{ mb: 3, minWidth: 240 }}
                value={catId || ""} onChange={(e) => {
                    const v = e.target.value || null;
                    if (v) params.set("category", v); else params.delete("category");
                    setParams(params, { replace: true });
                }}>
                <MenuItem value="">הכל</MenuItem>
                {cats.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </TextField>

            <Grid container spacing={2}>
                {items.map(p => (
                    <Grid item xs={12} sm={6} md={3} key={p.id}>
                        <Paper sx={{ p: 2 }}>
                            <Typography variant="subtitle1" noWrap>{p.name}</Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>{p.description}</Typography>
                            <Typography sx={{ my: 1 }}><b>{Number(p.price).toFixed(2)} ₪</b></Typography>
                            <Button component={Link} to={`/product/${p.id}`} fullWidth variant="contained">למוצר</Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
