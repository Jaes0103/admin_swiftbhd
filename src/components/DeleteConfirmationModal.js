import React from 'react';


const DeleteConfirmationModal = ({ isOpen, onClose, onDeleteConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this animal?</p>
                <div className="modal-actions">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                    <button className="confirm-button" onClick={onDeleteConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
