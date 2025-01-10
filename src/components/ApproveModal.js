import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../style/ApproveModal.css';

const ApproveModal = ({ isOpen, onClose, adoptionRequest, onApprove }) => {
    const [adoptionFee, setAdoptionFee] = useState('');

    if (!isOpen || !adoptionRequest) {
        return null;
    }

    const handleSaveFee = () => {
        if (adoptionFee.trim() === '' || isNaN(adoptionFee)) {
            alert('Please enter a valid adoption fee.');
            return;
        }
        onApprove(adoptionFee); // Pass the fee to the parent handler
    };
    console.log("Selected Animal in Modal:", adoptionRequest    );
    return (
        <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="approve-modal">
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                <h2>Adoption Request Details</h2>
                <div className="request-details">
                    <p>
                        <strong>Requester Name:</strong>{' '}
                        {adoptionRequest.first_name || 'N/A'}
                        {adoptionRequest.last_name || 'N/A'}
                    </p>
                    <p>
                        <strong>Contact:</strong>{' '}
                        {adoptionRequest.phone_number || 'N/A'}
                    </p>
                    <p>
                        <strong>Address:</strong>{' '}
                        {adoptionRequest.address || 'N/A'}, {adoptionRequest.city || 'N/A'},{' '}
                        {adoptionRequest.municipality || 'N/A'}
                    </p>
                    <p>
                        <strong>Animal Name:</strong>{' '}
                        {adoptionRequest.name || 'N/A'}
                    </p>
                    <p>
                        <strong>Status:</strong>{' '}
                        {adoptionRequest.status || 'N/A'}
                    </p>
                    <p>
                        <strong>Message:</strong>{' '}
                        {adoptionRequest.message || 'N/A'}
                    </p>
                </div>
                <div className="adoption-fee-input">
                    <label>
                        <strong>Adoption Fee:</strong>
                    </label>
                    <input
                        type="number"
                        value={adoptionFee}
                        onChange={(e) => setAdoptionFee(e.target.value)}
                        placeholder="Enter adoption fee"
                    />
                </div>
                <div className="modal-actions">
                    <button className="approve-button" onClick={handleSaveFee}>
                        Save & Approve
                    </button>
                    <button className="close-button" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ApproveModal;
