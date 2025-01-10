import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSort, FaChevronLeft, FaChevronRight, FaFilter } from 'react-icons/fa';
import DatePicker from 'react-datepicker'; // Import datepicker
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS for datepicker
import '../style/ReportsPage.css';
import Sidebar from './Sidebar'; // Optional if you have a Sidebar

const RescuedReportsPage = () => {
  const [rescuedAnimals, setRescuedAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRecent, setIsRecent] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filteredDate, setFilteredDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    const fetchRescuedAnimals = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/admin/rescuedanimalsdetails`);
        setRescuedAnimals(response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Error fetching rescued animal details');
      } finally {
        setLoading(false);
      }
    };
    fetchRescuedAnimals();
  }, []);

  const toggleReportOrder = () => {
    setIsRecent(!isRecent);
  };

  const filteredReports = filteredDate
    ? rescuedAnimals.filter((animal) => {
        const rescueDate = new Date(animal.rescue_date);
        return rescueDate.toLocaleDateString() === new Date(filteredDate).toLocaleDateString();
      })
    : rescuedAnimals;

  // Filter reports by Report ID search query
  const searchedReports = searchQuery
    ? filteredReports.filter((animal) => animal.report_id.toString().includes(searchQuery))
    : filteredReports;

  const sortedReports = searchedReports.sort((a, b) => {
    const dateA = new Date(a.rescue_date);
    const dateB = new Date(b.rescue_date);
    return isRecent ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.ceil(searchedReports.length / itemsPerPage);

  const currentReports = sortedReports.slice(
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

  if (loading) return <p>Loading rescued animals...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="page-container">
      {/* Sidebar */}
      <Sidebar />

      <div className="content-container">
        <h1>Rescued Animals Details</h1>

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

        {/* Table */}
        <table className="report-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Animal Type</th>
              <th>Number of Animals</th>
              <th>
                Reported Date
                <FaSort onClick={toggleReportOrder} style={{ cursor: 'pointer', marginLeft: '5px' }} />
              </th>
              <th>
                Rescue Date
              </th>
              <th>Animal Condition</th>
              <th>Reporter Name</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.length === 0 ? (
              <tr>
                <td colSpan="9">No rescued animals found.</td>
              </tr>
            ) : (
              currentReports.map((animal) => (
                <tr key={animal.report_id}>
                  <td>{animal.report_id}</td>
                  <td>{animal.animal_type}</td>
                  <td>{animal.number_of_animals}</td>
                  <td>{formatDateWithoutSeconds(animal.accident_date)}</td>
                  <td>{formatDateWithoutSeconds(animal.rescue_date)}</td>
                  <td>{animal.animal_condition}</td>
                  <td>{animal.full_name}</td>
                  <td>{animal.phone_number}</td>
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

export default RescuedReportsPage;
