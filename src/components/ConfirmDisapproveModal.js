import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../style/ConfirmDisapproveModal.css';

const ConfirmDisapproveModal = ({ isOpen, onClose, onConfirm, adoptionRequest }) => {
    const [reason, setReason] = useState(''); // State to hold the disapproval reason
    const [isConfirmed, setIsConfirmed] = useState(false); // State to track confirmation

    if (!isOpen) {
        return null; // Do not render if modal is not open
    }

    const handleConfirm = () => {
        // Pass the reason for disapproval to the parent function
        onConfirm(adoptionRequest.id, reason);
        setIsConfirmed(true); // Show confirmation message

        // Auto-close modal after a short delay
        setTimeout(() => {
            setIsConfirmed(false);
            onClose();
            setReason(''); // Reset the reason field
        }, 2000);
    };

    return (
        <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="confirm-disapprove-modal">
                <span className="close" onClick={onClose}>&times;</span>

                {/* Show Confirmation Message */}
                {isConfirmed ? (
                    <div className="confirmation-message">
                        <h2>Request Disapproved!</h2>
                        <p>The adoption request for <strong>{adoptionRequest.name}</strong> has been disapproved.</p>
                    </div>
                ) : (
                    <>
                        <h2>Are you sure you want to disapprove this adoption request?</h2>
                        <p><strong>Requester Name:</strong> {adoptionRequest.first_name} {adoptionRequest.last_name}</p>
                        <p><strong>Animal Name:</strong> {adoptionRequest.name}</p>
                        <p><strong>Message:</strong> {adoptionRequest.message}</p>

                        <p><strong>Reason for Disapproval:</strong></p>
                        <textarea
                            id="reason"
                            rows="4"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter reason here..."
                        />

                        <div className="modal-actions">
                            <button
                                onClick={handleConfirm}
                                className="confirm-button"
                                disabled={!reason.trim()}
                            >
                                Yes, Disapprove
                            </button>
                            <button onClick={onClose} className="cancel-button">Cancel</button>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default ConfirmDisapproveModal;
