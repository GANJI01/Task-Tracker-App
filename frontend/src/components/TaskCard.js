// src/components/TaskCard.js
import React from 'react';
import styles from './TaskCard.module.css'; // Import the CSS module

// Receive props from the parent (ProjectDetailPage)
function TaskCard({ task, onEdit, onDelete, isEditingAny, isCreatingTask }) {
  if (!task) return null;

  // Determine if this specific card should be dimmed
  const isDimmed = isEditingAny && isEditingAny !== task._id;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    // Apply base class and conditional dimmed class
    <li className={`${styles.taskCard} ${isDimmed ? styles.taskCardDimmed : ''}`}>
      <h4 className={styles.title}>{task.title}</h4>
      {task.description && <p className={styles.description}>{task.description}</p>}
      <div className={styles.metaRow}>
        <span className={`${styles.status} ${styles[`status${(task.status || '').replace(/\s+/g, '')}`]}`}>{task.status}</span>
        {task.assignee && <span className={styles.assignee}>👤 {task.assignee}</span>}
      </div>
      <div className={styles.dates}>
        <span>Deadline: {formatDate(task.deadline)}</span>
      </div>
      <div className={styles.cardActions}>
        <button
          onClick={() => onEdit(task)} // Call the onEdit prop, passing the task
          disabled={isEditingAny || isCreatingTask} // Disable if ANY task is being edited or created
          className={styles.editButton}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)} // Call the onDelete prop, passing the task ID
          disabled={isEditingAny || isCreatingTask} // Disable if ANY task is being edited or created
          className={styles.deleteButton}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskCard;