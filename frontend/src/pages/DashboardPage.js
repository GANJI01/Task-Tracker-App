// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { getProjects, createProject, updateProject, deleteProject, getProjectTasks } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import CreateProjectForm from '../components/CreateProjectForm';
import styles from './DashboardPage.module.css';
import { toast } from 'react-toastify';
import { FaFolder, FaTasks, FaChartBar, FaClock, FaCheckCircle, FaSyncAlt, FaUserCircle, FaListUl, FaCalendarAlt, FaStar, FaCog, FaBolt, FaSearch, FaBell, FaPlusCircle, FaPlus, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import CreateTaskForm from '../components/CreateTaskForm';
import TaskCard from '../components/TaskCard';

const tabs = [
    'List',
    'Deadline',
    'Planner',
    'Calendar',
    'Gantt',
    'My items',
    'Overdue',
    'Comments',
];

const tableHeaders = [
    '', // Checkbox
    'Name',
    'Status',
    'Progress',
    'Deadline',
    'Assignee',
    'Project',
    'Tags',
];

const sidebarMenu = [
    { icon: <FaFolder />, label: 'Projects', section: 'projects' },
    { icon: <FaListUl />, label: 'Tasks', section: 'tasks' },
    { icon: <FaChartBar />, label: 'Progress', section: 'progress' },
    { icon: <FaClock />, label: 'Pending', section: 'pending' },
    { icon: <FaCheckCircle />, label: 'Completed', section: 'completed' },
    { icon: <FaSyncAlt />, label: 'Ongoing Tasks', section: 'ongoing' },
];

function DashboardPage() {
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalType, setModalType] = useState(null); // 'task' or 'project'
    const [activeSection, setActiveSection] = useState('home'); // 'home', 'projects', 'tasks', etc.
    const [activeTab, setActiveTab] = useState('List');

    const { user } = useAuth();

    // Fetch projects on mount
    useEffect(() => {
        fetchProjects();
    }, []);

    // Fetch tasks when selected project changes
    useEffect(() => {
        if (selectedProjectId) {
            fetchTasks(selectedProjectId);
        } else {
            setTasks([]);
        }
    }, [selectedProjectId]);

    const fetchProjects = async () => {
        try {
            const response = await getProjects();
            setProjects(response.data);
            setError('');
            // If no project selected, select the first one
            if (!selectedProjectId && response.data.length > 0) {
                setSelectedProjectId(response.data[0]._id);
            }
        } catch (err) {
            setError('Failed to load projects. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTasks = async (projectId) => {
        try {
            const response = await getProjectTasks(projectId);
            setTasks(response.data);
        } catch (err) {
            setTasks([]);
        }
    };

    const handleProjectCreated = (newProject) => {
        setProjects(prev => [...prev, newProject]);
        setSelectedProjectId(newProject._id);
        setModalType(null);
        setActiveSection('projects');
    };

    const handleTaskCreated = () => {
        if (selectedProjectId) fetchTasks(selectedProjectId);
        setModalType(null);
        setActiveSection('tasks');
    };

    // Card click handler
    const handleProjectCardClick = (projectId) => {
        setSelectedProjectId(projectId);
        setActiveSection('projects');
    };

    return (
        <div className={styles.dashboardModernWithSidebar}>
            {/* Sidebar */}
            <aside className={sidebarOpen ? styles.sidebarModern : styles.sidebarModernCollapsed}>
                <div
                    className={styles.sidebarLogo}
                    onClick={() => setSidebarOpen((v) => !v)}
                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                >
                    <FaTasks size={sidebarOpen ? 32 : 38} style={{ transition: 'all 0.2s' }} />
                </div>
                {sidebarOpen && (
                    <nav className={styles.sidebarMenu}>
                        {sidebarMenu.map((item) => (
                            <div
                                key={item.label}
                                className={styles.sidebarMenuItem}
                                onClick={() => setActiveSection(item.section)}
                            >
                                <span className={styles.sidebarIcon}>{item.icon}</span>
                                <span className={styles.sidebarLabel}>{item.label}</span>
                            </div>
                        ))}
                    </nav>
                )}
            </aside>

            {/* Main Content Area */}
            <div className={styles.mainModernContent}>
                {/* Navbar */}
                <div className={styles.navbarModern}>
                    <div className={styles.navTitle}>My Task</div>
                    <div className={styles.navActions}>
                        <div className={styles.createDropdownWrapper}>
                            <button
                                className={styles.createButtonModern}
                                onClick={() => setShowDropdown((v) => !v)}
                            >
                                <FaPlus style={{ marginRight: 8 }} />
                                CREATE <FaChevronDown style={{ marginLeft: 8, fontSize: 12 }} />
                            </button>
                            {showDropdown && (
                                <div className={styles.dropdownMenu}>
                                    <button className={styles.dropdownItem} onClick={() => setModalType('task')}>New Task</button>
                                    <button className={styles.dropdownItem} onClick={() => setModalType('project')}>New Project</button>
                                </div>
                            )}
                        </div>
                        <div className={styles.searchBarWrapper}>
                            <FaSearch className={styles.searchIcon} />
                            <input
                                className={styles.searchInput}
                                type="text"
                                placeholder="search"
                            />
                        </div>
                    </div>
                </div>

                {/* Tabs/Filters Row */}
                <div className={styles.tabsRow}>
                    {tabs.map((tab) => (
                        <div
                            key={tab}
                            className={activeTab === tab ? `${styles.tabItem} ${styles.activeTab}` : styles.tabItem}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                {/* Tab Content Placeholder */}
                <div style={{ textAlign: 'center', margin: '40px 0', fontSize: 22, color: '#555' }}>
                    {activeTab === 'List' && 'This is the List view.'}
                    {activeTab === 'Deadline' && 'This is the Deadline view.'}
                    {activeTab === 'Planner' && 'This is the Planner view.'}
                    {activeTab === 'Calendar' && 'This is the Calendar view.'}
                    {activeTab === 'Gantt' && 'This is the Gantt view.'}
                    {activeTab === 'My items' && 'This is the My items view.'}
                    {activeTab === 'Overdue' && 'This is the Overdue view.'}
                    {activeTab === 'Comments' && 'This is the Comments view.'}
                </div>

                {/* Main Section Content */}
                {activeSection === 'home' && (
                    <div className={styles.emptyStateModern}>
                        <h2>No tasks or projects yet</h2>
                        <p>Click the Create button to add your first task or project.</p>
                    </div>
                )}
                {activeSection === 'projects' && (
                    <div className={styles.projectsGrid} style={{ margin: '32px 0 0 0' }}>
                        {projects.map(project => (
                            <div
                                key={project._id}
                                className={selectedProjectId === project._id ? styles.selectedProjectCard : ''}
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleProjectCardClick(project._id)}
                            >
                                <ProjectCard
                                    project={project}
                                    onEditClick={() => { }}
                                    onDeleteClick={() => { }}
                                    isProcessing={false}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {activeSection === 'tasks' && (
                    <div className={styles.tasksGrid}>
                        {tasks.length === 0 ? (
                            <div className={styles.emptyStateModern}>
                                <h2>No tasks for this project yet</h2>
                                <p>Click the Create button to add your first task.</p>
                            </div>
                        ) : (
                            tasks.map(task => (
                                <TaskCard key={task._id} task={task} />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Modal for Create Task/Project */}
            <Modal open={modalType === 'task'} onClose={() => setModalType(null)}>
                <CreateTaskForm onSuccess={handleTaskCreated} />
            </Modal>
            <Modal open={modalType === 'project'} onClose={() => setModalType(null)}>
                <CreateProjectForm onProjectCreated={handleProjectCreated} />
            </Modal>
        </div>
    );
}

function SidebarItem({ icon, label }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 32px', cursor: 'pointer', fontWeight: 500, fontSize: 17, transition: 'background 0.2s', borderRadius: 8, margin: '4px 0' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
        >
            {icon}
            <span>{label}</span>
        </div>
    );
}

function TabItem({ icon, label }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, fontSize: 16, color: '#1976d2', cursor: 'pointer', padding: '8px 18px', borderRadius: 6, transition: 'background 0.2s' }}
            onMouseOver={e => e.currentTarget.style.background = '#e3eafc'}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
        >
            {icon}
            <span>{label}</span>
        </div>
    );
}

export default DashboardPage;