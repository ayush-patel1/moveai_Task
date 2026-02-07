/**
 * FilterBar Component
 * Provides status, priority filters and sorting controls
 */
function FilterBar({ filters, onFilterChange }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value });
    };

    const handleClearFilters = () => {
        onFilterChange({
            status: '',
            priority: '',
            sortBy: 'created_at',
            order: 'desc'
        });
    };

    const hasActiveFilters = filters.status || filters.priority;

    return (
        <div className="filter-bar">
            <div className="filter-group">
                <span className="filter-label">Status</span>
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleChange}
                    className="filter-select"
                >
                    <option value="">All</option>
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                </select>
            </div>

            <div className="filter-group">
                <span className="filter-label">Priority</span>
                <select
                    name="priority"
                    value={filters.priority}
                    onChange={handleChange}
                    className="filter-select"
                >
                    <option value="">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            <div className="filter-group">
                <span className="filter-label">Sort By</span>
                <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleChange}
                    className="filter-select"
                >
                    <option value="created_at">Created Date</option>
                    <option value="due_date">Due Date</option>
                    <option value="priority">Priority</option>
                </select>
            </div>

            <div className="filter-group">
                <span className="filter-label">Order</span>
                <select
                    name="order"
                    value={filters.order}
                    onChange={handleChange}
                    className="filter-select"
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>
            </div>

            {hasActiveFilters && (
                <button className="btn btn-ghost" onClick={handleClearFilters}>
                    Clear Filters
                </button>
            )}
        </div>
    );
}

export default FilterBar;
