import React, { useState, useEffect } from 'react';
import '../style/EventsManager.css';
import Sidebar from './Sidebar';

const EventManager = () => {
    const [events, setEvents] = useState([]);
    const [isFormVisible, setFormVisible] = useState(false);
    const [eventDetails, setEventDetails] = useState({
        event_name: '',
        event_date: '',
        imgFile: null,
        vidFile: null,
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchEvents(); // Fetch events on component mount
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/events`);
            if (!response.ok) {
                throw new Error(`Failed to fetch events: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched Events:', data);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            setError('Error fetching events. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setEventDetails({ ...eventDetails, [name]: files[0] });
        } else {
            setEventDetails({ ...eventDetails, [name]: value });
            if (name === 'password') {
                evaluatePasswordStrength(value);
            }
        }
    };

    const evaluatePasswordStrength = (password) => {
        let strength = '';
        if (password.length < 6) {
            strength = 'Too short';
        } else if (password.length < 10) {
            strength = 'Weak';
        } else if (password.match(/[A-Z]/) && password.match(/[0-9]/)) {
            strength = 'Strong';
        } else {
            strength = 'Medium';
        }
        setPasswordStrength(strength);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('event_name', eventDetails.event_name);
        formData.append('event_date', eventDetails.event_date);
        if (eventDetails.imgFile) {
            formData.append('imgFile', eventDetails.imgFile);
        }
        if (eventDetails.vidFile) {
            formData.append('vidFile', eventDetails.vidFile);
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/admin/create-events`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to create event: ${response.status} ${errorText}`);
            }

            setSuccessMessage('Event created successfully!');
            fetchEvents(); // Refresh the event list
            setEventDetails({ event_name: '', event_date: '', imgFile: null, vidFile: null, password: '' });
            setFormVisible(false); // Hide form after submission
        } catch (error) {
            console.error('Error during event submission:', error);
            setError('Error creating event. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const toggleFormVisibility = () => {
        setFormVisible(!isFormVisible);
        if (isFormVisible) {
            setEventDetails({ event_name: '', event_date: '', imgFile: null, vidFile: null, password: '' });
            setPasswordStrength('');
        }
    };

    // Pagination Logic
    const totalPages = Math.ceil(events.length / itemsPerPage);
    const displayedEvents = events.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="events-list">
                <h2>Upcoming Events</h2>
                {loading && <p>Loading events...</p>}
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>} 
                
                <div className="events-box">
                    <ul>
                        {displayedEvents.map((event) => (
                            <li key={event.id} className="event-item">
                                <h3>{event.event_name}</h3>
                                <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>
                                {console.log('Event:', event)} 
                                {event.imgurl && (
                                    <img 
                                        src={event.imgurl} 
                                        alt={event.event_name} 
                                        style={{ width: '100px' }} 
                                        onError={() => console.error(`Failed to load image from URL: ${event.imgurl}`)} 
                                    />
                                )}
                                {event.vidurl && (
                                    <video width="100" controls>
                                        <source src={event.vidurl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pagination Controls with Icons */}
                <div className="pagination">
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-button">
                        <i className="fa fa-chevron-left"></i>
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-button">
                        <i className="fa fa-chevron-right"></i>
                    </button>
                </div>

                <button onClick={toggleFormVisibility}>
                    {isFormVisible ? 'Hide Event Form' : 'Create New Event'}
                </button>
                
                {isFormVisible && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>Create New Event</h3>
                            <form onSubmit={handleSubmit}>
                                <div>
                                    <label>Event Name:</label>
                                    <input
                                        type="text"
                                        name="event_name"
                                        value={eventDetails.event_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Event Date:</label>
                                    <input
                                        type="date"
                                        name="event_date"
                                        value={eventDetails.event_date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label>Password:</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={eventDetails.password}
                                        onChange={handleChange}
                                    />
                                    {eventDetails.password && (
                                        <p>Password Strength: {passwordStrength}</p>
                                    )}
                                </div>
                                <div>
                                    <label>Image:</label>
                                    <input
                                        type="file"
                                        name="imgFile"
                                        accept="image/*" 
                                        onChange={handleChange}
                                    />
                                    {eventDetails.imgFile && (
                                        <img
                                            src={URL.createObjectURL(eventDetails.imgFile)} 
                                            alt="Preview"
                                            style={{ width: '100px', marginTop: '10px' }}
                                        />
                                    )}
                                </div>
                                <div>
                                    <label>Video:</label>
                                    <input
                                        type="file"
                                        name="vidFile"
                                        accept="video/*" 
                                        onChange={handleChange}
                                    />
                                    {eventDetails.vidFile && (
                                        <video
                                            width="100"
                                            controls
                                            style={{ marginTop: '10px' }}
                                        >
                                            <source
                                                src={URL.createObjectURL(eventDetails.vidFile)} 
                                                type={eventDetails.vidFile.type}
                                            />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>
                                <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Event'}</button>
                                <button type="button" onClick={toggleFormVisibility}>Cancel</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventManager;