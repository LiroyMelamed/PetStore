// src/components/ManageAdmins.jsx (קובץ מלא ומעודכן)

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Grid,
    Alert,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip
} from '@mui/material';
// import { api } from '../api';

function ManageAdmins() {
    const { t } = useTranslation();
    const [admins, setAdmins] = useState([]); // State חדש לשמירת רשימת המנהלים
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // פונקציה למשיכת רשימת המנהלים מהשרת
    const fetchAdmins = useCallback(async () => {
        try {
            const response = await api.get('/admins');
            setAdmins(response.data);
        } catch (err) {
            setError(t('manage_admins.fetch_error'));
        }
    }, [t]);

    // useEffect שירוץ פעם אחת כשהקומפוננטה נטענת
    useEffect(() => {
        fetchAdmins();
    }, [fetchAdmins]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        if (!username || !password) {
            setError(t('manage_admins.form.error_all_fields'));
            return;
        }
        if (password.length < 8) {
            setError(t('manage_admins.form.error_password_length'));
            return;
        }

        try {
            const adminData = { username, password };
            await api.post('/admins', adminData);
            setSuccess(t('manage_admins.form.success_message'));
            setUsername('');
            setPassword('');
            fetchAdmins(); // <-- רענון הרשימה לאחר הוספה מוצלחת
        } catch (err) {
            const errorMessage = err.response?.data?.message || t('manage_admins.form.error_generic');
            setError(errorMessage);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {t('manage_admins.title')}
            </Typography>

            {/* טופס הוספת מנהל */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {t('manage_admins.add_new_title')}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField fullWidth required id="username" label={t('manage_admins.form.username')} name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth required id="password" label={t('manage_admins.form.password')} name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} helperText={t('manage_admins.form.password_helper')} />
                        </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
                        {t('manage_admins.form.add_button')}
                    </Button>
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">{success}</Alert>}
                </Box>
            </Paper>

            {/* הצגת רשימת מנהלים קיימים */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {t('manage_admins.existing_admins_title')}
                </Typography>
                <List>
                    {admins.map((admin, index) => (
                        <React.Fragment key={admin.id}>
                            <ListItem>
                                <ListItemText
                                    primary={admin.username}
                                    secondary={t('manage_admins.role')}
                                />
                                <Chip
                                    label={admin.role}
                                    color={admin.role === 'superuser' ? 'secondary' : 'primary'}
                                    size="small"
                                />
                            </ListItem>
                            {index < admins.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </Paper>
        </Box>
    );
}

export default ManageAdmins;