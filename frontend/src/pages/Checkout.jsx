// src/pages/Checkout.jsx
import React, { useMemo, useState } from "react";
import {
    Container, Grid, Card, CardContent, Typography, TextField, Box,
    Button, Divider, Alert, Checkbox, FormControlLabel, MenuItem
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { checkout as checkoutApi } from "../api";

const initialAddress = {
    country: "Israel",
    city: "",
    street: "",
    house_no: "",
    postal_code: "",
};

export default function Checkout() {
    const navigate = useNavigate();
    const { items, subtotal, total, clearCart } = useCart();
    const { token } = useAuth();

    const [shipping, setShipping] = useState({ ...initialAddress });
    const [billing, setBilling] = useState({ ...initialAddress });
    const [sameAsShipping, setSameAsShipping] = useState(true);

    const [currency, setCurrency] = useState("ILS");
    const [discountCode, setDiscountCode] = useState("");
    const [shippingMethod, setShippingMethod] = useState("standard");

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [ok, setOk] = useState("");

    const disabled = useMemo(() => {
        const s = shipping || {};
        const b = sameAsShipping ? shipping : billing || {};
        const requiredFilled = (addr) =>
            addr.country && addr.city && addr.street && addr.house_no;
        return (
            !items.length ||
            !requiredFilled(s) ||
            !requiredFilled(b) ||
            !token ||
            loading
        );
    }, [items.length, shipping, billing, sameAsShipping, token, loading]);

    const handleChange = (setter) => (e) => {
        const { name, value } = e.target;
        setter((p) => ({ ...p, [name]: value }));
    };

    const onSubmit = async () => {
        setErr(""); setOk("");
        try {
            setLoading(true);

            const payload = {
                currency,
                discount_code: discountCode || undefined,
                shipping_method: shippingMethod,
                items: items.map((i) => ({
                    product_id: i.id,
                    qty: Number(i.qty || 1),
                    unit_price: Number(i.price || 0),
                })),
                shipping_address: {
                    country: shipping.country,
                    city: shipping.city,
                    street: shipping.street,
                    house_no: shipping.house_no,
                    postal_code: shipping.postal_code || "",
                },
                billing_address: sameAsShipping
                    ? { ...shipping }
                    : { ...billing },
            };

            const data = await checkoutApi(payload);
            const order = data?.order || data;
            const orderId = order?.id ?? order?.order_id ?? null;

            setOk("הזמנה נקלטה בהצלחה");
            clearCart();

            // מעבירים גם pricing ל-state של מסך ההצלחה/פרטים
            const pricing = data?.pricing || null;
            if (orderId) {
                navigate(`/order-success/${orderId}`, { state: { order, pricing } });
            } else {
                navigate(`/order-success`, { state: { order, pricing } });
            }
        } catch (e) {
            const msg =
                e?.error || e?.message || (typeof e === "string" ? e : "שגיאה בתהליך התשלום");
            setErr(String(msg));
        } finally {
            setLoading(false);
        }
    };

    if (!items.length) {
        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Alert severity="info" sx={{ mb: 2 }}>העגלה ריקה—אין מה לשלם.</Alert>
                <Button variant="contained" component={RouterLink} to="/catalog">
                    חזרה לקטלוג
                </Button>
            </Container>
        );
    }

    if (!token) {
        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    כדי לבצע הזמנה יש להתחבר.
                </Alert>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button variant="outlined" component={RouterLink} to="/login">
                        התחברות
                    </Button>
                    <Button variant="contained" component={RouterLink} to="/register">
                        הרשמה
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
                תשלום
            </Typography>

            {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
            {ok && <Alert severity="success" sx={{ mb: 2 }}>{ok}</Alert>}

            <Grid container spacing={3}>
                {/* פרטי משלוח/חיוב */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                                פרטי משלוח
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField label="מדינה" name="country" fullWidth value={shipping.country} onChange={handleChange(setShipping)} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField label="עיר" name="city" fullWidth value={shipping.city} onChange={handleChange(setShipping)} />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField label="רחוב" name="street" fullWidth value={shipping.street} onChange={handleChange(setShipping)} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="מס' בית" name="house_no" fullWidth value={shipping.house_no} onChange={handleChange(setShipping)} />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField label="מיקוד (לא חובה)" name="postal_code" fullWidth value={shipping.postal_code} onChange={handleChange(setShipping)} />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                    פרטי חיוב
                                </Typography>
                                <FormControlLabel
                                    control={<Checkbox checked={sameAsShipping} onChange={(e) => setSameAsShipping(e.target.checked)} />}
                                    label="זהה לכתובת המשלוח"
                                />
                            </Box>

                            {!sameAsShipping && (
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid item xs={12} md={6}>
                                        <TextField label="מדינה" name="country" fullWidth value={billing.country} onChange={handleChange(setBilling)} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField label="עיר" name="city" fullWidth value={billing.city} onChange={handleChange(setBilling)} />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField label="רחוב" name="street" fullWidth value={billing.street} onChange={handleChange(setBilling)} />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField label="מס' בית" name="house_no" fullWidth value={billing.house_no} onChange={handleChange(setBilling)} />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField label="מיקוד (לא חובה)" name="postal_code" fullWidth value={billing.postal_code} onChange={handleChange(setBilling)} />
                                    </Grid>
                                </Grid>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        select
                                        label="שיטת משלוח"
                                        fullWidth
                                        value={shippingMethod}
                                        onChange={(e) => setShippingMethod(e.target.value)}
                                    >
                                        <MenuItem value="pickup">איסוף עצמי (₪0)</MenuItem>
                                        <MenuItem value="standard">משלוח רגיל (₪20 | חינם מעל ₪300)</MenuItem>
                                        <MenuItem value="express">אקספרס (₪40)</MenuItem>
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="קופון (לא חובה)"
                                        fullWidth
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                        placeholder="DOG10 / CAT15 / FREESHIP"
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <TextField
                                        select
                                        label="מטבע"
                                        fullWidth
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                    >
                                        <MenuItem value="ILS">ILS (₪)</MenuItem>
                                        <MenuItem value="USD">USD ($)</MenuItem>
                                        <MenuItem value="EUR">EUR (€)</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* סיכום והגשה */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ position: "sticky", top: 16 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                                סיכום הזמנה
                            </Typography>

                            <Box sx={{ maxHeight: 240, overflow: "auto", pr: 1, mb: 1 }}>
                                {items.map((i) => (
                                    <Box key={i.id} sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                                        <Typography variant="body2" sx={{ maxWidth: "60%" }} noWrap title={i.name}>
                                            {i.name} × {i.qty}
                                        </Typography>
                                        <Typography variant="body2">₪{(Number(i.price || 0) * Number(i.qty || 0)).toFixed(2)}</Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                <Typography>ביניים (עגלה)</Typography>
                                <Typography>₪{subtotal.toFixed(2)}</Typography>
                            </Box>

                            {/* הערה: החישוב הסופי מתבצע בשרת; כאן רק סקיצה לפני שליחה */}
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Typography sx={{ fontWeight: 800 }}>סה״כ (משוער)</Typography>
                                <Typography sx={{ fontWeight: 800 }}>₪{total.toFixed(2)}</Typography>
                            </Box>

                            <Button
                                fullWidth
                                size="large"
                                variant="contained"
                                onClick={onSubmit}
                                disabled={disabled}
                            >
                                {loading ? "שולח הזמנה..." : "בצע הזמנה"}
                            </Button>

                            <Button
                                fullWidth
                                size="small"
                                variant="text"
                                sx={{ mt: 1 }}
                                component={RouterLink}
                                to="/cart"
                            >
                                חזרה לעגלה
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
