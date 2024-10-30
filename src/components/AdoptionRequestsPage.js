import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/AdoptionRequestsPage.css';

const AdoptionRequestsPage = () => {
    const [adoptionRequests, setAdoptionRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAdoptionRequests = async () => {
        try {
            const url = `${process.env.REACT_APP_BASE_URL}/api/admin/adoption-requests`;
            const response = await axios.get(url);
            setAdoptionRequests(response.data.adoptionRequests);
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Error fetching adoption requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdoptionRequests();
    }, []);

    if (loading) {
        return <p>Loading adoption requests...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="adoption-requests-container">
            <h1>Adoption Requests</h1>
            {adoptionRequests.length === 0 ? (
                <p>No adoption requests available.</p>
            ) : (
                <table className="adoption-requests-table">
                    <thead>
                        <tr>
                            <th>Reporter Name</th>
                            <th>Animal Name</th>
                            <th>Phone Number</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adoptionRequests.map((request) => (
                            <tr key={request.id}>
                                <td>{request.reporter_name}</td>
                                <td>{request.name}</td>
                                <td>{request.phone_number}</td>
                                <td>{request.address}</td>
                                <td>{request.status}</td>
                                <td>{request.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdoptionRequestsPage;
