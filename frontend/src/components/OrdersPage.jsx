import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useTranslation } from "react-i18next"; // במקום מה־i18n.js

// רכיב עבור עמוד ניהול הזמנות
const OrdersPage = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // סימולציית קריאות API
    const fetchOrders = async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { id: '1', customer_name: 'יוסי כהן', total_price: 150.00, status: 'pending', created_at: new Date().toISOString() },
            { id: '2', customer_name: 'שרה לוי', total_price: 250.50, status: 'shipped', created_at: new Date(Date.now() - 86400000).toISOString() },
            { id: '3', customer_name: 'משה רוזן', total_price: 75.00, status: 'delivered', created_at: new Date(Date.now() - 172800000).toISOString() },
            { id: '4', customer_name: 'דנה שמש', total_price: 320.00, status: 'cancelled', created_at: new Date(Date.now() - 259200000).toISOString() },
        ];
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        setOrders(prevOrders => prevOrders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    useEffect(() => {
        const getOrders = async () => {
            try {
                setLoading(true);
                const data = await fetchOrders();
                setOrders(data);
            } catch (err) {
                setError(t('error'));
            } finally {
                setLoading(false);
            }
        };
        getOrders();
    }, [t]);

    const handleStatusChange = (event, orderId) => {
        updateOrderStatus(orderId, event.target.value);
    };

    if (loading) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5">{t('loading')}</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h5" color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>{t('orders_page')}</Typography>
            <Paper>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('order_table_header.order_number')}</TableCell>
                                <TableCell>{t('order_table_header.customer')}</TableCell>
                                <TableCell>{t('order_table_header.total_price')}</TableCell>
                                <TableCell>{t('order_table_header.status')}</TableCell>
                                <TableCell>{t('order_table_header.order_date')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.customer_name}</TableCell>
                                    <TableCell>${order.total_price.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                                            <Select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(e, order.id)}
                                            >
                                                <MenuItem value="pending">{t('status_pending')}</MenuItem>
                                                <MenuItem value="shipped">{t('status_shipped')}</MenuItem>
                                                <MenuItem value="delivered">{t('status_delivered')}</MenuItem>
                                                <MenuItem value="cancelled">{t('status_cancelled')}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default OrdersPage;
