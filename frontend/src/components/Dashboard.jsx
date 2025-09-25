import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Box } from '@mui/material';

function Dashboard() {
    const { t } = useTranslation();

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {t('dashboard.title')}
                </Typography>
                <Typography variant="body1">
                    {t('dashboard.welcome_message')}
                </Typography>
            </Box>
        </Container>
    );
}

export default Dashboard;