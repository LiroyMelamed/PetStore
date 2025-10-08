// src/pages/MyOrders.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
    Container, Typography, Card, CardContent, Table, TableHead, TableRow,
    TableCell, TableBody, CircularProgress, Alert, Button, Box, Chip
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { fetchMyOrders } from "../api";

function fmtDate(v) {
    const d = v ? new Date(v) : null;
    if (!d || isNaN(d.getTime())) return "—";
    return d.toLocaleString("he-IL");
}

function getOrderId(o) {
    return o?.id ?? o?.order_id ?? o?._id ?? "—";
}

function countItems(o) {
    if (Array.isArray(o?.items)) return o.items.reduce((a, it) => a + Number(it.qty ?? it.quantity ?? 1), 0);
    if (typeof o?.items_count === "number") return o.items_count;
    if (Array.isArray(o?.lines)) return o.lines.reduce((a, it) => a + Number(it.qty ?? it.quantity ?? 1), 0);
    return 0;
}

function computeItemsTotal(o) {
    const rows = Array.isArray(o?.items) ? o.items : (Array.isArray(o?.lines) ? o.lines : []);
    return rows.reduce((sum, it) => {
        const q = Number(it.qty ?? it.quantity ?? 1);
        const price = Number(it.unit_price ?? it.price ?? it.unitPrice ?? 0);
        return sum + q * price;
    }, 0);
}

function amountDisplay(o) {
    const reported = Number(
        o?.total ?? o?.total_amount ?? o?.amount ?? o?.grand_total ?? o?.grandTotal ?? NaN
    );
    const computed = computeItemsTotal(o);
    const value = Number.isFinite(reported) ? reported : computed;
    const currency = o?.currency ?? "ILS";
    const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "₪";
    return `${symbol}${value.toFixed(2)}`;
}

function statusChip(statusRaw) {
    const s = String(statusRaw || "pending").toLowerCase();
    let color = "default";
    if (["paid", "completed", "success"].includes(s)) color = "success";
    else if (["pending", "created", "processing"].includes(s)) color = "warning";
    else if (["failed", "canceled", "cancelled", "error"].includes(s)) color = "error";
    return <Chip size="small" label={s} color={color} />;
}

export default function MyOrders() {
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const [err, setErr] = useState("");

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setLoading(true);
                const data = await fetchMyOrders();
                const list = Array.isArray(data?.orders) ? data.orders
                    : Array.isArray(data?.data) ? data.data
                        : Array.isArray(data) ? data
                            : [];
                if (!cancelled) setRows(list);
            } catch (e) {
                console.error(e);
                if (!cancelled) setErr("שגיאה בטעינת ההזמנות");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => (cancelled = true);
    }, []);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 6, display: "flex", justifyContent: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>ההזמנות שלי</Typography>

            {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}

            {!rows.length ? (
                <>
                    <Alert severity="info" sx={{ mb: 2 }}>אין הזמנות להצגה.</Alert>
                    <Button variant="contained" component={RouterLink} to="/catalog">
                        חזרה לקטלוג
                    </Button>
                </>
            ) : (
                <Card>
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>מס' הזמנה</TableCell>
                                    <TableCell>תאריך</TableCell>
                                    <TableCell align="right">כמות פריטים</TableCell>
                                    <TableCell align="right">סכום</TableCell>
                                    <TableCell>סטטוס</TableCell>
                                    <TableCell align="right">פעולות</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((o) => {
                                    const id = getOrderId(o);
                                    return (
                                        <TableRow key={id}>
                                            <TableCell>{id}</TableCell>
                                            <TableCell>{fmtDate(o?.created_at ?? o?.createdAt ?? o?.date)}</TableCell>
                                            <TableCell align="right">{countItems(o)}</TableCell>
                                            <TableCell align="right">{amountDisplay(o)}</TableCell>
                                            <TableCell>{statusChip(o?.status)}</TableCell>
                                            <TableCell align="right">
                                                <Button size="small" component={RouterLink} to={`/order/${id}`} variant="outlined">
                                                    צפה
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </Container>
    );
}
