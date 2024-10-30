import React, { useState, useEffect } from 'react';

const UpdateAnimalModal = ({ isOpen, onClose, onUpdateAnimal, animal }) => {
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

    useEffect(() => {
        if (animal) {
            setName(animal.name);
            setType(animal.type);
            setAge(animal.age);
            setBreed(animal.breed);
            setLocation(animal.location);
            setPersonality(animal.personality);
            setStatus(animal.status);
            setGender(animal.gender);
            setBackground(animal.background);
        }
    }, [animal]);

    const handleImageChange = (e) => {
        setImgFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const updatedAnimal = { 
            name, 
            type, 
            age, 
            breed, 
            location, 
            personality, 
            status, 
            gender,
            background
        };

        if (imgFile) {
            updatedAnimal.imgFile = imgFile; // Include the image file in the object
        }

        onUpdateAnimal(animal.id, updatedAnimal);
        onClose(); // Close the modal after submitting
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay"> 
            <div className="modal-content"> 
                <h2>Update Animal</h2>
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
                        value={background}
                        onChange={(e) => setBackground(e.target.value)}
                        placeholder="Background"
                        required
                    />
                    <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                    <input
                        type="text"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        placeholder="Gender"
                        required
                    />
                    <button type="submit">Update Animal</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateAnimalModal;
