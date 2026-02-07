import { formatDate } from '../utils/helpers';

/**
 * TaskCard Component
 * Displays a single task with priority, status, and overdue indicators
 */
function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
    const isOverdue = task.is_overdue;

    const handleStatusChange = (e) => {
        onStatusChange(task.id, e.target.value);
    };

    return (
        <div className={`task-card ${isOverdue ? 'overdue' : ''}`}>
            <div className="task-header">
                <h3 className="task-title">{task.title}</h3>
                <div className="task-actions">
                    <button className="btn btn-ghost" onClick={() => onEdit(task)}>
                        Edit
                    </button>
                    <button className="btn btn-danger" onClick={() => onDelete(task.id)}>
                        Delete
                    </button>
                </div>
            </div>

            {task.description && (
                <p className="task-description">{task.description}</p>
            )}

            <div className="task-meta">
                <span className={`badge badge-priority-${task.priority}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>

                <select
                    className={`badge badge-status-${task.status}`}
                    value={task.status}
                    onChange={handleStatusChange}
                    style={{ cursor: 'pointer', border: 'none' }}
                >
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>

                <span className="badge badge-date">
                    Due: {formatDate(task.due_date)}
                </span>

                {isOverdue && (
                    <span className="badge badge-overdue">Overdue</span>
                )}
            </div>
        </div>
    );
}

export default TaskCard;
