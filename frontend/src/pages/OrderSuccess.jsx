// src/pages/OrderSuccess.jsx
import React from "react";
import { Container, Typography, Button, Card, CardContent, Box } from "@mui/material";
import { useParams, useLocation, Link as RouterLink } from "react-router-dom";

export default function OrderSuccess() {
    const { id } = useParams();
    const location = useLocation();
    const order = location.state?.order;

    const orderId = id || order?.id || order?.order_id || "—";

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Card>
                <CardContent>
                    <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
                        תודה! ההזמנה הושלמה
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        מספר הזמנה: <strong>{orderId}</strong>
                    </Typography>

                    {order?.items?.length ? (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                                תקציר פריטים:
                            </Typography>
                            {order.items.slice(0, 6).map((it, idx) => (
                                <Typography key={idx} variant="body2">
                                    • {it.name || it.product_name || `מוצר #${it.product_id}`} × {it.qty || it.quantity || 1}
                                </Typography>
                            ))}
                            {order.items.length > 6 && (
                                <Typography variant="caption" color="text.secondary">ועוד {order.items.length - 6}…</Typography>
                            )}
                        </Box>
                    ) : null}

                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button variant="contained" component={RouterLink} to="/my-orders">
                            לצפייה בהזמנות שלי
                        </Button>
                        <Button variant="outlined" component={RouterLink} to="/">
                            חזרה לדף הבית
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
}
