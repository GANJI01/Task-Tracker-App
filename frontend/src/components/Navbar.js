// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css'; // <-- Import the CSS module

function Navbar() {
  const { isAuthenticated, isLoading, logout, user } = useAuth();
  // const navigate = useNavigate(); // No longer needed

  const handleLogout = () => {
    logout();
    window.location.href = '/login'; // Force reload and redirect
  };

  if (isLoading) {
    return null;
  }

  return (
    // Use the class name from the imported styles object
    <nav className={styles.navbar}>
      {/* Use specific class names for link groups if needed */}
      <div className={styles.navLinks}>
        <Link to="/">Home</Link>
        {isAuthenticated && (
          <Link to="/dashboard">Dashboard</Link>
        )}
      </div>

      <div className={styles.navActions}>
        {isAuthenticated ? (
          <>
            <span>
              Welcome, {user?.name || user?.email || 'User'}!
            </span>
            {/* Apply specific class to logout button */}
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;