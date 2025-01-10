
import React from 'react';
import '../style/LoadingSpinner.css'; 

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i> 
            <p>Loading...</p>
        </div>
    );
};

export default LoadingSpinner;
