import React, { useState } from 'react';
import "../style/AddAnimalModal.css"

const AddAnimalModal = ({ isOpen, onClose, onAddAnimal }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [age, setAge] = useState('');
    const [breed, setBreed] = useState('');
    const [location, setLocation] = useState('');
    const [personality, setPersonality] = useState('');
    const [status, setStatus] = useState('');
    const [imgFile, setImgFile] = useState(null); // State for image file
    const [gender, setGender] = useState('');
    const [background, setBackground] = useState(''); // State for background text field

    const handleImageChange = (e) => {
        setImgFile(e.target.files[0]); // Update state with selected file
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newAnimal = { 
            name, 
            type, 
            age, 
            breed, 
            location, 
            personality, 
            status, 
            gender,
            background // Include the background field in the object
        };

        // If an image file is selected, add it to the newAnimal object
        if (imgFile) {
            newAnimal.imgFile = imgFile; // Include the image file in the object
        }

        onAddAnimal(newAnimal);
        // Reset the form
        setName('');
        setType('');
        setAge('');
        setBreed('');
        setLocation('');
        setPersonality('');
        setStatus('');
        setGender('');
        setBackground(''); // Reset background field
        setImgFile(null); // Reset image file
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay"> {/* Modal overlay for background */}
            <div className="modal-content"> {/* Modal content area */}
                <h2>Add New Animal</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        required
                    />
                    <input
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        placeholder="Type"
                        required
                    />
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Age"
                        required
                    />
                    <input
                        type="text"
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                        placeholder="Breed"
                        required
                    />
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location"
                        required
                    />
                    <input
                        type="text"
                        value={personality}
                        onChange={(e) => setPersonality(e.target.value)}
                        placeholder="Personality"
                        required
                    />
                    <input
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        placeholder="Status"
                        required
                    />
                    <input
                        type="text"
                        value={background} // Add input for background
                        onChange={(e) => setBackground(e.target.value)}
                        placeholder="Background"
                        required
                    />
                    {/* Image input for picking the image */}
                    <input
                        type="file"
                        onChange={handleImageChange} 
                        accept="image/*" 
                        required
                    />
                    <input
                        type="text"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        placeholder="Gender"
                        required
                    />
                    <button type="submit">Add Animal</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddAnimalModal;
