import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import Modal from './components/Modal';
import Toast from './components/Toast';
import { getTasks, createTask, updateTask, deleteTask } from './services/api';
import './index.css';

function App() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();

  // State
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    sortBy: 'created_at',
    order: 'desc'
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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
      setSubmitting(true);
      await createTask(formData);
      setIsModalOpen(false);
      showToast('🎉 Task created successfully!');
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  // Update task
  const handleUpdateTask = async (formData) => {
    try {
      setError(null);
      setSubmitting(true);
      await updateTask(editingTask.id, formData);
      setIsModalOpen(false);
      setEditingTask(null);
      showToast('✨ Task updated successfully!');
      fetchTasks();
    } catch (err) {
      setError(err.message || 'Failed to update task');
    } finally {
      setSubmitting(false);
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
      showToast('🗑️ Task deleted!', 'info');
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
      if (status === 'done') {
        showToast('🎯 Great job! Task completed!');
      } else {
        showToast('📝 Status updated!');
      }
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
    if (!submitting) {
      setIsModalOpen(false);
      setEditingTask(null);
    }
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get task stats
  const getStats = () => {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const overdue = tasks.filter(t => t.is_overdue).length;
    return { total, done, overdue };
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

  const stats = getStats();

  return (
    <div className="container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <header className="header">
        <div className="header-greeting">
          <h1>{getGreeting()}, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="header-subtitle">
            {stats.total === 0
              ? "Ready to be productive? Create your first task!"
              : stats.done === stats.total
                ? "🎉 All tasks complete! You're on fire!"
                : `You have ${stats.total - stats.done} task${stats.total - stats.done > 1 ? 's' : ''} to tackle today`
            }
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleCreateClick}>
            ✨ New Task
          </button>
          <button className="btn btn-ghost" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {stats.total > 0 && (
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item stat-done">
            <span className="stat-number">{stats.done}</span>
            <span className="stat-label">Done</span>
          </div>
          {stats.overdue > 0 && (
            <div className="stat-item stat-overdue">
              <span className="stat-number">{stats.overdue}</span>
              <span className="stat-label">Overdue</span>
            </div>
          )}
          <div className="stat-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${stats.total ? (stats.done / stats.total) * 100 : 0}%` }}
              />
            </div>
            <span className="progress-text">{stats.total ? Math.round((stats.done / stats.total) * 100) : 0}% complete</span>
          </div>
        </div>
      )}

      <FilterBar filters={filters} onFilterChange={setFilters} />

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="task-list-empty">
          <div className="empty-icon">📝</div>
          <h3>No tasks yet!</h3>
          <p>Create your first task and start being productive.</p>
          <button className="btn btn-primary" onClick={handleCreateClick}>
            ✨ Create First Task
          </button>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditClick}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
              style={{ animationDelay: `${index * 0.05}s` }}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        title={editingTask ? '✏️ Edit Task' : '✨ Create New Task'}
        onClose={handleCloseModal}
      >
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={handleCloseModal}
          isSubmitting={submitting}
        />
      </Modal>
    </div>
  );
}

export default App;
