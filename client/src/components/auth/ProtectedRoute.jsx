import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const location = useLocation();
  const { user, isAuthenticated, loading } = useAuth();

  console.log('ProtectedRoute - user:', user);
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - loading:', loading);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) {
    console.log('ProtectedRoute - redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check
  if (requiredRole && user?.role !== requiredRole) {
    // Allow admin to access everything
    if (user?.role !== 'admin') {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Permission check (if you have permissions array on user)
  if (requiredPermission && !(user?.permissions || []).includes(requiredPermission)) {
    if (user?.role !== 'admin') {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 