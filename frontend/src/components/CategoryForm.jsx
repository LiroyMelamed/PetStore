import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { createCategory, updateCategory, fetchCategoryById } from '../api';

function CategoryForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams(); // Get category ID from URL for editing

    const [formData, setFormData] = useState({
        name: '',
        seo_title: '',
        seo_description: '',
    });
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        // If ID exists in URL, we are in edit mode
        if (id) {
            setIsEditMode(true);
            const getCategoryData = async () => {
                setLoading(true);
                try {
                    const categoryData = await fetchCategoryById(id);
                    setFormData({
                        name: categoryData.name,
                        seo_title: categoryData.seo_title,
                        seo_description: categoryData.seo_description,
                    });
                } catch (err) {
                    setFormError('Failed to load category data.');
                } finally {
                    setLoading(false);
                }
            };
            getCategoryData();
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
                await updateCategory(id, formData);
                alert(t('category_form.success_update'));
            } else {
                await createCategory(formData);
                alert(t('category_form.success_create'));
                setFormData({
                    name: '',
                    seo_title: '',
                    seo_description: '',
                });
            }
            navigate('/dashboard/categories');
        } catch (err) {
            setFormError(isEditMode ? 'Failed to update category.' : 'Failed to create category.');
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
                {isEditMode ? t('category_form.edit_title') : t('category_form.add_title')}
            </Typography>
            {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

            <TextField
                fullWidth
                label={t('category_form.fields.name')}
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label={t('category_form.fields.seoTitle')}
                name="seo_title"
                value={formData.seo_title}
                onChange={handleChange}
                margin="normal"
            />
            <TextField
                fullWidth
                label={t('category_form.fields.seoDescription')}
                name="seo_description"
                value={formData.seo_description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={2}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="contained" color="secondary" onClick={() => navigate('/dashboard/categories')}>
                    {t('common.cancel_button')}
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : (isEditMode ? t('common.save_changes_button') : t('common.add_button'))}
                </Button>
            </Box>
        </Box>

    );
}

export default CategoryForm;