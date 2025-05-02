// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Correct import for named export

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken')); // Initialize from localStorage
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start loading until initial check is done

  useEffect(() => {
    // Check for existing token on initial app load
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        // Check if token is expired (exp is in seconds, Date.now() in ms)
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUser(decoded.user); // Assuming payload is { user: { id: ... } }
          setIsAuthenticated(true);
        } else {
          // Token expired
          localStorage.removeItem('authToken');
          setToken(null); // Explicitly clear state
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Invalid token
        console.error("Error decoding token on initial load:", error);
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setIsLoading(false); // Finished initial check
  }, []); // Empty dependency array means run only once on mount

  // Login function
  const login = (newToken) => {
    try {
      const decoded = jwtDecode(newToken);
      // Optional: Check expiration immediately on login too
      if (decoded.exp * 1000 > Date.now()) {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
        setUser(decoded.user);
        setIsAuthenticated(true);
        console.log("Login successful, user set:", decoded.user);
      } else {
        console.error("Received expired token on login");
        // Handle appropriately - maybe don't log in
        logout(); // Clear any potentially bad state
      }

    } catch (error) {
      console.error("Error decoding token on login:", error);
      // Don't authenticate if token is invalid
      logout(); // Clear any potentially bad state
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    console.log("User logged out");
  };

  // Value provided to consuming components
  const value = {
    token,
    user,
    isAuthenticated,
    isLoading, // Provide loading state
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a Custom Hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};