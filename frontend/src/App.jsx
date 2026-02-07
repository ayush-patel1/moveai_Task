import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import Modal from './components/Modal';
import { getTasks, createTask, updateTask, deleteTask } from './services/api';
import './index.css';

function App() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();

  // State
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    sortBy: 'created_at',
    order: 'desc'
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await getTasks(filters);
      setTasks(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filters, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [fetchTasks, isAuthenticated]);

  // Create task
  const handleCreateTask = async (formData) => {
    try {
      setError(null);
      await createTask(formData);
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to create task');
    }
  };

  // Update task
  const handleUpdateTask = async (formData) => {
    try {
      setError(null);
      await updateTask(editingTask.id, formData);
      setIsModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to update task');
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      setError(null);
      await deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    }
  };

  // Quick status change
  const handleStatusChange = async (id, status) => {
    try {
      setError(null);
      await updateTask(id, { status });
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  // Open edit modal
  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Open create modal
  const handleCreateClick = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="loading" style={{ minHeight: '100vh', alignItems: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // Show auth form if not logged in
  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Task Manager</h1>
        <div className="header-actions">
          <span className="user-name">👤 {user?.name}</span>
          <button className="btn btn-primary" onClick={handleCreateClick}>
            + New Task
          </button>
          <button className="btn btn-ghost" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <FilterBar filters={filters} onFilterChange={setFilters} />

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="task-list-empty">
          <p>No tasks found. Create your first task!</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditClick}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        title={editingTask ? 'Edit Task' : 'Create Task'}
        onClose={handleCloseModal}
      >
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}

export default App;
