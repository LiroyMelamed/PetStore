import React, { useEffect, useState } from "react";
import { fetchMyOrders } from "../api";
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip } from "@mui/material";

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    useEffect(() => { fetchMyOrders().then(setOrders).catch(console.error); }, []);
    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>ההזמנות שלי</Typography>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>תאריך</TableCell>
                        <TableCell>סטטוס</TableCell>
                        <TableCell>סה״כ</TableCell>
                        <TableCell>מטבע</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map(o => (
                        <TableRow key={o.id}>
                            <TableCell>{o.id}</TableCell>
                            <TableCell>{new Date(o.created_at).toLocaleString()}</TableCell>
                            <TableCell><Chip label={o.status || 'pending'} size="small" /></TableCell>
                            <TableCell>{Number(o.total_price).toFixed(2)}</TableCell>
                            <TableCell>{o.currency}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Container>
    );
}
