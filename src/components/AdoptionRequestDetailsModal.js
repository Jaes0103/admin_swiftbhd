import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApproveModal from './ApproveModal'; // Ensure this path is correct
import ConfirmDisapproveModal from './ConfirmDisapproveModal'; // Ensure this path is correct
import '../style/AdoptionRequestDetailsModal.css';

const AdoptionRequestDetailsModal = ({
    isOpen,
    onClose,
    selectedAnimal,
    loading,
    error,
    setRequestToApprove,
    setIsApproveModalOpen,
    isApproveModalOpen,
    isDisapproveModalOpen,
    handleConfirmDisapprove,
    handleOpenDisapproveModal,
    requestToApprove,
    requestToDisapprove,
    handleApprove, // Passed from parent component
    setIsDisapproveModalOpen, // Passed from parent component
}) => {
    if (!isOpen) return null;

    // Log selectedAnimal to verify it contains adoptionRequests
    console.log("Selected Animal in Modal:", selectedAnimal);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    // Ensure that selectedAnimal is correctly populated
    if (!selectedAnimal) {
        return <p>No animal data available.</p>;
    }

    const adoptionRequests = selectedAnimal.adoptionRequests || [];  // Ensure this is an array

    return (
        <motion.div
            className="details-modal"
            initial={{ right: "-100%" }}
            animate={{ right: 0 }}
            exit={{ right: "-100%" }}
            transition={{ duration: 0.4 }}
        >
            <span className="close" onClick={onClose}>
                &times;
            </span>
            <h2>Adoption Request Details</h2>
            <div className="details-content">
                <div className="left-column">
                    <img
                        src={selectedAnimal?.imgurl || "/placeholder-image.jpg"}
                        alt={selectedAnimal?.name || "Animal"}
                    />
                    <p><strong>Name: </strong> {selectedAnimal?.name || "N/A"}</p>
                    <p><strong>Type: </strong> {selectedAnimal?.type || "N/A"}</p>
                    <p><strong>Breed: </strong> {selectedAnimal?.breed || "N/A"}</p>
                    <p><strong>Age: </strong> {selectedAnimal?.age || "N/A"}</p>
                    <p><strong>Size: </strong> {selectedAnimal?.size || "N/A"}</p>
                </div>
                <div className="right-column">
                    <p><strong>Personality: </strong> {selectedAnimal?.personality || "N/A"}</p>
                    <p><strong>Health Status: </strong> {selectedAnimal?.health_status || "N/A"}</p>
                    <p><strong>Background: </strong> {selectedAnimal?.background || "N/A"}</p>
                    <p><strong>Special Needs: </strong> {selectedAnimal?.special_needs || "N/A"}</p>
                    <p><strong>Shelter: </strong> {selectedAnimal?.shelter || "N/A"}</p>
                </div>
            </div>
            <div className="Adoption-Request-Container">
                <h3>Adoption Requests</h3>
                {selectedAnimal?.adoptionRequests?.length > 0 ? (
                    <div className="modal-adoption-request">
                        <ul>
                            {selectedAnimal.adoptionRequests.map((request) => (
                                <li key={request.id}>
                                    <p><strong>Adopter Name:</strong> {request.first_name} {request.last_name}</p>
                                    <p><strong>Contact:</strong> {request.phone_number}</p>
                                    <p><strong>Address:</strong> {request.address}, {request.city}, {request.municipality}</p>
                                    <p><strong>Status:</strong> {request.status}</p>
                                    <p><strong>Request Date:</strong> {format(new Date(request.request_date), "MM/dd/yyyy")}</p>
                                    <p><strong>Message:</strong> {request.message}</p>
                                    {request.status === "disapproved" && (
                                        <p><strong>Disapproval Reason:</strong> {request.disapproval_reason}</p>
                                    )}
                                    {request.status !== "disapproved" && (
                                        <p><strong>Adoption Fee:</strong> {request.adoption_fee}</p>
                                    )}
                                    <div className="action-buttons">
                                        {/* Approve Button */}
                                        {request.status !== "approved" && (
                                            <button
                                                className="approve-button"
                                                onClick={() => {
                                                    console.log('Approve button clicked for request:', request);
                                                    setRequestToApprove(request);
                                                    setIsApproveModalOpen(true);
                                                }}
                                            >
                                                <i className="fa fa-check-circle" aria-hidden="true"></i> Approve
                                            </button>
                                        )}
                                        {/* Disapprove Button */}
                                        {(request.status === "approved" || !request.status) && (
                                            <button
                                                className="disapprove-button"
                                                onClick={() => handleOpenDisapproveModal(request)}
                                            >
                                                <i className="fa fa-times-circle" aria-hidden="true"></i> Disapprove
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No adoption requests available for this animal.</p>
                )}
            </div>

            {/* Approve Modal */}
            {isApproveModalOpen && requestToApprove?.id && (
                <ApproveModal
                    isOpen={isApproveModalOpen}
                    onClose={() => setIsApproveModalOpen(false)}
                    adoptionRequest={requestToApprove}
                    onApprove={handleApprove}
                />
            )}

            {/* Disapprove Modal */}
            {isDisapproveModalOpen && (
                <ConfirmDisapproveModal
                    isOpen={isDisapproveModalOpen}
                    onClose={() => setIsDisapproveModalOpen(false)}
                    onConfirm={handleConfirmDisapprove}
                    adoptionRequest={requestToDisapprove}
                />
            )}
        </motion.div>
    );
};

export default AdoptionRequestDetailsModal;
