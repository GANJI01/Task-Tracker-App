// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // <-- Import
import 'react-toastify/dist/ReactToastify.css'; // <-- Import CSS

// Import Page Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';         // <-- ADD THIS IMPORT
import SignupPage from './pages/SignupPage';       // <-- ADD THIS IMPORT
import DashboardPage from './pages/DashboardPage'; // <-- ADD THIS IMPORT
import ProjectDetailPage from './pages/ProjectDetailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';

// Import Components
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

function AppRoutes() {
  const location = useLocation();
  // Hide Navbar on home, signup, and dashboard page
  const hideNavbar = location.pathname === '/' || location.pathname === '/signup' || location.pathname === '/dashboard';
  return (
    <>
      {!hideNavbar && <Navbar />}
      <ToastContainer
        position="bottom-center" // Changed from top-right to bottom-center
        autoClose={3000} // Auto close after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // Or "dark" or "colored"
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        {/* Now LoginPage is defined */}
        <Route path="/login" element={<LoginPage />} />
        {/* Now SignupPage is defined */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {/* Now DashboardPage is defined */}
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <PrivateRoute>
              <ProjectDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* Optional: 404 Not Found Route */}
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;