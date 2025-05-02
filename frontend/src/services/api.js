// src/services/api.js
import axios from 'axios';

// Determine the base URL
// Use the environment variable if set, otherwise fallback (optional)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
console.log(`API Base URL set to: ${API_BASE_URL}`); // Add log for debugging

// Create an Axios instance
const api = axios.create({
  // Set the base URL for all requests
  // Make sure this matches the port your backend server is running on
  // If using CRA proxy, this might be just '/api'
  // If running frontend/backend separately without proxy, use full URL
  baseURL: 'http://localhost:5000/api', // ADJUST PORT IF NEEDED
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  Request Interceptor:
  This function will run before each request is sent.
  It checks if a token exists in localStorage and adds it
  to the Authorization header if found.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Configure the header in the standard 'Bearer <token>' format
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Important: return the config object so the request can proceed
    return config;
  },
  (error) => {
    // Handle request errors (e.g., network issues)
    return Promise.reject(error);
  }
);

/*
  Response Interceptor (Optional but Recommended):
  Handle global errors like 401 Unauthorized.
*/
api.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  (error) => {
    // Handle specific error statuses globally
    if (error.response?.status === 401) {
      // Example: Token is invalid or expired
      console.error('Unauthorized! Logging out.');
      // Remove the invalid token
      localStorage.removeItem('authToken');
      // Redirect to login page (or trigger logout logic from context if possible)
      // This is tricky from here, often better handled in components or context
      // For simplicity, we'll just redirect. You might need a more robust solution.
      if (window.location.pathname !== '/login') { // Avoid redirect loop
        window.location.href = '/login';
      }
    }
    // Important: return the error so components can handle other errors
    return Promise.reject(error);
  }
);


// === Authentication Endpoints ===
export const signupUser = (userData) => api.post('/auth/signup', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => api.post('/auth/reset-password', { token, password });

// === Project Endpoints ===
export const getProjects = () => api.get('/projects');
export const createProject = (projectData) => api.post('/projects', projectData);
// Add more project endpoints as needed (getById, update, delete)
// export const getProjectById = (projectId) => api.get(`/projects/${projectId}`);
export const updateProject = (projectId, projectData) => api.put(`/projects/${projectId}`, projectData); // <-- NEW
export const deleteProject = (projectId) => api.delete(`/projects/${projectId}`); // <-- NEW

// export const updateProject = (projectId, projectData) => api.put(`/projects/${projectId}`, projectData);
// export const deleteProject = (projectId) => api.delete(`/projects/${projectId}`);


// === Task Endpoints ===
// Get all tasks for a specific project
export const getProjectTasks = (projectId) => api.get(`/tasks/${projectId}`);
// Create a new task for a specific project
export const createTask = (projectId, taskData) => api.post(`/tasks/${projectId}`, taskData);
// Get a single task by its ID
export const getTaskById = (taskId) => api.get(`/tasks/task/${taskId}`);
// Update a task by its ID
export const updateTask = (taskId, taskData) => api.put(`/tasks/${taskId}`, taskData);
// Delete a task by its ID
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);


// Export the configured instance if you need to use it directly elsewhere (optional)
// export default api;

// We are exporting named functions for clarity