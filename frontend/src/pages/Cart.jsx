// src/pages/Cart.jsx
import React from "react";
import {
    Container, Typography, Grid, Card, CardContent, Box, Button, TextField, Divider, Alert
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
    const navigate = useNavigate();
    const { items, updateQty, removeFromCart, clearCart, subtotal, total, count } = useCart();

    const onQtyChange = (id, val) => {
        const num = Number(val);
        if (!Number.isNaN(num)) updateQty(id, num);
    };

    if (!items.length) {
        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Alert severity="info" sx={{ mb: 2 }}>העגלה שלך ריקה.</Alert>
                <Button variant="contained" component={RouterLink} to="/catalog">חזרה לקטלוג</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>העגלה שלי</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {count} פריטים בעגלה
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={2}>
                                {items.map((item) => (
                                    <Grid item xs={12} key={item.id}>
                                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                            <Box
                                                sx={{
                                                    width: 88,
                                                    height: 88,
                                                    bgcolor: "#f5f5f5",
                                                    borderRadius: 2,
                                                    overflow: "hidden",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <img
                                                    src={item.image_url || "https://placehold.co/300x300?text=PetStore"}
                                                    alt={item.name}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            </Box>

                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
                                                    {item.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    ₪{Number(item.price || 0).toFixed(2)}
                                                </Typography>

                                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                                                    <TextField
                                                        label="כמות"
                                                        type="number"
                                                        size="small"
                                                        value={item.qty}
                                                        onChange={(e) => onQtyChange(item.id, e.target.value)}
                                                        inputProps={{ min: 1, max: 999 }}
                                                        sx={{ width: 110 }}
                                                    />
                                                    <Button variant="text" color="error" onClick={() => removeFromCart(item.id)}>
                                                        הסר
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Divider sx={{ mt: 2 }} />
                                    </Grid>
                                ))}
                            </Grid>

                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                <Button variant="outlined" component={RouterLink} to="/catalog">
                                    המשך קניות
                                </Button>
                                <Button variant="text" color="error" onClick={clearCart}>
                                    נקה עגלה
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ position: "sticky", top: 16 }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>סיכום הזמנה</Typography>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography>ביניים</Typography>
                                <Typography>₪{subtotal.toFixed(2)}</Typography>
                            </Box>
                            {/* אם תוסיף משלוח/קופון, חשב כאן */}
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                                <Typography sx={{ fontWeight: 800 }}>סה״כ</Typography>
                                <Typography sx={{ fontWeight: 800 }}>₪{total.toFixed(2)}</Typography>
                            </Box>

                            <Button fullWidth variant="contained" size="large" onClick={() => navigate("/checkout")}>
                                לתשלום
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}
