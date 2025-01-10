import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faChevronLeft, faChevronRight, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../style/AnimalListPage.css';
import Sidebar from './Sidebar';
import AddAnimalModal from '../components/AddAnimalModal';
import UpdateAnimalModal from '../components/UpdateAnimalModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';


const AnimalList = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [entriesPerPage, setEntriesPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State to control delete modal
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [animalToDelete, setAnimalToDelete] = useState(null);
    const [sortOrder, setSortOrder] = useState('name');
    const navigate = useNavigate();


    // Fetch animals from the API
    const fetchAnimals = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/admin/animals`);
            setAnimals(response.data.animals);
        } catch (err) {
            console.error('Error fetching animals:', err.response ? err.response.data : err.message);
            setError('Error fetching animals');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnimals();
    }, []);

    // Navigate to animal details page
    const handleViewClick = (id) => {
        navigate(`/animals/${id}/details`);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
        setCurrentPage(1);
    };

    // Handle entries per page change
    const handleEntriesChange = (e) => {
        setEntriesPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    // Handle adding a new animal
    const handleAddAnimal = async (newAnimal) => {
        const formData = new FormData();
        formData.append('name', newAnimal.name);
        formData.append('type', newAnimal.type);
        formData.append('age', newAnimal.age);
        formData.append('breed', newAnimal.breed);
        formData.append('location', newAnimal.location);
        formData.append('personality', newAnimal.personality);
        formData.append('status', newAnimal.status);
        formData.append('gender', newAnimal.gender);
        formData.append('background', newAnimal.background);

        if (newAnimal.imgFile) {
            formData.append('imgFile', newAnimal.imgFile); // Ensure the image is included
        }

        try {
            await axios.post(`${process.env.REACT_APP_BASE_URL}/api/admin/add-animal`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Let the browser set this automatically
                },
            });
            fetchAnimals(); // Refresh the list after adding
            setModalOpen(false); // Close the modal after success
        } catch (err) {
            setError('Error adding animal');
            console.error('Error adding animal:', err.response ? err.response.data : err.message); // Log more details
        }
    };

    // Handle updating an animal
    const handleUpdateAnimal = async (id, updatedAnimal) => {
        const formData = new FormData();
        formData.append('name', updatedAnimal.name);
        formData.append('type', updatedAnimal.type);
        formData.append('age', updatedAnimal.age);
        formData.append('breed', updatedAnimal.breed);
        formData.append('location', updatedAnimal.location);
        formData.append('personality', updatedAnimal.personality);
        formData.append('status', updatedAnimal.status);
        formData.append('gender', updatedAnimal.gender);

        if (updatedAnimal.imgFile) {
            formData.append('imgFile', updatedAnimal.imgFile); 
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/admin/animals/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            });
            fetchAnimals(); 
            setUpdateModalOpen(false);
        } catch (err) {
            setError('Error updating animal');
            console.error('Error updating animal:', err.response ? err.response.data : err.message);
        }
    };

    const handleDeleteClick = (animal) => {
        setAnimalToDelete(animal); 
        setDeleteModalOpen(true);
    };

    const confirmDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/api/admin/animals/${id}`);
            fetchAnimals(); 
        } catch (err) {
            setError('Error deleting animal');
            console.error('Error deleting animal:', err.response ? err.response.data : err.message);
        } finally {
            setDeleteModalOpen(false); 
        }
    };
    // Handle clicking the edit button
    const handleEditClick = (animal) => {
        setSelectedAnimal(animal);
        setUpdateModalOpen(true);
    };

    // Filter animals based on search query
    const filteredAnimals = animals.filter(animal =>
        (animal.name && animal.name.toLowerCase().includes(searchQuery)) ||
        (animal.type && animal.type.toLowerCase().includes(searchQuery)) ||
        (animal.breed && animal.breed.toLowerCase().includes(searchQuery))
    );

    // Sort animals based on selected order
    const sortedAnimals = [...filteredAnimals].sort((a, b) => {
        if (sortOrder === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortOrder === 'age') {
            return a.age - b.age;
        }
        return 0; // Default case
    });

    const indexOfLastAnimal = currentPage * entriesPerPage;
    const indexOfFirstAnimal = indexOfLastAnimal - entriesPerPage;
    const currentAnimals = sortedAnimals.slice(indexOfFirstAnimal, indexOfLastAnimal);
    const totalPages = Math.ceil(sortedAnimals.length / entriesPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) {
        return <div>Loading animals...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Animals in the Shelter</h1>
            <Sidebar />
            <button className="add-animal-button" onClick={() => setModalOpen(true)}>
                <FontAwesomeIcon icon={faPlus} /> Add Animal
            </button>
            <AddAnimalModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onAddAnimal={handleAddAnimal}
            />
            <UpdateAnimalModal
                isOpen={updateModalOpen}
                onClose={() => setUpdateModalOpen(false)}
                onUpdateAnimal={handleUpdateAnimal}
                animal={selectedAnimal}
            />
             <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onDeleteConfirm={() => confirmDelete(animalToDelete?.id)} 
            />
            <div className="controls">
                <label htmlFor="entries">Show</label>
                <select id="entries" value={entriesPerPage} onChange={handleEntriesChange}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                </select>
                <span> entries</span>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                <label htmlFor="sort">Sort by:</label>
                <select id="sort" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="age">Age</option>
                </select>
            </div>

            {filteredAnimals.length === 0 ? (
                <p>No animals found in the shelter.</p>
            ) : (
                <>
                    <table className="animal-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Age</th>
                                <th>Breed</th>
                                <th>Gender</th>
                                <th>Location</th>
                                <th>Personality</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentAnimals.map(animal => (
                                <tr key={animal.id}>
                                    <td>
                                        {animal.imgurl ? (
                                            <img
                                                src={animal.imgurl}
                                                alt={animal.name}
                                                className="animal-image"
                                            />
                                        ) : (
                                            <div className="paw-icon-container">
                                                <FontAwesomeIcon icon={faPaw} className="default-paw-icon" />
                                            </div>
                                        )}
                                    </td>
                                    <td>{animal.name}</td>
                                    <td>{animal.type}</td>
                                    <td>{animal.age}</td>
                                    <td>{animal.breed}</td>
                                    <td>{animal.gender}</td>
                                    <td>{animal.location}</td>
                                    <td>{animal.personality}</td>
                                    <td>{animal.status}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(animal)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <button onClick={() => handleDeleteClick(animal)} className="delete-button">
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                        <button onClick={() => handleViewClick(animal.id)}>View Details</button>
                                        
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button onClick={handlePrevious} disabled={currentPage === 1}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <span>{currentPage} of {totalPages}</span>
                        <button onClick={handleNext} disabled={currentPage === totalPages}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AnimalList;