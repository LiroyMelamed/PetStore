import React, { useState } from "react";
import { Container, Grid, TextField, Typography, Button, Alert, Box } from "@mui/material";
import { useCart } from "../context/CartContext";
import { checkout } from "../api";

export default function Checkout() {
    const { items, subtotal, clear } = useCart();
    const [discount, setDiscount] = useState("");
    const [shipping, setShipping] = useState({ country: "", city: "", street: "", house_no: "", postal_code: "" });
    const [billing, setBilling] = useState({ country: "", city: "", street: "", house_no: "", postal_code: "" });
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    const canSubmit = items.length > 0 &&
        shipping.country && shipping.city && shipping.street && shipping.house_no &&
        billing.country && billing.city && billing.street && billing.house_no;

    async function onSubmit() {
        try {
            setLoading(true);
            const payload = {
                currency: "ILS",
                discount_code: discount || null,
                shipping_address: shipping,
                billing_address: billing,
                items: items.map(({ product, qty }) => ({
                    product_id: product.id,
                    qty,
                    unit_price: Number(product.price)
                }))
            };
            const res = await checkout(payload);
            clear();
            setMsg({ type: "success", text: `הוזמנה נוצרה (#${res.order_id}) סך הכל: ${res.total} ₪` });
        } catch (e) {
            setMsg({ type: "error", text: e?.response?.data?.error || e.message });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>תשלום ומשלוח</Typography>
            {msg && <Alert severity={msg.type} sx={{ mb: 2 }}>{msg.text}</Alert>}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>כתובת משלוח</Typography>
                    {["country", "city", "street", "house_no", "postal_code"].map(k => (
                        <TextField key={k} label={k} fullWidth size="small" sx={{ mb: 2 }}
                            value={shipping[k] || ""} onChange={e => setShipping(s => ({ ...s, [k]: e.target.value }))} />
                    ))}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>כתובת לחיוב</Typography>
                    {["country", "city", "street", "house_no", "postal_code"].map(k => (
                        <TextField key={k} label={k} fullWidth size="small" sx={{ mb: 2 }}
                            value={billing[k] || ""} onChange={e => setBilling(s => ({ ...s, [k]: e.target.value }))} />
                    ))}
                    <TextField label="קוד קופון" fullWidth size="small" value={discount}
                        onChange={e => setDiscount(e.target.value)} />
                    <Box sx={{ mt: 2 }}>
                        <Typography>סכום ביניים: <b>{subtotal.toFixed(2)} ₪</b></Typography>
                    </Box>
                    <Button sx={{ mt: 2 }} variant="contained" disabled={!canSubmit || loading} onClick={onSubmit}>
                        {loading ? "מעבד..." : "סיום הזמנה"}
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}
