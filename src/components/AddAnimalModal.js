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
    const [imgFile, setImgFile] = useState(null);
    const [gender, setGender] = useState('');
    const [background, setBackground] = useState('');

    const [errors, setErrors] = useState({});

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImgFile(file);
            setErrors(prevErrors => ({ ...prevErrors, imgFile: '' }));
        } else {
            setErrors(prevErrors => ({ ...prevErrors, imgFile: 'Please select a valid image file.' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        // Validate fields
        if (!name || /\d/.test(name)) newErrors.name = 'Name must be a valid text without numbers.';
        if (!type || /\d/.test(type)) newErrors.type = 'Type must be a valid text without numbers.';
        if (!age || !/^\d+$/.test(age)) newErrors.age = 'Age must be a number.';
        if (!breed || /\d/.test(breed)) newErrors.breed = 'Breed must be a valid text without numbers.';
        if (!location || /\d/.test(location)) newErrors.location = 'Location must be a valid text without numbers.';
        if (!personality || /\d/.test(personality)) newErrors.personality = 'Personality must be a valid text without numbers.';
        if (!status || /\d/.test(status)) newErrors.status = 'Status must be a valid text without numbers.';
        if (!background || /\d/.test(background)) newErrors.background = 'Background must be a valid text without numbers.';
        if (!gender || /\d/.test(gender)) newErrors.gender = 'Gender must be a valid text without numbers.';
        if (!imgFile) newErrors.imgFile = 'Image file is required.';

        // Check if there are any validation errors
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return; // Prevent form submission if errors exist
        }

        const newAnimal = { 
            name, 
            type, 
            age, 
            breed, 
            location, 
            personality, 
            status, 
            gender,
            background,
            imgFile
        };

        onAddAnimal(newAnimal);
        // Reset form
        setName('');
        setType('');
        setAge('');
        setBreed('');
        setLocation('');
        setPersonality('');
        setStatus('');
        setGender('');
        setBackground('');
        setImgFile(null);
        setErrors({});
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay"> 
            <div className="modal-content">
                <h2>Add New Animal</h2>
                <form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        required
                    />
                    {errors.name && <span className="error">{errors.name}</span>}

                    {/* Type Field */}
                    <input
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        placeholder="Type"
                        required
                    />
                    {errors.type && <span className="error">{errors.type}</span>}

                    {/* Age Field */}
                    <input
                        type="text"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Age"
                        required
                    />
                    {errors.age && <span className="error">{errors.age}</span>}

                    {/* Breed Field */}
                    <input
                        type="text"
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                        placeholder="Breed"
                        required
                    />
                    {errors.breed && <span className="error">{errors.breed}</span>}

                    {/* Location Field */}
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location"
                        required
                    />
                    {errors.location && <span className="error">{errors.location}</span>}

                    {/* Personality Field */}
                    <input
                        type="text"
                        value={personality}
                        onChange={(e) => setPersonality(e.target.value)}
                        placeholder="Personality"
                        required
                    />
                    {errors.personality && <span className="error">{errors.personality}</span>}

                    {/* Status Field */}
                    <input
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        placeholder="Status"
                        required
                    />
                    {errors.status && <span className="error">{errors.status}</span>}

                    {/* Background Field */}
                    <input
                        type="text"
                        value={background}
                        onChange={(e) => setBackground(e.target.value)}
                        placeholder="Background"
                        required
                    />
                    {errors.background && <span className="error">{errors.background}</span>}

                    {/* Image Field */}
                    <input
                        type="file"
                        onChange={handleImageChange} 
                        accept="image/*" 
                        required
                    />
                    {errors.imgFile && <span className="error">{errors.imgFile}</span>}

                    {/* Gender Field */}
                    <input
                        type="text"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        placeholder="Gender"
                        required
                    />
                    {errors.gender && <span className="error">{errors.gender}</span>}

                    <button type="submit">Add Animal</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddAnimalModal;
