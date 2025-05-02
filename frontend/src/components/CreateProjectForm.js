import React, { useState } from 'react';
import { createProject } from '../services/api';
import { toast } from 'react-toastify';
import styles from './CreateProjectForm.module.css';

function CreateProjectForm({ onProjectCreated }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        priority: 'Medium',
        status: 'Not Started',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError('Project name is required');
            return;
        }
        if (!formData.startDate || !formData.endDate) {
            setError('Start date and end date are required');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            const response = await createProject(formData);
            toast.success('Project created successfully!');
            onProjectCreated(response.data);
            setFormData({
                name: '',
                description: '',
                startDate: '',
                endDate: '',
                priority: 'Medium',
                status: 'Not Started',
            });
        } catch (err) {
            const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || err.message || 'Failed to create project.';
            setError(errorMsg);
            toast.error(`Failed to create project: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            {/* Name bar/header at the top */}
            <div className={styles.nameBarSection}>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Project Name *"
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
                    placeholder="Enter project description"
                    rows="4"
                />
            </div>

            <div className={styles.dateGroup}>
                <div className={styles.formGroup}>
                    <label htmlFor="startDate">Start Date *</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="endDate">End Date *</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className={styles.selectGroup}>
                <div className={styles.formGroup}>
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
            >
                {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
        </form>
    );
}

export default CreateProjectForm; 