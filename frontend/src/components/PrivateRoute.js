// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Option 1: Component-based (Often clearer)
function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation(); // Get current location

  // 1. Handle Loading State: While checking auth status, don't redirect yet
  if (isLoading) {
    // You can return a loading spinner or null here
    return <div>Loading authentication status...</div>;
    // return null;
  }

  // 2. Check Authentication: If loading is finished and user is not authenticated
  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to in the state. This allows redirecting back after login.
    console.log('PrivateRoute: Not authenticated, redirecting to login.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated: Render the child component (the actual protected page)
  console.log('PrivateRoute: Authenticated, rendering child component.');
  return children;
}

// Option 2: Outlet-based (Alternative, useful if nesting routes)
// import { Outlet } from 'react-router-dom';
// function PrivateRouteOutlet() {
//   const { isAuthenticated, isLoading } = useAuth();
//   const location = useLocation();
//   if (isLoading) return <div>Loading...</div>;
//   return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
// }

export default PrivateRoute; // Export the chosen component