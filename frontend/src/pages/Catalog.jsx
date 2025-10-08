import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";

import { fetchCategories, fetchProducts, fetchCategoryProducts } from "../api";
import CategorySelect from "../components/CategorySelect";
import PriceRange from "../components/PriceRange";
import StockToggle from "../components/StockToggle";
import ProductsGrid from "../components/ProductsGrid";

export default function Catalog() {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [categoryId, setCategoryId] = useState(null);
    const [price, setPrice] = useState([0, 2000]);
    const [query, setQuery] = useState("");
    const [inStockOnly, setInStockOnly] = useState(false);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);
                if (!cancelled) {
                    setCategories(cats || []);
                    setAllProducts(prods || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => (cancelled = true);
    }, []);

    // טען מוצרים לפי קטגוריה כשמשנים אותה
    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!categoryId) return; // חוזרים לרשימה הקודמת אם categoryId ריק
            try {
                setLoading(true);
                const items = await fetchCategoryProducts(categoryId);
                if (!cancelled) setAllProducts(items || []);
            } catch (e) {
                console.error(e);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => (cancelled = true);
    }, [categoryId]);

    const filtered = useMemo(() => {
        let items = allProducts || [];
        const [min, max] = price;
        if (query.trim()) {
            const q = query.trim().toLowerCase();
            items = items.filter(
                (p) =>
                    String(p.name || "").toLowerCase().includes(q) ||
                    String(p.description || "").toLowerCase().includes(q)
            );
        }
        items = items.filter((p) => {
            const pr = Number(p.price || 0);
            return pr >= Number(min || 0) && pr <= Number(max || 0);
        });
        if (inStockOnly) {
            items = items.filter((p) => Number(p.stock || 0) > 0);
        }
        return items;
    }, [allProducts, price, query, inStockOnly]);

    const resetFilters = async () => {
        setCategoryId(null);
        setPrice([0, 2000]);
        setQuery("");
        setInStockOnly(false);
        try {
            setLoading(true);
            const prods = await fetchProducts();
            setAllProducts(prods || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const goToProduct = (p) => (window.location.href = `/product/${p.id}`);

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
                קטלוג
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", mb: 2 }}>
                <CategorySelect categories={categories} value={categoryId} onChange={setCategoryId} />
                <PriceRange value={price} onChange={setPrice} />
                <TextField
                    size="small"
                    label="חיפוש"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    sx={{ minWidth: 220 }}
                />
                <StockToggle checked={inStockOnly} onChange={setInStockOnly} />
                <Box sx={{ flex: 1 }} />
                <Button variant="outlined" onClick={resetFilters}>נקה סינונים</Button>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        נמצאו {filtered.length} מוצרים
                    </Typography>
                    <ProductsGrid products={filtered} onItemClick={goToProduct} />
                </>
            )}
        </Container>
    );
}
