import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/AdoptableAnimalsPage.css';
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaInfoCircle } from 'react-icons/fa';
import ConfirmationModal from './ConfirmationModal';
import Sidebar from './Sidebar';
import ErrorModal from '../style/ErrorModal.css';
import ApproveModal from './ApproveModal';
import ConfirmDisapproveModal from './ConfirmDisapproveModal';
import { motion } from "motion/react"
import { format } from 'date-fns';
import { FaSortUp, FaSortDown } from 'react-icons/fa';  
import AdoptionRequestDetailsModal from "./AdoptionRequestDetailsModal";
const AdoptableAnimalsPage = () => {
    const [searchQueryRequests, setSearchQueryRequests] = useState(''); 
    const [searchQueryAnimals, setSearchQueryAnimals] = useState('');
    const [filteredAnimals, setFilteredAnimals] = useState([]); 
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [isDisapproveModalOpen, setIsDisapproveModalOpen] = useState(false);
    const [requestToDisapprove, setRequestToDisapprove] = useState(null);
    const [errors, setErrors] = useState({});
    const [adoptableAnimals, setAdoptableAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [animalToDelete, setAnimalToDelete] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState('');
    const [adoptionRequestToDelete, setAdoptionRequestToDelete] = useState(null);
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
    const [success, setSuccess] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [adoptionRequests, setAdoptionRequests] = useState([]);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false); 
    const [requestToApprove, setRequestToApprove] = useState(null); 
    const [adoptionFee, setAdoptionFee] = useState('');
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [sortOrder, setSortOrder] = useState("desc");  
    const [sortBy, setSortBy] = useState("request_date");  
    const [showMoreInfo, setShowMoreInfo] = useState(false);
    const [showAdoptionRequestModal, setShowAdoptionRequestModal] = useState(false);
    const [selectedRequestAnimal, setSelectedRequestAnimal] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState({
        adoptionRequests: [],
    });
    const [editAnimal, setEditAnimal] = useState({
        name: '',
        type: '',
        breed: '',
        age: '',
        size: '',
        personality: '',
        health_status: '',
        background: '',
        special_needs: ''
      });      
    
    const [newAnimal, setNewAnimal] = useState({
        id: null,
        name: '',
        type: '',
        breed: '',
        age: '',
        size: '',
        personality: '',
        health_status: '',
        background: '',
        special_needs: '',
        shelter: '',
        img: null,
        imgurl: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; 
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedRequests = adoptionRequests.slice(startIndex, endIndex);
    const fetchAdoptableAnimals = async () => {
        try {
            const url = `${process.env.REACT_APP_BASE_URL}/api/admin/adoptable-animals`;
            const response = await axios.get(url);
            console.log('Fetched animals:', response.data.animals);  
            setAdoptableAnimals(response.data.animals);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Error fetching adoptable animals');
        } finally {
            setLoading(false);
        }
    };
    const fetchAnimalAndRequests = async (animalId) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/adoptable-animals/${animalId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            const data = await response.json();
            
            // Log the full response to see the structure
            console.log('Fetched data:', data);  // Should show both animal and adoptionRequests
            
            if (data.animal) {
                // Combine the animal data and the adoptionRequests into one object
                setSelectedAnimal({
                    ...data.animal,         // Include all animal properties
                    adoptionRequests: data.adoptionRequests || []  // Include adoptionRequests, default to empty array if none
                });
            } else {
                setError('No data found for this animal.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching animal and adoption requests.');
        } finally {
            setLoading(false);
        }
    };
     
    
    const fetchAdoptionRequests = async (searchQuery = '') => {
        try {
            const url = `${process.env.REACT_APP_BASE_URL}/api/admin/adoption-requests?search=${searchQuery}`;
            const response = await axios.get(url);

            console.log('Fetched adoption requests:', response.data.adoptionRequests);
            setAdoptionRequests(response.data.adoptionRequests);
            setFilteredRequests(response.data.adoptionRequests); 
        } catch (err) {
            console.error('Error fetching adoption requests:', err);
            setError('Error fetching adoption requests');
        } finally {
            setLoading(false);
        }
    };

    const fetchAdoptionRequestsForAnimal = async (animalId) => {
        try {
            const url = `${process.env.REACT_APP_BASE_URL}/api/admin/adoption-requests/${animalId}`;
            const response = await axios.get(url);
            return response.data || { adoptionRequests: [] }; 
        } catch (err) {
            console.error('Error fetching adoption requests:', err);
            return { adoptionRequests: [] }; 
        }
    };
    const linkAdoptionRequestsToAnimals = (animals, requests) => {
        return animals.map((animal) => {
            // Filter requests for the current animal
            const associatedRequests = requests.filter(
                (request) => String(request.animal_id) === String(animal.id)
            );

            console.log(`Animal: ${animal.name}, Associated Requests:`, associatedRequests);

            // Always ensure the adoptionRequests field is an array (empty if none)
            return {
                ...animal,
                adoptionRequests: associatedRequests.length > 0 ? associatedRequests : [],
            };
        });
    };

    const handleShowModal = async (request) => {
        const animalData = await fetchAnimalAndRequests(request.animal_id);
        setSelectedRequestAnimal(animalData);  
        setShowAdoptionRequestModal(true);
    };

    const handleSearchAnimals = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQueryAnimals(query);

        const filtered = adoptableAnimals.filter((animal) => {
            return (
                animal.name.toLowerCase().includes(query) ||
                animal.type.toLowerCase().includes(query) ||
                animal.breed.toLowerCase().includes(query)
            );
        });

        setFilteredAnimals(filtered);
    };
    useEffect(() => {
        fetchAdoptableAnimals();
    }, []);
    const handleSearchRequests = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQueryRequests(query);
    
        const filtered = query
            ? adoptionRequests.filter((request) => {
                  return (
                      request.id.toString().includes(query) ||
                      request.reporter_name.toLowerCase().includes(query) ||
                      request.name.toLowerCase().includes(query) ||
                      request.status.toLowerCase().includes(query)
                  );
              })
            : adoptionRequests;  
        console.log('Search query:', query);  
        console.log('Filtered Requests:', filtered);  
    
        setFilteredRequests(filtered);  
    };
    useEffect(() => {
        fetchAdoptionRequests(); 
    }, []);
    const handleSortByDate = () => {
        const newSortOrder = sortOrder === "desc" ? "asc" : "desc"; 
        setSortOrder(newSortOrder);

        const sortedRequests = [...filteredRequests].sort((a, b) => {
            const dateA = new Date(a.request_date);
            const dateB = new Date(b.request_date);

            if (newSortOrder === "desc") {
                return dateB - dateA;  
            } else {
                return dateA - dateB;  
            }
        });

        setFilteredRequests(sortedRequests);
    };
    
    const handleAnimalSelection = (animal) => {
        console.log('Selected animal:', animal);
        setSelectedAnimal(animal);
        setLoading(true);
        fetchAdoptionRequestsForAnimal(animal.id);
    };
   
    const handleApproveRequest = (request) => {
        console.log('Request to approve:', request);
        setRequestToApprove(request);
        setAdoptionFee('');
        setIsApproveModalOpen(true);
    };
    const handleEditClick = () => {
        setShowEditModal(true);
      };
      
    const handleSaveChanges = () => {
        setIsEditing(false);
        setShowEditModal(false); 
    };

    const handleCloseDetails = () => {
        setShowMoreDetails(false);
    };
    

    const handleApprove = async (fee) => {
        if (!requestToApprove || !requestToApprove.id) {
            console.error('No request to approve or request ID is missing');
            return;
        }
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/api/admin/adoption-requests/${requestToApprove.id}`,
                {
                    adoption_fee: parseFloat(fee), 
                    action: 'approve', 
                }
            );            
            console.log('Approval response:', response.data);

            setSelectedAnimal((prevAnimal) => ({
                ...prevAnimal,
                adoptionRequests: prevAnimal.adoptionRequests.map((request) =>
                    request.id === requestToApprove.id
                        ? { ...request, status: 'Approved', adoption_fee: fee }
                        : request
                ),
            }));
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Failed to approve the request. Please try again.');
        } finally {
            setIsApproveModalOpen(false);
            setRequestToApprove(null);
        }
    };
    const handleOpenDisapproveModal = (request) => {
        console.log('Disapprove button clicked', request);  
        setRequestToDisapprove(request); 
        setIsDisapproveModalOpen(true); 
    };
    
    const handleConfirmDisapprove = (requestId, reason) => {
        console.log('Disapproving request:', { requestId, reason }); 
        handleDisapprove(requestId, reason);  
        setIsDisapproveModalOpen(false); 
        setRequestToDisapprove(null);  
    };
    
    const handleDisapprove = async (id, reason) => {
        console.log('Sending Disapprove Request:', { id, reason }); 
    
        if (!id || !reason) {
            console.error('Request ID or disapproval reason is missing');
            alert('Please provide a reason for disapproval.');
            return;
        }
    
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/api/admin/disapprove`,
                {
                    requestId: id,
                    disapprovalReason: reason,
                }
            );
    
            console.log('Response from server:', response.data);
            alert('Request has been successfully disapproved.');
            fetchAdoptionRequests();
        } catch (error) {
            console.error('Error disapproving request:', error);
            alert('Failed to disapprove the request. Please try again.');
        }
    };
    
    
    useEffect(() => {
        fetchAdoptableAnimals();
        fetchAdoptionRequests();
    }, []);
    const handleAnimalChange = (e) => {
        const { name, value } = e.target;
    
       
        let error = "";
    
        switch (name) {
            case "age":
                if (!/^\d*$/.test(value)) { 
                    error = "Age must be a number.";
                }
                break;
            case "name":
            case "type":
            case "breed":
            case "personality":
            case "health_status":
            case "shelter":
            case "special_needs":
            case "background":
                if (/\d/.test(value)) { 
                    error = `${name.charAt(0).toUpperCase() + name.slice(1)} must not contain numbers.`;
                }
                break;
            default:
                break;
        }
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
    
        if (!error) {
            setNewAnimal({ ...newAnimal, [name]: value });
        }
    };
    
    const handleMoreDetails = async (animal) => {
        console.log("Selected animal:", animal);
        setLoading(true); 
        const requests = await fetchAdoptionRequestsForAnimal(animal.id);
        setSelectedAnimal({
            ...animal,
            adoptionRequests: requests?.adoptionRequests || [],
        });
        setLoading(false); 
        setShowMoreDetails(true);
    };
    
    const handleImageChange = (e) => {
        setNewAnimal({ ...newAnimal, img: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(newAnimal).forEach((key) => {
            formData.append(key, newAnimal[key]);
        });

        try {
            const url = editMode
                ? `${process.env.REACT_APP_BASE_URL}/api/admin/update-adoptable-animal/${newAnimal.id}`
                : `${process.env.REACT_APP_BASE_URL}/api/admin/add-adoptable-animal`;
            const method = editMode ? 'put' : 'post';
            const response = await axios[method](url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const updatedAnimal = response.data;

            if (editMode) {
                setAdoptableAnimals((prev) =>
                    prev.map((animal) => (animal.id === updatedAnimal.id ? updatedAnimal : animal))
                );
            } else {
                setAdoptableAnimals((prev) => [...prev, updatedAnimal]);
            }

            resetForm();
            setModalOpen(false);
            setCurrentPage(1);

        } catch (err) {
            console.error('Error adding/updating animal:', err);
            setError(editMode ? 'Error updating animal' : 'Error adding animal');
        }
    };

    const handleEdit = (animal) => {
        setEditAnimal({ ...animal });
        console.log("Editing animal:", animal);  
        setShowEditModal(true);
    };
    
    const handleDeleteAdoptionRequest = (requestId) => {
        setAdoptionRequestToDelete(requestId);
        setDeleteMessage('Are you sure you want to delete this adoption request? This action cannot be undone.');
        setIsDeleteModalOpen(true); 
    };
    const handleDelete = (animalId) => {
        console.log('Deleting animal with ID:', animalId);
        setAnimalToDelete(animalId);
        setDeleteMessage('Are you sure you want to delete this animal? This action cannot be undone.');
        setIsDeleteModalOpen(true); 
    };

    const confirmDelete = async () => {
        console.log('Confirmed deletion for animal ID:', animalToDelete); 
        if (animalToDelete) {
            const url = `${process.env.REACT_APP_BASE_URL}/api/admin/delete-adoptable-animal/${animalToDelete}`;
            try {
                const response = await axios.delete(url);
                console.log('Delete response:', response.data); 

                if (response.status === 200) {
                    setAdoptableAnimals((prev) => prev.filter((animal) => animal.id !== animalToDelete));
                    setIsDeleteModalOpen(false);
                    setAnimalToDelete(null); 
                    setSuccess('Animal deleted successfully'); 
                } else {
                    setError(response.data.error || 'Error deleting animal'); 
                }
            } catch (error) {
                console.error('Error confirming delete:', error);
                if (error.response) {
                    setError(error.response.data.error || 'Error deleting animal');
                } else {
                    setError('Network error or server did not respond');
                }
            }
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setAnimalToDelete(null); 
        setError(null); 
        setSuccess(null); 
    };

    const closeErrorModal = () => {
        setIsErrorModalOpen(false); 
        setErrorMessage(''); 
    };
    const resetForm = () => {
        setNewAnimal({
            id: null,
            name: '',
            type: '',
            breed: '',
            age: '',
            size: '',
            personality: '',
            health_status: '',
            background: '',
            special_needs: '',
            shelter: '',
            img: null,
            imgurl: '',
        });
        setEditMode(false);
    };

    const toggleModal = () => {
        resetForm();
        setModalOpen(!isModalOpen);
    };

    const totalPages = Math.ceil(adoptableAnimals.length / itemsPerPage);
    const displayedAnimals = adoptableAnimals.filter((animal) => {
        return (
            animal.name.toLowerCase().includes(searchQueryAnimals.toLowerCase()) ||
            animal.type.toLowerCase().includes(searchQueryAnimals.toLowerCase()) ||
            animal.breed.toLowerCase().includes(searchQueryAnimals.toLowerCase())
        );
    });
    

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };
    
    
    if (loading) {
        return <p>Loading adoptable animals...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }
    
    return (
        <div className="adoptable-animals-container">
            <Sidebar />
            <h1>Adoptable Animals</h1>
            <button className='add-animal-button' onClick={toggleModal}>Add Adoptable Animal</button>
            {isModalOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-box">
                        <span className="close" onClick={toggleModal}>
                            &times;
                        </span>
                        <h4>{editMode ? 'Edit Adoptable Animal' : 'Add Adoptable Animal'}</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newAnimal.name}
                                        onChange={handleAnimalChange}
                                        required
                                    />
                                    {errors.name && <span className="error">{errors.name}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Type:</label>
                                    <input
                                        type="text"
                                        name="type"
                                        value={newAnimal.type}
                                        onChange={handleAnimalChange}
                                        required
                                    />
                                    {errors.type && <span className="error">{errors.type}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Breed:</label>
                                    <input
                                        type="text"
                                        name="breed"
                                        value={newAnimal.breed}
                                        onChange={handleAnimalChange}
                                        required
                                    />
                                    {errors.breed && <span className="error">{errors.breed}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Age:</label>
                                    <input
                                        type="text"
                                        name="age"
                                        value={newAnimal.age}
                                        onChange={handleAnimalChange}
                                        required
                                    />
                                    {errors.age && <span className="error">{errors.age}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Size:</label>
                                    <input
                                        type="text"
                                        name="size"
                                        value={newAnimal.size}
                                        onChange={handleAnimalChange}
                                        required
                                    />
                                    {errors.size && <span className="error">{errors.size}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Personality:</label>
                                    <input
                                        type="text"
                                        name="personality"
                                        value={newAnimal.personality}
                                        onChange={handleAnimalChange}
                                        required
                                    />
                                    {errors.personality && <span className="error">{errors.personality}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Health Status:</label>
                                    <input
                                        type="text"
                                        name="health_status"
                                        value={newAnimal.health_status}
                                        onChange={handleAnimalChange}
                                        required
                                    />
                                    {errors.health_status && <span className="error">{errors.health_status}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Shelter:</label>
                                    <input
                                        type="text"
                                        name="shelter"
                                        value={newAnimal.shelter}
                                        onChange={handleAnimalChange}
                                        required
                                    />
                                    {errors.shelter && <span className="error">{errors.shelter}</span>}
                                </div>
                            </div>

                            {newAnimal.imgurl && (
                                <div className="form-group">
                                    <label>Current Image:</label>
                                    <img
                                        src={newAnimal.imgurl}
                                        alt={newAnimal.name}
                                        style={{ width: '100px', height: 'auto' }}
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Image:</label>
                                <input
                                    type="file"
                                    name="img"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    required={!editMode}
                                />
                            </div>

                            <div className="form-group">
                                <label>Special Needs:</label>
                                <input
                                    type="text"
                                    name="special_needs"
                                    value={newAnimal.special_needs}
                                    onChange={handleAnimalChange}
                                    required
                                />
                                {errors.special_needs && <span className="error">{errors.special_needs}</span>}
                            </div>

                            <div className="form-group">
                                <label>Background:</label>
                                <input
                                    type="text"
                                    name="background"
                                    value={newAnimal.background}
                                    onChange={handleAnimalChange}
                                    required
                                />
                                {errors.background && <span className="error">{errors.background}</span>}
                            </div>

                            <button type="submit">
                                {editMode ? 'Update Animal' : 'Add Animal'}
                            </button>
                            <button type="button" onClick={toggleModal}>
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            )}
            {isDeleteModalOpen && (
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    message={deleteMessage}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                    title="Confirm Deletion"
                />
            )}
            {isErrorModalOpen && (
                <ErrorModal
                    isOpen={isErrorModalOpen}
                    message={errorMessage}
                    onClose={closeErrorModal}
                />
             )}
                <div>
                {/* Details Modal */}
                {showMoreDetails && (
                    <motion.div
                        className="details-modal"
                        initial={{ right: '-100%' }}
                        animate={{ right: 0 }}
                        exit={{ right: '-100%' }}
                        transition={{ duration: 0.4 }}
                    >
                        <span className="close" onClick={handleCloseDetails}>
                            &times;
                        </span>
                        <h2>Animal Information</h2>
                        <div className="details-content">
                            <div className="left-column">
                                <img
                                    src={selectedAnimal.imgurl || '/placeholder-image.jpg'}
                                    alt={selectedAnimal.name || 'Animal'}
                                />
                                {!isEditing ? (
                                    <>
                                        <p><strong>Name: </strong> {selectedAnimal.name || 'N/A'}</p>
                                        <p><strong>Type: </strong> {selectedAnimal.type || 'N/A'}</p>
                                        <p><strong>Breed: </strong> {selectedAnimal.breed || 'N/A'}</p>
                                        <p><strong>Age: </strong> {selectedAnimal.age || 'N/A'}</p>
                                        <p><strong>Size: </strong> {selectedAnimal.size || 'N/A'}</p>
                                    </>
                                ) : (
                                    <>
                                        <label><strong>Name:</strong></label>
                                        <input
                                            type="text"
                                            value={editAnimal.name}
                                            onChange={(e) =>
                                                setEditAnimal({ ...editAnimal, name: e.target.value })
                                            }
                                            style={{ width: '200px' }}
                                        />
                                        <label><strong>Type:</strong></label>
                                        <input
                                            type="text"
                                            value={editAnimal.type}
                                            onChange={(e) =>
                                                setEditAnimal({ ...editAnimal, type: e.target.value })
                                            }
                                        />
                                        <label><strong>Breed:</strong></label>
                                        <input
                                            type="text"
                                            value={editAnimal.breed}
                                            onChange={(e) =>
                                                setEditAnimal({ ...editAnimal, breed: e.target.value })
                                            }
                                        />
                                        <label><strong>Age:</strong></label>
                                        <input
                                            type="text"
                                            value={editAnimal.age}
                                            onChange={(e) =>
                                                setEditAnimal({ ...editAnimal, age: e.target.value })
                                            }
                                            style={{ width: '100px' }}
                                        />
                                        <label><strong>Size:</strong></label>
                                        <input
                                            type="text"
                                            value={editAnimal.size}
                                            onChange={(e) =>
                                                setEditAnimal({ ...editAnimal, size: e.target.value })
                                            }
                                        />
                                    </>
                                )}
                            </div>
                            <div className="right-column">
                                <p><strong>Personality: </strong> {selectedAnimal.personality || 'N/A'}</p>
                                <p><strong>Health Status: </strong> {selectedAnimal.health_status || 'N/A'}</p>
                                <p><strong>Background: </strong> {selectedAnimal.background || 'N/A'}</p>
                                <p><strong>Special Needs: </strong> {selectedAnimal.special_needs || 'N/A'}</p>
                                <p><strong>Shelter: </strong> {selectedAnimal.shelter || 'N/A'}</p>
                            </div>
                        </div>
                        <div className='edit'>
                        {!isEditing && (
                            <button className="edit-button" onClick={() => setShowEditModal(true)}>
                                Edit Animal
                            </button>
                        )}
                        </div>
                        <div className="Adoption-Request-Container">
                            <h3>Adoption Requests</h3>
                            {loading ? (
                                <p>Loading adoption requests...</p>
                            ) : error ? (
                                <p className="error-message">{error}</p>
                            ) : selectedAnimal?.adoptionRequests?.length > 0 ? (
                                <div className="modal-adoption-request">
                                    <ul>
                                        {selectedAnimal.adoptionRequests.map((request) => (
                                            <li key={request.id}>
                                                <p>
                                                    <strong>Adopter Name:</strong>{' '}
                                                    {request.first_name} {request.last_name}
                                                </p>
                                                <p><strong>Contact:</strong> {request.phone_number}</p>
                                                <p><strong>Address:</strong> {request.address}, {request.city}, {request.municipality}</p>
                                                <p><strong>Status:</strong> {request.status}</p>
                                                <p><strong>Request Date:</strong> {format(new Date(request.request_date), 'MM/dd/yyyy')}</p>
                                                <p><strong>Message:</strong> {request.message}</p>
                                                {request.status === 'disapproved' && (
                                                <p><strong>Disapproval Reason:</strong> {request.disapproval_reason}</p>
                                                )}
                                                {request.status !== 'disapproved' && (
                                                    <p><strong>Adoption Fee:</strong> {request.adoption_fee}</p>
                                                )}

                                                <div className="action-buttons">
                                                {request.status !== 'approved' && (
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
                                                {(request.status === 'approved' || !request.status) && (
                                                    <button
                                                        className="disapprove-button"
                                                        onClick={() => handleOpenDisapproveModal(request)}
                                                    >
                                                        <i className="fa fa-times-circle" aria-hidden="true"></i> Disapprove
                                                    </button>
                                                )}

                                                {isApproveModalOpen && requestToApprove?.id === request.id && (
                                                    <ApproveModal
                                                        isOpen={isApproveModalOpen}
                                                        onClose={() => setIsApproveModalOpen(false)}
                                                        adoptionRequest={requestToApprove}
                                                        onApprove={handleApprove}
                                                    />
                                                )}

                                                {isDisapproveModalOpen && (
                                                    <ConfirmDisapproveModal
                                                        isOpen={isDisapproveModalOpen}
                                                        onClose={() => setIsDisapproveModalOpen(false)}
                                                        onConfirm={handleConfirmDisapprove}
                                                        adoptionRequest={requestToDisapprove}
                                                    />
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

                        {isApproveModalOpen && requestToApprove && (
                            <ApproveModal
                                isOpen={isApproveModalOpen}
                                onClose={() => setIsApproveModalOpen(false)}
                                adoptionRequest={requestToApprove}
                                onApprove={handleApprove}  
                            />
                        )}

                    </motion.div>
                )}

                {showEditModal && editAnimal && (
                <motion.div
                    className="edit-modal"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    >
                        <div className="modal-overlay">
                            <div className="modal-container">
                                <span className="close" onClick={() => setShowEditModal(false)}>
                                    &times;
                                </span>
                                <div className="modal-h2">
                                    <h2>Edit Animal</h2>
                                </div>
                                <div className="edit-content">
                                    <div className="left-column">
                                        <label><strong>Name:</strong></label>
                                        <div></div>
                                        <input
                                            type="text"
                                            value={editAnimal.name || ""}
                                            onChange={(e) => setEditAnimal({ ...editAnimal, name: e.target.value })}
                                            style={{
                                                width: '800px',
                                                marginBottom: '10px',
                                                height: '50px',
                                                marginLeft: '20px',
                                            }}
                                        />
                                        <div></div>
                                        <label className="label-type"><strong>Type:</strong></label>
                                        <label><strong>Breed:</strong></label>
                                        <div></div>
                                        <input
                                            type="text"
                                            value={editAnimal.type || ""}
                                            onChange={(e) =>
                                                setEditAnimal({ ...editAnimal, type: e.target.value })
                                            }
                                            style={{
                                                width: '350px',
                                                marginBottom: '15px',
                                                height: '50px',
                                                marginLeft: '20px',
                                                marginRight: '50px',
                                            }}
                                        />
                                        <input
                                            type="text"
                                            value={editAnimal.breed || ""}
                                            onChange={(e) =>
                                                setEditAnimal({ ...editAnimal, breed: e.target.value })
                                            }
                                            style={{
                                                width: '400px',
                                                marginBottom: '10px',
                                                height: '50px',
                                            }}
                                        />
                                        <div></div>
                                        <label className="label-age"><strong>Age:</strong></label>
                                        <label><strong>Size:</strong></label>
                                        <div></div>
                                        <input
                                            type="text"
                                            value={editAnimal.age || ""}
                                            onChange={(e) =>
                                                setEditAnimal({ ...editAnimal, age: e.target.value })
                                            }
                                            style={{
                                                width: '130px',
                                                marginBottom: '15px',
                                                height: '50px',
                                                marginLeft: '20px',
                                                marginRight: '50px',
                                            }}
                                        />
                                        <input
                                            type="text"
                                            value={editAnimal.size || ""}
                                            onChange={(e) =>
                                                setEditAnimal({ ...editAnimal, size: e.target.value })
                                            }
                                            style={{
                                                width: '300px',
                                                marginBottom: '15px',
                                                height: '50px',
                                            }}
                                        />
                                        <div></div>
                                        <label><strong>Personality:</strong></label>
                                        <div></div>
                                        <input
                                            type="text"
                                            value={editAnimal.personality || ""}
                                            onChange={(e) =>
                                                setEditAnimal({ ...editAnimal, personality: e.target.value })
                                            }
                                            style={{
                                                width: '500px',
                                                marginBottom: '15px',
                                                height: '50px',
                                                marginLeft: '20px',
                                            }}
                                        />
                                        <div></div>
                                        <label><strong>Health Status:</strong></label>
                                        <div></div>
                                        <input
                                            type="text"
                                            value={editAnimal.health_status || ""}
                                            onChange={(e) =>
                                                setEditAnimal({ ...editAnimal, health_status: e.target.value })
                                            }
                                            style={{
                                                width: '500px',
                                                marginBottom: '15px',
                                                height: '50px',
                                                marginLeft: '20px',
                                            }}
                                        />
                                        <div></div>
                                        <label><strong>Background:</strong></label>
                                        <div></div>
                                        <textarea
                                            value={editAnimal.background || ""}
                                            onChange={(e) =>
                                                setEditAnimal({ ...editAnimal, background: e.target.value })
                                            }
                                            style={{
                                                width: '870px',
                                                height: '150px',
                                                marginBottom: '10px',
                                                marginLeft: '20px',
                                                fontSize: '21px',
                                                fontStyle: 'Arial',
                                                padding: '10px'
                                            }}
                                        />
                                        <div></div>
                                        <label><strong>Special Needs:</strong></label>
                                        <div></div>
                                        <textarea
                                            value={editAnimal.special_needs || ""}
                                            onChange={(e) =>
                                                setEditAnimal({ ...editAnimal, special_needs: e.target.value })
                                            }
                                            style={{
                                                width: '870px',
                                                height: '150px',
                                                marginBottom: '10px',
                                                marginLeft: '20px',
                                                fontSize: '21px',
                                                fontStyle: 'Arial',
                                                padding: '10px'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button onClick={handleSaveChanges}>Save</button>
                                    <button onClick={() => setShowEditModal(false)}>Cancel</button>
                                </div>
                            </div>
                            </div>
                            </motion.div>
                            )}

                            </div>
                            <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search animals by name, type, or breed"
                                value={searchQueryAnimals}
                                onChange={handleSearchAnimals}
                                className="search-input"
                            />
                        </div>
                    {adoptableAnimals.length === 0 ? (
                        <p>No adoptable animals available.</p>
                    ) : (
                        <>
                            <table className="adoption-container">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Breed</th>
                                        <th>Age</th>
                                        <th>Size</th>
                                        <th>Personality</th>
                                        <th>Health Status</th>
                                        <th>Background</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedAnimals.map((animal) => (
                                        <tr key={animal.id}>
                                            <td>{animal.name}</td>
                                            <td>{animal.type}</td>
                                            <td>{animal.breed}</td>
                                            <td>{animal.age}</td>
                                            <td>{animal.size}</td>
                                            <td>{animal.personality}</td>
                                            <td>{animal.health_status}</td>
                                            <td>{animal.background}</td>
                                            <td>
                                                <button onClick={() => handleEdit(animal)}>
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDelete(animal.id)}>
                                                    <FaTrash />
                                                </button>
                                                <button onClick={() => handleMoreDetails(animal)}>
                                                    <FaInfoCircle />
                                                </button>
                                
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>    
                            <div className="pagination">
                                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                                    <FaChevronLeft />
                                </button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                                    <FaChevronRight />
                                </button>
                            </div>
                        </>
                    )}
                    <h1>Adoption Requests</h1>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search adoption requests..."
                            value={searchQueryRequests}
                            onChange={handleSearchRequests}
                        />
                    </div>

                    {/* Table displaying adoption requests */}
                    <table className="adoptable-animals-table">
                        {showMoreInfo && (
                            <motion.div
                                className="details-modal"
                                initial={{ right: "-100%" }}
                                animate={{ right: 0 }}
                                exit={{ right: "-100%" }}
                                transition={{ duration: 0.4 }}
                            >
                                {/* New adoption request modal */}
                            </motion.div>
                        )}

                        {showAdoptionRequestModal && (
                        <AdoptionRequestDetailsModal
                            isOpen={showAdoptionRequestModal}
                            onClose={() => setShowAdoptionRequestModal(false)}
                            selectedAnimal={selectedAnimal}  // Pass selectedAnimal including adoptionRequests
                            loading={loading}
                            error={error}
                            setRequestToApprove={setRequestToApprove}
                            setIsApproveModalOpen={setIsApproveModalOpen}
                            isApproveModalOpen={isApproveModalOpen}
                            isDisapproveModalOpen={isDisapproveModalOpen}
                            handleConfirmDisapprove={handleConfirmDisapprove}
                            handleOpenDisapproveModal={handleOpenDisapproveModal}
                            requestToApprove={requestToApprove}
                            requestToDisapprove={requestToDisapprove}
                            handleApprove={handleApprove}
                            setIsDisapproveModalOpen={setIsDisapproveModalOpen}
                        />
                    )}


                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Adopter</th>
                                <th>Contact Number</th>
                                <th>Animal Name</th>
                                <th>Status</th>
                                <th>Adoption Fee</th>
                                <th onClick={handleSortByDate} style={{ cursor: "pointer" }}>
                                    Request Date
                                    {sortOrder === "desc" ? (
                                        <FaSortDown style={{ marginLeft: "5px" }} />
                                    ) : (
                                        <FaSortUp style={{ marginLeft: "5px" }} />
                                    )}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td>{request.id}</td>
                                        <td>{request.reporter_name}</td>
                                        <td>{request.phone_number}</td>
                                        <td>{request.name}</td>
                                        <td>{request.status}</td>
                                        <td>{request.adoption_fee}</td>
                                        <td>{format(new Date(request.request_date), 'MM/dd/yyyy')}</td>
                                        <td>
                                        <button
                                            onClick={() => {
                                                fetchAnimalAndRequests(request.animal_id);  
                                                setShowAdoptionRequestModal(true);  
                                            }}
                                        >
                                            <FaInfoCircle />
                                        </button>

                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No adoption requests found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>


                <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>
                        <FaChevronLeft />
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        <FaChevronRight />
                    </button>
                </div>

        </div>
    );
};

export default AdoptableAnimalsPage;