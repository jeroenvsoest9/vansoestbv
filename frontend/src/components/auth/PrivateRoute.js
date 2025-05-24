import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../common/LoadingSpinner';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute; 