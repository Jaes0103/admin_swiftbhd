import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/AdoptableAnimalsPage.css';
import { FaEdit, FaTrash, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ConfirmationModal from './ConfirmationModal';
import Sidebar from './Sidebar';
import ErrorModal from '../style/ErrorModal.css';
import ApproveRequestModal from './ApproveRequestModal';


const AdoptableAnimalsPage = () => {
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
    const [setIsModalOpen] = useState(false);
    const [adoptionRequests, setAdoptionRequests] = useState([]);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false); 
    const [requestToApprove, setRequestToApprove] = useState(null); 
    const [adoptionFee, setAdoptionFee] = useState(''); 
    
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
            setAdoptableAnimals(response.data.animals);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Error fetching adoptable animals');
        } finally {
            setLoading(false);
        }
    };
    const fetchAdoptionRequests = async () => {
        try {
            const url = `${process.env.REACT_APP_BASE_URL}/api/admin/adoption-requests`;
            const response = await axios.get(url);
            console.log('Fetched adoption requests:', response.data.adoptionRequests);
            setAdoptionRequests(response.data.adoptionRequests);
        } catch (err) {
            console.error('Error fetching adoption requests:', err);
            setError('Error fetching adoption requests');
        } finally {
            setLoading(false);
        }
    };
    
    const handleApproveRequest = (request) => {
        console.log('Request to approve:', request);
        setRequestToApprove(request);
        setAdoptionFee('');
        setIsApproveModalOpen(true);
    };
    
    const handleApprove = async (fee) => {
        console.log('Approving request ID:', requestToApprove?.id); 
        if (!requestToApprove || !requestToApprove.id) {
            console.error('No request to approve or request ID is missing');
            return;
        }
    
        try {
            console.log(`Sending PUT request to: /api/admin/adoption_requests/${requestToApprove.id}`);
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/admin/adoption-requests/${requestToApprove.id}`, {
                adoption_fee: parseFloat(fee), 
            });
            console.log('Approval response:', response.data); 
        } catch (error) {
            console.error('Error approving request:', error);
        } finally {
            setIsApproveModalOpen(false);
            setRequestToApprove(null);
            setAdoptionFee('');
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
                if (/\d/.test(value)) { // Disallow numbers in text fields
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
        setNewAnimal({ ...animal, img: null });
        setEditMode(true);
        setModalOpen(true);
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
    const displayedAnimals = adoptableAnimals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
        <section className='adoptable-container'>
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
            {adoptableAnimals.length === 0 ? (
                <p>No adoptable animals available.</p>
            ) : (
                <>
                    <table className="adoption-container">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Breed</th>
                                <th>Age</th>
                                <th>Size</th>
                                <th>Personality</th>
                                <th>Health Status</th>
                                <th>Background</th>
                                <th>Special Needs</th>
                                <th>Shelter</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedAnimals.map((animal) => (
                                <tr key={animal.id}>
                                    <td>{animal.id}</td>
                                    <td>{animal.name}</td>
                                    <td>{animal.type}</td>
                                    <td>{animal.breed}</td>
                                    <td>{animal.age}</td>
                                    <td>{animal.size}</td>
                                    <td>{animal.personality}</td>
                                    <td>{animal.health_status}</td>
                                    <td>{animal.background}</td>
                                    <td>{animal.special_needs}</td>
                                    <td>{animal.shelter}</td>
                                    <td>
                                        <img
                                            src={animal.imgurl}
                                            alt={animal.name}
                                            style={{ width: '100px', height: 'auto' }}
                                        />
                                    </td>
                                    <td>
                                        <button onClick={() => handleEdit(animal)}>
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => handleDelete(animal.id)}>
                                            <FaTrash />
                                        </button>
                                        {animal.adoptionRequests && animal.adoptionRequests.map(request => (
                                            <div key={request.id}>
                                                <button onClick={() => handleDeleteAdoptionRequest(request.id)}>
                                                    Delete Request
                                                </button>
                                            </div>
                                        ))}
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
            </section>
            <section className='adoptable-container'>
                <h1>Adoption Requests</h1>
                <table className="adoptable-animals-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Contact Number</th>
                            <th>Animal Name</th>
                            <th>Status</th>
                            <th>Adoption Fee</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adoptionRequests.length > 0 ? (
                            displayedRequests.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.reporter_name}</td>
                                    <td>{request.phone_number}</td>
                                    <td>{request.name}</td>
                                    <td>{request.status}</td>
                                    <td>{request.adoption_fee}</td>
                                    <td>
                                        <button className="approve-button" onClick={() => handleApproveRequest(request)}>
                                            Approve
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No adoption requests found.</td>
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

                <ApproveRequestModal
                    isOpen={isApproveModalOpen}
                    onClose={() => setIsApproveModalOpen(false)}
                    onApprove={handleApprove}
                    adoptionFee={adoptionFee}
                    setAdoptionFee={setAdoptionFee}
                />
            </section>

        </div>
    );
};

export default AdoptableAnimalsPage;