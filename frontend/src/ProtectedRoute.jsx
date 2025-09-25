import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        // אם המשתמש לא מחובר, הפנה אותו לדף ההתחברות
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default ProtectedRoute;