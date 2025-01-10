import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../style/ReportsPage.css';
import Sidebar from './Sidebar';

const PendingRescueReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredDate, setFilteredDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [sortOrder, setSortOrder] = useState('desc'); 

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/admin/reportsdetails`);
        setReports(response.data.reports);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error fetching report details');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Sorting the reports based on the sortOrder
  const handleSortByDate = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };
  const formatDateWithoutSeconds = (dateString) => {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true, 
    };
    return new Date(dateString).toLocaleString(undefined, options);
};

  const sortedReports = reports.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  // Filter reports by search query (search by ID)
  const searchedReports = searchQuery
    ? sortedReports.filter((report) => report.id.toString().includes(searchQuery))
    : sortedReports;

  const totalPages = Math.ceil(searchedReports.length / itemsPerPage);

  const currentReports = searchedReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  if (loading) return <p>Loading reports...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="page-container">
      {/* Sidebar */}
      <Sidebar />

      <div className="content-container">
        <h1>Pending Rescue Reports</h1>

        {/* Search bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Report ID"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        {/* Table */}
        <table className="report-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Reporter</th>
              <th>Animal Type</th>
              <th>Details</th>
              <th>Cruelty Details</th>
              <th>Date Created</th>
              <th>
                Reported Date
                <span onClick={handleSortByDate} style={{ cursor: 'pointer', marginLeft: '5px' }}>
                  {sortOrder === 'desc' ? (
                    <FaSortDown />
                  ) : (
                    <FaSortUp />
                  )}
                </span>
              </th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.length === 0 ? (
              <tr>
                <td colSpan="8">No reports available.</td>
              </tr>
            ) : (
              currentReports.map((report) => {
                const truncatedLocation = report.location
                  ? report.location.split(',').slice(0, 3).join(', ')
                  : 'Location not available';

                return (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td>{report.reporter_name}</td>
                    <td>{report.animal_type}</td>
                    <td>{report.animal_details}</td>
                    <td>{report.cruelty_details}</td>
                    <td>{formatDateWithoutSeconds(report.created_at)}</td>       
                    <td>{formatDateWithoutSeconds(report.accident_date)}</td>
                    <td>{truncatedLocation}</td>
                  </tr>
                );
              })
            )}
          </tbody>

        </table>
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

export default PendingRescueReportsPage;
