import React from 'react';
import '../style/ApproveRequestModal.css'; // CSS file for modal styling

const ApproveRequestModal = ({ isOpen, onClose, onApprove, adoptionFee, setAdoptionFee }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="modal-backdrop" onClick={onClose}></div>
            <div className="modal">
                
                    <h3>Approve Adoption Request</h3>
                    <label>
                        Adoption Fee:
                        <input
                            type="number"
                            value={adoptionFee}
                            onChange={(e) => setAdoptionFee(e.target.value)}
                            placeholder="Enter adoption fee"
                        />
                    </label>
                    <div className="modal-actions">
                        <button className="modal-approve-button" onClick={() => onApprove(adoptionFee)}>
                            Approve
                        </button>
                        <button className="modal-cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                
            </div>
        </>
    );
};

export default ApproveRequestModal;
