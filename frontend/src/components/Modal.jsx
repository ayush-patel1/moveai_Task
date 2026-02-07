/**
 * Modal Component
 * Reusable modal wrapper
 */
function Modal({ isOpen, title, onClose, children }) {
    if (!isOpen) return null;

    // Close on escape key
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    // Close on backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="modal-overlay"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            <div className="modal">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="btn btn-ghost" onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;
