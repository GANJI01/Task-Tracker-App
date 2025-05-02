// Example: src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProjectDetailPage.module.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section Only, No Navbar */}
      <section className={styles.heroSection}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroAccent}>Task</span> Management <br /> <span className={styles.heroAccent}>Software</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Organize and manage your team like a pro with Task Tracker, the task management app packing more capabilities than you can imagine.
          </p>
          <button className={styles.ctaButton} onClick={() => navigate('/signup')}>Get Started</button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;