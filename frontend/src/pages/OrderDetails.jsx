// src/pages/OrderDetails.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
    Container, Typography, Grid, Card, CardContent, Box, Divider,
    CircularProgress, Alert, Chip, Button
} from "@mui/material";
import { useParams, Link as RouterLink } from "react-router-dom";
import { fetchOrderById } from "../api";

function fmtDate(v) {
    const d = v ? new Date(v) : null;
    if (!d || isNaN(d.getTime())) return "—";
    return d.toLocaleString("he-IL");
}
function idOf(o) { return o?.id ?? o?.order_id ?? o?._id ?? "—"; }
function chip(s0) {
    const s = String(s0 || "pending").toLowerCase();
    let color = "default";
    if (["paid", "completed", "success"].includes(s)) color = "success";
    else if (["pending", "created", "processing"].includes(s)) color = "warning";
    else if (["failed", "canceled", "cancelled", "error"].includes(s)) color = "error";
    return <Chip label={s} color={color} size="small" />;
}
function safeItems(o) {
    return Array.isArray(o?.items) ? o.items : (Array.isArray(o?.lines) ? o.lines : []);
}
function currencySymbol(c) { return c === "USD" ? "$" : c === "EUR" ? "€" : "₪"; }
function lineName(it) { return it?.name ?? it?.product_name ?? (it?.product_id ? `מוצר #${it.product_id}` : "פריט"); }

export default function OrderDetails() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [err, setErr] = useState("");

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const data = await fetchOrderById(id);
                const o = data?.order ?? data;
                if (!cancelled) setOrder(o);
            } catch (e) {
                console.error(e);
                if (!cancelled) setErr("שגיאה בטעינת פרטי ההזמנה");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => (cancelled = true);
    }, [id]);

    const items = useMemo(() => safeItems(order), [order]);
    const currency = order?.currency ?? "ILS";
    const sym = currencySymbol(currency);

    const computedSubtotal = useMemo(() => {
        return items.reduce((sum, it) => {
            const q = Number(it.qty ?? it.quantity ?? 1);
            const price = Number(it.unit_price ?? it.price ?? it.unitPrice ?? 0);
            return sum + q * price;
        }, 0);
    }, [items]);

    const reportedTotal = Number(
        order?.total ?? order?.total_amount ?? order?.amount ?? order?.grand_total ?? order?.grandTotal ?? NaN
    );
    const total = Number.isFinite(reportedTotal) ? reportedTotal : computedSubtotal;

    const shipping = order?.shipping_address ?? order?.shippingAddress ?? order?.shipping ?? null;
    const billing = order?.billing_address ?? order?.billingAddress ?? order?.billing ?? null;

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 6, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Container>
        );
    }
    if (err || !order) {
        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Alert severity="error">{err || "הזמנה לא נמצאה"}</Alert>
                <Button variant="outlined" sx={{ mt: 2 }} component={RouterLink} to="/my-orders">
                    חזרה להזמנות
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
                הזמנה #{idOf(order)} {chip(order?.status)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                נוצרה: {fmtDate(order?.created_at ?? order?.createdAt ?? order?.date)}
            </Typography>

            <Grid container spacing={3}>
                {/* פריטים */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>פריטים</Typography>
                            <Divider sx={{ mb: 1 }} />
                            {items.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">אין פריטים בהזמנה.</Typography>
                            ) : (
                                items.map((it, idx) => {
                                    const q = Number(it.qty ?? it.quantity ?? 1);
                                    const price = Number(it.unit_price ?? it.price ?? 0);
                                    const lineTotal = q * price;
                                    return (
                                        <Box key={idx} sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography variant="subtitle2" noWrap title={lineName(it)} sx={{ fontWeight: 700 }}>
                                                    {lineName(it)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {q} × {sym}{price.toFixed(2)}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2">{sym}{lineTotal.toFixed(2)}</Typography>
                                        </Box>
                                    );
                                })
                            )}

                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography>ביניים</Typography>
                                <Typography>{sym}{computedSubtotal.toFixed(2)}</Typography>
                            </Box>
                            {/* אם יש משלוח/הנחה מהשרת אפשר להציג כאן */}
                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                                <Typography sx={{ fontWeight: 800 }}>סה״כ</Typography>
                                <Typography sx={{ fontWeight: 800 }}>{sym}{total.toFixed(2)}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* כתובות ועוד */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>כתובת משלוח</Typography>
                            {shipping ? (
                                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                                    {shipping.street} {shipping.house_no}{shipping.house_no ? "\n" : ""}
                                    {shipping.city}{shipping.postal_code ? `, ${shipping.postal_code}` : ""}\n
                                    {shipping.country}
                                </Typography>
                            ) : (
                                <Typography variant="body2" color="text.secondary">—</Typography>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>כתובת חיוב</Typography>
                            {billing ? (
                                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                                    {billing.street} {billing.house_no}{billing.house_no ? "\n" : ""}
                                    {billing.city}{billing.postal_code ? `, ${billing.postal_code}` : ""}\n
                                    {billing.country}
                                </Typography>
                            ) : (
                                <Typography variant="body2" color="text.secondary">—</Typography>
                            )}
                        </CardContent>
                    </Card>

                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <Button variant="contained" component={RouterLink} to="/my-orders">בחזרה להזמנות</Button>
                        <Button variant="outlined" component={RouterLink} to="/">דף הבית</Button>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
}
