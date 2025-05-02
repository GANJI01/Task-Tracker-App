// src/pages/ProjectDetailPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { getProjectTasks, createTask, updateTask, deleteTask } from '../services/api';
import TaskCard from '../components/TaskCard'; // Import the TaskCard component
import styles from './ProjectDetailPage.module.css'; // Import the CSS module
import { toast } from 'react-toastify'; // Import toast notifications

function ProjectDetailPage() {
  // --- State Variables ---
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // State for the new task form
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [createTaskError, setCreateTaskError] = useState('');

  // State for Editing Tasks
  const [editingTask, setEditingTask] = useState(null); // Holds the task object being edited
  const [editFormData, setEditFormData] = useState({ title: '', description: '', status: '' });
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const [updateTaskError, setUpdateTaskError] = useState('');
  // --- End State Variables ---


  // Filter and search tasks
  useEffect(() => {
    let filtered = tasks;

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(term) ||
        (task.description && task.description.toLowerCase().includes(term))
      );
    }

    setFilteredTasks(filtered);
  }, [tasks, statusFilter, searchTerm]);

  // --- Data Fetching ---
  const fetchTasks = useCallback(async () => {
    // Prevent unnecessary fetches if already loading
    if (isLoading && !tasks.length) return;

    setIsLoading(true);
    setError('');
    try {
      const response = await getProjectTasks(projectId);
      setTasks(response.data || []);
    } catch (err) {
      console.error(`Failed to fetch tasks for project ${projectId}:`, err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to load tasks.';
      setError(errorMsg);
      if (err.response?.status === 404) setError(`Project with ID ${projectId} not found.`);
      if (err.response?.status === 403 || err.response?.status === 401) setError('You are not authorized to view tasks for this project.');
    } finally {
      setIsLoading(false);
    }
  }, [projectId, isLoading, tasks.length]); // Dependencies for useCallback

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]); // Fetch only when projectId changes
  // --- End Data Fetching ---


  // Handle drag and drop
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const taskId = result.draggableId;
    const newStatus = destination.droppableId;

    // Update the task status in the backend
    try {
      await updateTask(taskId, { status: newStatus });

      // Update the local state
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task._id === taskId
            ? { ...task, status: newStatus }
            : task
        )
      );

      toast.success('Task status updated successfully!');
    } catch (err) {
      console.error('Failed to update task status:', err);
      toast.error('Failed to update task status');
      // Refresh tasks to ensure UI is in sync with backend
      fetchTasks();
    }
  };

  // Group tasks by status
  const groupedTasks = {
    'todo': filteredTasks.filter(task => task.status === 'todo'),
    'in-progress': filteredTasks.filter(task => task.status === 'in-progress'),
    'done': filteredTasks.filter(task => task.status === 'done')
  };

  // --- Event Handlers ---
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) { setCreateTaskError('Task title cannot be empty.'); return; }
    setIsCreatingTask(true); setCreateTaskError('');
    try {
      const response = await createTask(projectId, { title: newTaskTitle, description: newTaskDescription });
      setTasks(prevTasks => [...prevTasks, response.data]);
      setNewTaskTitle(''); setNewTaskDescription('');
      toast.success('Task created successfully!'); // Use toast
    } catch (err) {
      console.error('Failed to create task:', err);
      const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || err.message || 'Failed to create task.';
      setCreateTaskError(errorMsg);
      toast.error(`Failed to create task: ${errorMsg}`); // Use toast
    } finally { setIsCreatingTask(false); }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setEditFormData({ title: task.title, description: task.description || '', status: task.status });
    setUpdateTaskError('');
  };

  const handleEditFormChange = (e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value });

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!editingTask) return;
    if (!editFormData.title.trim()) { setUpdateTaskError('Task title cannot be empty.'); return; }
    setIsUpdatingTask(true); setUpdateTaskError('');
    try {
      const response = await updateTask(editingTask._id, { title: editFormData.title, description: editFormData.description, status: editFormData.status });
      setTasks(tasks.map(task => task._id === editingTask._id ? response.data : task));
      setEditingTask(null);
      toast.success('Task updated successfully!'); // Use toast
    } catch (err) {
      console.error('Failed to update task:', err);
      const errorMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || err.message || 'Failed to update task.';
      setUpdateTaskError(errorMsg);
      toast.error(`Failed to update task: ${errorMsg}`); // Use toast
    } finally { setIsUpdatingTask(false); }
  };

  const handleCancelEdit = () => { setEditingTask(null); setUpdateTaskError(''); };

  const handleDeleteTask = async (taskIdToDelete) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(taskIdToDelete);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskIdToDelete));
      toast.success('Task deleted successfully!'); // Use toast
    } catch (err) {
      console.error('Failed to delete task:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
      toast.error(`Failed to delete task: ${errorMsg}`); // Use toast
    }
  };
  // --- End Event Handlers ---

  // Calculate progress
  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const progress = calculateProgress();

  // --- Render Logic ---
  if (isLoading) return <div className={styles.pageContainer}>Loading project tasks...</div>;

  if (error) return (
    <div className={styles.pageContainer}>
      <p className="error-message">Error: {error}</p> {/* Use global error class */}
      <Link to="/dashboard" className={styles.backLink}>← Back to Dashboard</Link>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Project Tasks</h1>
        <Link to="/dashboard" className={styles.backButton}>Back to Dashboard</Link>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <h2>Project Progress</h2>
          <span className={styles.progressText}>{progress}%</span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className={styles.progressStats}>
          <span>{tasks.filter(task => task.status === 'done').length} of {tasks.length} tasks completed</span>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className={styles.searchFilterSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterBox}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      {/* Task Creation Form */}
      <div className={styles.taskForm}>
        <h2>Create New Task</h2>
        <form onSubmit={handleCreateTask}>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Task Title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <textarea
              placeholder="Task Description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className={styles.textarea}
            />
          </div>
          {createTaskError && <p className={styles.error}>{createTaskError}</p>}
          <button type="submit" disabled={isCreatingTask} className={styles.button}>
            {isCreatingTask ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>

      {/* Tasks Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.board}>
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className={styles.column}>
              <h3 className={styles.columnTitle}>
                {status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Done'}
              </h3>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={styles.taskList}
                  >
                    {tasks.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard
                              task={task}
                              onEdit={handleEditClick}
                              onDelete={handleDeleteTask}
                              isEditing={editingTask?._id === task._id}
                              editFormData={editFormData}
                              onEditFormChange={handleEditFormChange}
                              onUpdate={handleUpdateTask}
                              onCancelEdit={handleCancelEdit}
                              isUpdating={isUpdatingTask}
                              updateError={updateTaskError}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
  // --- End Render Logic ---
}

export default ProjectDetailPage;