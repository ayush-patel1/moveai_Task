/**
 * Format date for display (YYYY-MM-DD to readable format)
 */
export const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

/**
 * Format date for input field (YYYY-MM-DD)
 */
export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
};
