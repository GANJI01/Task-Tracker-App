// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api'; // Import the API function
import { useAuth } from '../context/AuthContext'; // Import useAuth
import { toast } from 'react-toastify'; // <-- Import toast

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from context

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { email, password } = formData; // Destructure here

    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      // Call the loginUser function from api.js
      const response = await loginUser({ email, password });
      const token = response?.data?.token;

      if (token) {
        console.log('Login successful, calling context login');
        login(token); // Call context login
        navigate('/dashboard'); // Redirect on success
      } else {
        console.error('Login successful but no token received.');
        setError('Login failed: No token received from server.');
      }

    } catch (err) {
      console.error('Login failed:', err);
      // Extract error message
      const errorMsg = err.response?.data?.errors?.[0]?.msg
        || err.response?.data?.message
        || err.message
        || 'Login failed. Invalid Credentials.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Destructure here for form values
  const { email: formEmailValue, password: formPasswordValue } = formData;

  return (
    <div className="container"> {/* Optional global container */}
      <h2>Login Page</h2>
      {/* Form Wrapper for Styling */}
      <div style={{ maxWidth: '450px', margin: '20px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <form onSubmit={onSubmit}>
          {/* Use global error message class */}
          {error && <p className="error-message">{error}</p>}

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="email">Email:</label> {/* Global styles apply */}
            <input // Global styles apply
              type="email"
              id="email"
              name="email"
              value={formEmailValue}
              onChange={onChange}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="password">Password:</label> {/* Global styles apply */}
            <input // Global styles apply
              type="password"
              id="password"
              name="password"
              value={formPasswordValue}
              onChange={onChange}
              required
            />
          </div>
          <div style={{ marginBottom: '15px', textAlign: 'right' }}>
            <Link to="/forgot-password" style={{ color: '#4f46e5', textDecoration: 'none' }}>
              Forgot Password?
            </Link>
          </div>
          <button // Global styles apply
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px' }} // Make button larger
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;