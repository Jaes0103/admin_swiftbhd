import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import '../style/CreateRescuerPage.css'; 

const passwordStrength = (password) => {
    const strengthCriteria = [
        { regex: /.{8,}/, message: 'At least 8 characters' }, 
        { regex: /[A-Z]/, message: 'At least one uppercase letter' },
        { regex: /[a-z]/, message: 'At least one lowercase letter' },
        { regex: /\d/, message: 'At least one number' },
        { regex: /[@$!%*?&]/, message: 'At least one special character' },
    ];

    return strengthCriteria.reduce((acc, { regex }) => acc + (regex.test(password) ? 1 : 0), 0);
};

const CreateRescuer = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrengthValue, setPasswordStrengthValue] = useState(0);
    const [rescuers, setRescuers] = useState([]);
    const [loadingRescuers, setLoadingRescuers] = useState(false);
    const [errorRescuers, setErrorRescuers] = useState('');

    useEffect(() => {
        fetchRescuers();
    }, []);

    // Fetch rescuers from the server
    const fetchRescuers = async () => {
        setLoadingRescuers(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/admin/rescuers`);
            setRescuers(response.data);
            console.log('Fetched rescuers:', response.data);
        } catch (error) {
            console.error('Error fetching rescuers:', error);
            setErrorRescuers('Error fetching rescuers. Please try again later.');
        } finally {
            setLoadingRescuers(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/admin/create-rescuer`, {
                name,
                email,
                password,
            });

            setMessage(response.data.msg);
            resetForm();
            fetchRescuers();
        } catch (err) {
            console.error(err);
            setError(err.response?.data.msg || 'Failed to create rescuer');
        } finally {
            setLoading(false);
        }
    };

    // Reset form fields
    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        setPasswordStrengthValue(0);
    };

    // Handle password input and strength evaluation
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrengthValue(passwordStrength(newPassword));
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="form-container">
                <h2>Create Rescuer Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        <div className="password-strength">
                            <div
                                className="strength-meter"
                                style={{
                                    width: `${(passwordStrengthValue / 5) * 100}%`,
                                    backgroundColor: getStrengthColor(passwordStrengthValue),
                                }}
                            />
                            <p>Password strength: {getStrengthLabel(passwordStrengthValue)}</p>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="submit-button">
                        {loading ? 'Creating...' : 'Create Rescuer'}
                    </button>
                </form>
                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}
            </div>
            
            <div className="rescuers-list">
                <h2>Rescuers</h2>
                {loadingRescuers ? (
                    <p>Loading rescuers...</p>
                ) : (
                    <>
                        <h3>Validated Rescuers</h3>
                        {rescuers.length > 0 ? (
                            <ul>
                                {rescuers.filter(rescuer => rescuer.isValidated).map(rescuer => (
                                    <li key={rescuer.id}>{rescuer.name} - {rescuer.email}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No validated rescuers found.</p>
                        )}
                        <h3>Unvalidated Rescuers</h3>
                        {rescuers.length > 0 ? (
                            <ul>
                                {rescuers.filter(rescuer => !rescuer.isValidated).map(rescuer => (
                                    <li key={rescuer.id}>{rescuer.name} - {rescuer.email}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No unvalidated rescuers found.</p>
                        )}
                    </>
                )}
                {errorRescuers && <p className="error-message">{errorRescuers}</p>}
            </div>
        </div>
    );
};

const getStrengthColor = (strength) => {
    const colors = ['red', 'orange', 'yellow', 'lightgreen', 'green', 'darkgreen'];
    return colors[strength] || 'transparent';
};

const getStrengthLabel = (strength) => {
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return labels[strength] || '';
};

export default CreateRescuer;