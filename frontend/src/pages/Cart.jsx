import React from "react";
import { useCart } from "../context/CartContext";
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
    const { items, updateQty, removeItem, subtotal } = useCart();
    const nav = useNavigate();

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>הסל שלי</Typography>
            {items.length === 0 ? (
                <Typography>הסל ריק. <Button component={Link} to="/catalog">סעו לקטלוג</Button></Typography>
            ) : (
                <>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>מוצר</TableCell>
                                <TableCell>מחיר</TableCell>
                                <TableCell>כמות</TableCell>
                                <TableCell>סה״כ</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map(({ product, qty }) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{Number(product.price).toFixed(2)} ₪</TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number" size="small" value={qty} sx={{ width: 90 }}
                                            onChange={e => updateQty(product.id, Math.max(1, Number(e.target.value || 1)))}
                                        />
                                    </TableCell>
                                    <TableCell>{(Number(product.price) * qty).toFixed(2)} ₪</TableCell>
                                    <TableCell><Button color="error" onClick={() => removeItem(product.id)}>הסר</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                        <Typography variant="h6">סכום ביניים: {subtotal.toFixed(2)} ₪</Typography>
                        <Button variant="contained" onClick={() => nav("/checkout")}>לתשלום</Button>
                    </Box>
                </>
            )}
        </Container>
    );
}
