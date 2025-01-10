import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../style/ReportsPage.css';
import Sidebar from './Sidebar';

const FalseReportsPage = () => {
  const [falseReports, setFalseReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    const fetchFalseReports = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/admin/falsereports`);
        setFalseReports(response.data.reports);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error fetching false report details');
      } finally {
        setLoading(false);
      }
    };
    fetchFalseReports();
  }, []);

  const totalPages = Math.ceil(falseReports.length / itemsPerPage);

  // Filter the reports based on the search query
  const filteredReports = searchQuery
    ? falseReports.filter((report) => report.id.toString().includes(searchQuery))
    : falseReports;

  const currentFalseReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const formatDateWithoutSeconds = (dateString) => {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, // AM/PM format
    };
    return new Date(dateString).toLocaleString(undefined, options);
};

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  if (loading) return <p>Loading false reports...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="page-container">
      <Sidebar />
      <div className="content-container">
        <h1>False Reports</h1>

        {/* Search Bar for Report ID */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Report ID"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <table className="report-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Reporter</th>
              <th>Animal Type</th>
              <th>Details</th>
              <th>Cruelty Details</th>
              <th>Date Created</th>
              <th>Reported Date</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {currentFalseReports.length === 0 ? (
              <tr>
                <td colSpan="9">No false reports found.</td>
              </tr>
            ) : (
              currentFalseReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.reporter_name}</td>
                  <td>{report.animal_type}</td>
                  <td>{report.animal_details}</td>
                  <td>{report.cruelty_details}</td>
                  <td>{formatDateWithoutSeconds(report.created_at)}</td>
                  <td>{formatDateWithoutSeconds(report.accident_date)}</td>
                  <td>{report.status}</td>
                  
                </tr>
              ))
            )}
          </tbody>

        </table>

        {/* Pagination */}
        <div className="pagination">
          <button onClick={handlePrevious} disabled={currentPage === 1}>
            <FaChevronLeft />
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FalseReportsPage;
