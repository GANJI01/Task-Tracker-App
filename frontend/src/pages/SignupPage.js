// src/pages/SignupPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../services/api'; // Import the API function
import { toast } from 'react-toastify'; // <-- Import toast
import styles from './SignupPage.module.css';

function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password, country } = formData; // Destructure for form values

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Re-destructure inside submit to ensure latest values are used
    const { name: currentName, email: currentEmail, password: currentPassword } = formData;

    if (!currentName || !currentEmail || !currentPassword) {
      setError('Please fill in all required fields (Name, Email, Password).');
      setLoading(false);
      return;
    }
    if (currentPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      // Call the signupUser function from api.js, passing the full formData state
      const response = await signupUser(formData);
      toast.success('Signup successful! Please log in.');
      navigate('/login'); // Redirect to login page on success

    } catch (err) {
      console.error('Signup failed:', err);
      // Extract error message from backend response
      const errorMsg = err.response?.data?.errors?.[0]?.msg
        || err.response?.data?.message
        || err.message
        || 'Signup failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupBg}>
      <div className={styles.signupCard}>
        <h2>Create your Account</h2>
        <form onSubmit={onSubmit}>
          {error && <p className={styles.error}>{error}</p>}
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={name} onChange={onChange} required />
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={email} onChange={onChange} required />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={password} onChange={onChange} required minLength="6" />
          <label htmlFor="country">Country (Optional)</label>
          <input type="text" id="country" name="country" value={country} onChange={onChange} />
          <button type="submit" className={styles.continueBtn} disabled={loading}>
            {loading ? 'Signing up...' : 'Continue'}
          </button>
        </form>
        <div className={styles.loginLinkBox}>
          <span>Already have an account?</span>
          <button className={styles.loginLinkBtn} onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;