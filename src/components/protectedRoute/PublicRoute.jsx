import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
        // If there's no token, redirect to the login page
        return <Navigate to="/UserManagement" />;
    }

    return children;
};


export default PublicRoute;