import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography, AppBar } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ייבוא useAuth

const drawerWidth = 240;

function DashboardLayout({ children }) {
    const { t } = useTranslation();
    const { role } = useAuth(); // קבלת תפקיד המשתמש מהקונטקסט

    const menuItems = [
        { text: t('dashboard.menu.products'), path: '/dashboard/products' },
        { text: t('dashboard.menu.categories'), path: '/dashboard/categories' },
        { text: t('dashboard.menu.orders'), path: '/dashboard/orders' },
    ];

    // הוספת ניהול מנהלים רק אם התפקיד הוא 'superuser'
    if (role === 'superuser') {
        menuItems.push({ text: t('dashboard.menu.manage_admins'), path: '/dashboard/manage-admins' });
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        {t('dashboard.title')}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton component={Link} to={item.path}>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
}

export default DashboardLayout;