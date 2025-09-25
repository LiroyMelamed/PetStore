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
import { fetchCategories, deleteCategory } from '../api';

function CategoryManager() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const getCategories = async () => {
        try {
            setLoading(true);
            const data = await fetchCategories();
            setCategories(data);
        } catch (err) {
            setError('Failed to fetch categories. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const handleAddCategory = () => {
        navigate('/dashboard/categories/add');
    };

    const handleEditCategory = (id) => {
        navigate(`/dashboard/categories/edit/${id}`);
    };

    const handleDeleteCategory = (id) => {
        setDeleteId(id);
        setOpenDialog(true);
    };

    const handleConfirmDelete = async () => {
        setOpenDialog(false);
        if (deleteId) {
            try {
                await deleteCategory(deleteId);
                // Refresh the category list after successful deletion
                getCategories();
            } catch (err) {
                setError('Failed to delete category. Please try again.');
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
                <Alert severity="error">{t('category_manager.error')}</Alert>
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                {t('category_manager.title')}
            </Typography>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary" onClick={handleAddCategory}>
                    {t('category_manager.add_button')}
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('category_manager.table.name')}</TableCell>
                            <TableCell align="right">{t('category_manager.table.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.name}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        color="secondary"
                                        onClick={() => handleEditCategory(category.id)}
                                        sx={{ mr: 1 }}
                                    >
                                        {t('common.edit_button')}
                                    </Button>
                                    <Button
                                        color="error"
                                        onClick={() => handleDeleteCategory(category.id)}
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
                        {t('common.delete_confirmation_message', { item: t('common.category') })}
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

export default CategoryManager;