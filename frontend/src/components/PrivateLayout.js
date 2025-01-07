import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

function PrivateLayout({ children }) {
  const location = useLocation();
  
  // Check if user is logged in by checking if we have user data in location state
  const isAuthenticated = location.state?.username;

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default PrivateLayout; 