import { useState, useEffect } from 'react';
import { getTodayDate, formatDateForInput } from '../utils/helpers';

/**
 * TaskForm Component
 * Reusable form for creating and editing tasks
 */
function TaskForm({ task, onSubmit, onCancel }) {
    const isEditing = !!task;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'medium',
        due_date: getTodayDate(),
        status: 'todo'
    });

    const [errors, setErrors] = useState({});

    // Populate form when editing
    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                priority: task.priority || 'medium',
                due_date: formatDateForInput(task.due_date) || getTodayDate(),
                status: task.status || 'todo'
            });
        }
    }, [task]);

    const validate = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.due_date) {
            newErrors.due_date = 'Due date is required';
        } else if (!isEditing) {
            // Only validate past date for new tasks
            const dueDate = new Date(formData.due_date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (dueDate < today) {
                newErrors.due_date = 'Due date cannot be in the past';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter task title"
                />
                {errors.title && <p className="form-error">{errors.title}</p>}
            </div>

            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Enter task description (optional)"
                />
            </div>

            <div className="form-group">
                <label className="form-label">Priority *</label>
                <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="form-select"
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Due Date *</label>
                <input
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    className="form-input"
                />
                {errors.due_date && <p className="form-error">{errors.due_date}</p>}
            </div>

            {isEditing && (
                <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="todo">Todo</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>
            )}

            <div className="modal-footer" style={{ padding: 0, border: 'none', marginTop: '1rem' }}>
                <button type="button" className="btn btn-ghost" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                    {isEditing ? 'Update Task' : 'Create Task'}
                </button>
            </div>
        </form>
    );
}

export default TaskForm;
