import React, { useState, useEffect } from 'react';
import { createTask, getProjects } from '../services/api';
import styles from './CreateProjectForm.module.css';

function CreateTaskForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        status: 'To Do',
        assignee: '',
        projectId: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [projects, setProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await getProjects();
                setProjects(res.data);
                setLoadingProjects(false);
            } catch (err) {
                setProjects([]);
                setLoadingProjects(false);
            }
        }
        fetchProjects();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            setError('Task title is required');
            return;
        }
        if (!formData.projectId) {
            setError('Please select a project');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            await createTask(formData.projectId, {
                title: formData.title,
                description: formData.description,
                deadline: formData.deadline,
                status: formData.status,
                assignee: formData.assignee,
            });
            onSuccess && onSuccess();
        } catch (err) {
            setError('Failed to create task.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* Title bar/header at the top */}
            <div className={styles.nameBarSection}>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Task Title *"
                    className={styles.nameBarInput}
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter task description"
                    rows="3"
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="deadline">Deadline</label>
                <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="projectId">Project *</label>
                {loadingProjects ? (
                    <div style={{ color: '#888', fontSize: 14 }}>Loading projects...</div>
                ) : (
                    <select
                        id="projectId"
                        name="projectId"
                        value={formData.projectId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a project</option>
                        {projects.map((project) => (
                            <option key={project._id} value={project._id}>{project.name}</option>
                        ))}
                    </select>
                )}
            </div>
            <div className={styles.selectGroup}>
                <div className={styles.formGroup}>
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="assignee">Assignee</label>
                    <input
                        type="text"
                        id="assignee"
                        name="assignee"
                        value={formData.assignee}
                        onChange={handleChange}
                        placeholder="Assignee name (optional)"
                    />
                </div>
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
            >
                {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
        </form>
    );
}

export default CreateTaskForm; 