import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    CircularProgress,
    Alert
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCategories, createProduct, updateProduct, fetchProductById } from '../api';

function ProductForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams(); // Get product ID from URL for editing

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        image_url: '',
        category_id: '',
        seo_title: '',
        seo_description: '',
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        // Fetch categories for the dropdown
        const getCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (err) {
                setFormError('Failed to load categories.');
            }
        };

        getCategories();

        // If ID exists in URL, we are in edit mode
        if (id) {
            setIsEditMode(true);
            const getProductData = async () => {
                setLoading(true);
                try {
                    const productData = await fetchProductById(id);
                    setFormData({
                        name: productData.name,
                        description: productData.description,
                        price: productData.price,
                        stock: productData.stock,
                        image_url: productData.image_url,
                        category_id: productData.category_id,
                        seo_title: productData.seo_title,
                        seo_description: productData.seo_description,
                    });
                } catch (err) {
                    setFormError('Failed to load product data.');
                } finally {
                    setLoading(false);
                }
            };
            getProductData();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError(null);

        try {
            if (isEditMode) {
                await updateProduct(id, formData);
                alert(t('product_form.success_update'));
            } else {
                await createProduct(formData);
                alert(t('product_form.success_create'));
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    stock: '',
                    image_url: '',
                    category_id: '',
                    seo_title: '',
                    seo_description: '',
                });
            }
            navigate('/dashboard/products');
        } catch (err) {
            setFormError(isEditMode ? 'Failed to update product.' : 'Failed to create product.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                {isEditMode ? t('product_form.edit_title') : t('product_form.add_title')}
            </Typography>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

            <TextField
                fullWidth
                label={t('product_form.fields.name')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label={t('product_form.fields.description')}
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
            />
            <TextField
                fullWidth
                label={t('product_form.fields.price')}
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label={t('product_form.fields.stock')}
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label={t('product_form.fields.imageUrl')}
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                margin="normal"
            />
            <TextField
                select
                fullWidth
                label={t('product_form.fields.category')}
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                margin="normal"
                required
            >
                {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                        {category.name}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                fullWidth
                label={t('product_form.fields.price')}
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label={t('product_form.fields.stock')}
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                margin="normal"
                required
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard/products')}>
                    {t('common.cancel_button')}
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : (isEditMode ? t('common.save_changes_button') : t('common.add_button'))}
                </Button>
            </Box>
        </Box>
    );
}

export default ProductForm;