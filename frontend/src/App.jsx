import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

// Import all your components
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import DashboardLayout from './components/DashboardLayout';
import ProductManager from './components/ProductManager';
import CategoryManager from './components/CategoryManager';
import ProductForm from './components/ProductForm';
import CategoryForm from './components/CategoryForm';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import ManageAdmins from './components/ManageAdmins'; // הוסף את הייבוא הזה


// --- Header Component for Navigation ---
const Header = () => {
  const { t, i18n } = useTranslation();
  const { logout, isAuthenticated } = useAuth();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'he' ? 'en' : 'he';
    i18n.changeLanguage(newLang);
  };

  return (
    <Box sx={{ p: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
      {isAuthenticated ? (
        <>
          <Button component={Link} to="/dashboard/products" variant="contained">Dashboard</Button>
          <Button onClick={logout} variant="contained" color="secondary">{t('logout_button')}</Button>
        </>
      ) : (
        <>
          <Button component={Link} to="/login" variant="contained">{t('login.title')}</Button>
          <Button component={Link} to="/register" variant="outlined">{t('register.title')}</Button>
        </>
      )}
      <Button onClick={toggleLanguage} variant="outlined" color="info">
        {i18n.language === 'he' ? 'English' : 'עברית'}
      </Button>
    </Box>
  );

};

// --- App Component with Correct Routing Structure ---
function App() {
  return (
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<p>Welcome! Please log in or register.</p>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/products" element={<ProtectedRoute><DashboardLayout><ProductManager /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/products/add" element={<ProtectedRoute><DashboardLayout><ProductForm /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/products/edit/:id" element={<ProtectedRoute><DashboardLayout><ProductForm /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/categories" element={<ProtectedRoute><DashboardLayout><CategoryManager /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/categories/add" element={<ProtectedRoute><DashboardLayout><CategoryForm /></DashboardLayout></ProtectedRoute>} />
          <Route path="/dashboard/categories/edit/:id" element={<ProtectedRoute><DashboardLayout><CategoryForm /></DashboardLayout></ProtectedRoute>} />
          <Route
            path="/dashboard/manage-admins"
            element={
              <ProtectedRoute allowedRoles={['superuser']}>
                <DashboardLayout>
                  <ManageAdmins />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;