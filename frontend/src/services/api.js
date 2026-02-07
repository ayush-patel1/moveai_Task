const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Get auth token from localStorage
 */
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Fetch all tasks with optional filters
 */
export const getTasks = async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);
    if (filters.overdue) params.append('overdue', 'true');

    const response = await fetch(`${API_BASE_URL}/tasks?${params}`, {
        headers: { ...getAuthHeader() }
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch tasks');
    }

    return data;
};

/**
 * Create a new task
 */
export const createTask = async (taskData) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(taskData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to create task');
    }

    return data;
};

/**
 * Update an existing task
 */
export const updateTask = async (id, taskData) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        },
        body: JSON.stringify(taskData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to update task');
    }

    return data;
};

/**
 * Delete a task
 */
export const deleteTask = async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { ...getAuthHeader() }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to delete task');
    }

    return data;
};
