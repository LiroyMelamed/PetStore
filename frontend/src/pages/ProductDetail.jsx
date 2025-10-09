import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { fetchProductById, fetchProducts } from "../api";
import { useCart } from "../context/CartContext";
import styles from "./ProductDetail.module.scss";
import ProductSlider from "../components/home/ProductSlider";

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");
    const [qty, setQty] = useState(1);
    const [recommended, setRecommended] = useState([]);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const p = await fetchProductById(id);
                const all = await fetchProducts();
                if (!cancelled) {
                    setProduct(p);
                    // simple "you may also like" – same category first, excluding current
                    const rec = (Array.isArray(all) ? all : [])
                        .filter(x => x.id !== Number(id))
                        .sort((a, b) => (a.category_id === p?.category_id ? -1 : 1))
                        .slice(0, 12);
                    setRecommended(rec);
                }
            } catch (e) {
                console.error(e);
                if (!cancelled) setError("לא נמצא מוצר");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
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
        <Container maxWidth="lg" className={styles.page}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <Link to="/">בית</Link>
                <span className="sep">/</span>
                <Link to="/catalog">קטלוג</Link>
                <span className="sep">/</span>
                <span>{name}</span>
            </div>

            {/* Hero section: content + image */}
            <Grid container spacing={{ xs: 2, sm: 3 }} alignItems="flex-start" className={styles.heroGrid}>                {/* Content (RTL: place it left by default; fine on both directions) */}
                <Grid item xs={12} sm={6} order={{ xs: 2, sm: 1 }}>
                    <Typography variant="h4" className={styles.title}>{name}</Typography>
                    <div className={styles.priceRow}>
                        <div className={styles.price}>
                            <span className={styles.currency}>₪</span>
                            {Number(price || 0).toFixed(2)}
                        </div>
                        <span className={Number(stock || 0) > 0 ? styles.stockOk : styles.stockBad}>
                            {Number(stock || 0) > 0 ? `במלאי (${stock})` : "חסר במלאי"}
                        </span>
                    </div>

                    <div className={styles.qtyRow}>
                        <TextField
                            label="כמות"
                            type="number"
                            size="small"
                            value={qty}
                            onChange={(e) => setQty(e.target.value)}
                            inputProps={{ min: 1, max: 999 }}
                            className={styles.qtyInput}
                        />
                    </div>

                    <div className={styles.actionsRow}>
                        <button className={styles.addBtn + " btn btn--primary"} onClick={onAddToCart} disabled={Number(stock || 0) <= 0}>
                            הוסף לעגלה
                        </button>
                        <button className={styles.backBtn + " btn"} onClick={() => (window.location.href = "/catalog")}>
                            חזרה לקטלוג
                        </button>
                    </div>

                    {/* Small info card (sku / category) */}
                    <Card className={styles.infoCard} elevation={0}>
                        <CardContent sx={{ p: 0 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                קטגוריה: {category_id ?? "—"}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                                מזהה מוצר: {id}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Benefits row (like the reference) */}
                    <div className={styles.benefits}>
                        <div className={styles.benefit}>
                            <div className={styles.icon}>🚚</div>
                            <div>
                                <div className={styles.bTitle}>משלוח מהיר</div>
                                <div className={styles.bDesc}>עד 2–4 ימי עסקים לכל הארץ</div>
                            </div>
                        </div>
                        <div className={styles.benefit}>
                            <div className={styles.icon}>🔄</div>
                            <div>
                                <div className={styles.bTitle}>החזרה קלה</div>
                                <div className={styles.bDesc}>14 ימים החזרה/החלפה לפי התקנון</div>
                            </div>
                        </div>
                        <div className={styles.benefit}>
                            <div className={styles.icon}>🛡️</div>
                            <div>
                                <div className={styles.bTitle}>קנייה בטוחה</div>
                                <div className={styles.bDesc}>תשלום מאובטח והגנת לקוח</div>
                            </div>
                        </div>
                    </div>

                    {/* Details sections (like how-to, warranty, notes) */}
                    <div className={styles.details}>
                        <details open>
                            <summary>תיאור המוצר</summary>
                            <p>{description || "—"}</p>
                        </details>
                        <details>
                            <summary>מידע משלוחים</summary>
                            <ul>
                                <li>משלוח עד הבית: 2–4 ימי עסקים.</li>
                                <li>איסוף עצמי: הודעה כשההזמנה מוכנה.</li>
                            </ul>
                        </details>
                        <details>
                            <summary>החזרות והחלפות</summary>
                            <ul>
                                <li>ניתן להחזיר מוצר סגור עד 14 ימים.</li>
                                <li>אחריות יצרן מלאה לפי תנאי הספק.</li>
                            </ul>
                        </details>
                    </div>
                </Grid>

                {/* Image */}
                <Grid item xs={12} sm={6} order={{ xs: 1, sm: 2 }}>
                    <Box className={styles.imageWrap}>
                        <img
                            src={image_url || "https://placehold.co/1000x800?text=PetShop"}
                            alt={name}
                        />
                    </Box>
                </Grid>
            </Grid>

            {/* Recommended products */}
            {recommended?.length > 0 && (
                <>
                    <div className={styles.recoHeader}>
                        <h2>מוצרים שיכולים לעניין אותך</h2>
                    </div>
                    <ProductSlider
                        title=""
                        products={recommended}
                        onItemClick={(p) => (window.location.href = `/product/${p.id}`)}
                    />
                </>
            )}
        </Container>
    );
}
