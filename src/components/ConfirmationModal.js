import React from 'react';
import '../style/ConfirmationModal.css'; 

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel, title = "Confirmation", confirmText = "Yes", cancelText = "No" }) => {
    if (!isOpen) return null; // Return null if modal should not be open

    return (
        <div className="confirmation-modal">
            <div className="modal-content">
                <h2>{title}</h2>
                <p>{message}</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="confirm-button">{confirmText}</button>
                    <button onClick={onCancel} className="cancel-button">{cancelText}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
