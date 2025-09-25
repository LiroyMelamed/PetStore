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
    Chip,
    IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
// The 'api' module is assumed to be configured for network requests.
import { fetchAdmins, addAdmin, deleteAdmin } from '../api';

function ManageAdmins() {
    const { t } = useTranslation();
    // State to hold the list of administrators
    const [admins, setAdmins] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Function to fetch the list of admins from the server
    const fetchAdminsList = useCallback(async () => {
        try {
            const response = await fetchAdmins();
            setAdmins(response);
        } catch (err) {
            setError(t('manage_admins.fetch_error'));
        }
    }, [t]);

    // useEffect that runs once when the component loads
    useEffect(() => {
        fetchAdminsList();
    }, [fetchAdminsList]);

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
            await addAdmin(adminData);
            setSuccess(t('manage_admins.form.success_message'));
            setUsername('');
            setPassword('');
            fetchAdminsList(); // Refresh the list after a successful addition
        } catch (err) {
            const errorMessage = err.response?.data?.message || t('manage_admins.form.error_generic');
            setError(errorMessage);
        }
    };

    // New function to handle administrator deletion
    const handleDelete = async (adminId) => {
        // Here we can add a confirmation dialog before deletion
        // if (!window.confirm(t('manage_admins.delete_confirm'))) {
        //     return;
        // }

        try {
            await deleteAdmin(adminId);
            setSuccess(t('manage_admins.delete_success'));
            fetchAdminsList(); // Refresh the list after successful deletion
        } catch (err) {
            const errorMessage = err.response?.data?.message || t('manage_admins.delete_error');
            setError(errorMessage);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {t('manage_admins.title')}
            </Typography>

            {/* Admin add form */}
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

            {/* Displaying the list of existing admins */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {t('manage_admins.existing_admins_title')}
                </Typography>
                <List>
                    {admins.map((admin, index) => (
                        <React.Fragment key={admin.id}>
                            <ListItem
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(admin.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
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
