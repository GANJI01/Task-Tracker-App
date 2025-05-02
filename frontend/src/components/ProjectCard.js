// src/components/ProjectCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ProjectCard.module.css'; // Import the CSS module

/// Receive handlers as props
function ProjectCard({ project, onEditClick, onDeleteClick, isProcessing }) {
  if (!project) return null;

  const handleEdit = (e) => {
    e.preventDefault(); // Prevent link navigation when clicking button
    e.stopPropagation(); // Stop event bubbling up to the link
    onEditClick(project); // Call handler from parent
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteClick(project._id); // Call handler from parent
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status class with fallback to 'Not Started'
  const getStatusClass = () => {
    const status = project.status || 'Not Started';
    return `${styles.status} ${styles[`status${status.replace(/\s+/g, '')}`]}`;
  };

  // Get priority class with fallback to 'Medium'
  const getPriorityClass = () => {
    const priority = project.priority || 'Medium';
    return `${styles.priority} ${styles[`priority${priority}`]}`;
  };

  return (
    // The Link still wraps the card for general navigation
    <Link to={`/projects/${project._id}`} className={styles.projectCard}>
      <div className={styles.cardContent}>
        <h3>{project.name}</h3>
        {project.description && (
          <p className={styles.description}>{project.description}</p>
        )}
        <div className={styles.meta}>
          <span className={getStatusClass()}>
            {project.status || 'Not Started'}
          </span>
          <span className={getPriorityClass()}>
            {project.priority || 'Medium'}
          </span>
        </div>
        <div className={styles.dates}>
          <p>Start: {formatDate(project.startDate)}</p>
          <p>End: {formatDate(project.endDate)}</p>
        </div>
      </div>
      {/* Action buttons */}
      <div className={styles.cardActions}>
        <button onClick={handleEdit} disabled={isProcessing} className={styles.editButton}>Edit</button>
        <button onClick={handleDelete} disabled={isProcessing} className={styles.deleteButton}>Delete</button>
      </div>
    </Link>
  );
}

export default ProjectCard;