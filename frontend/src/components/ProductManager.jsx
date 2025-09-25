import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

// ייבוא קריאות ה-API
import { fetchProducts, deleteProduct } from '../api';

function ProductManager() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const getProducts = async () => {
        try {
            setLoading(true);
            const data = await fetchProducts();
            setProducts(data);
        } catch (err) {
            setError('Failed to fetch products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    const handleAddProduct = () => {
        navigate('/dashboard/products/add');
    };

    const handleEditProduct = (id) => {
        navigate(`/dashboard/products/edit/${id}`);
    };

    const handleDeleteProduct = (id) => {
        setDeleteId(id);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        setOpenDialog(false);
        if (deleteId) {
            try {
                await deleteProduct(deleteId);
                // Refresh the product list after successful deletion
                getProducts();
            } catch (err) {
                setError('Failed to delete product. Please try again.');
            }
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setDeleteId(null);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ mt: 4 }}>
                <Alert severity="error">{t('product_manager.error')}</Alert>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                {t('product_manager.title')}
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" onClick={handleAddProduct}>
                    {t('product_manager.add_button')}
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('product_manager.table.name')}</TableCell>
                            <TableCell>{t('product_manager.table.price')}</TableCell>
                            <TableCell>{t('product_manager.table.stock')}</TableCell>
                            <TableCell align="right">{t('product_manager.table.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        color="secondary"
                                        onClick={() => handleEditProduct(product.id)}
                                        sx={{ mr: 1 }}
                                    >
                                        {t('common.edit_button')}
                                    </Button>
                                    <Button
                                        color="error"
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        {t('common.delete_button')}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {t('common.delete_confirmation_title')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('common.delete_confirmation_message', { item: t('common.product') })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        {t('common.cancel_button')}
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" autoFocus>
                        {t('common.confirm_button')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>

    );
}

export default ProductManager;