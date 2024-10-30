// LoadingSpinner.js

import React from 'react';
import '../style/LoadingSpinner.css'; 

const LoadingSpinner = () => {
    return (
        <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i> {/* Font Awesome Spinner Icon */}
            <p>Loading...</p>
        </div>
    );
};

export default LoadingSpinner;
