import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/DashboardPage.css'; 
import Sidebar from './Sidebar'; 
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, ChartDataLabels);

const DashboardPage = () => {
  const [reports, setReports] = useState([]);
  const [adoptableAnimals, setAdoptableAnimals] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalReports, setTotalReports] = useState(0);
  const [rescuedAnimals, setRescuedAnimals] = useState([]);
  const [falseReports, setFalseReports] = useState([]);
  const [adoptions, setAdoptions] = useState([]);  
  const [currentPageReports, setCurrentPageReports] = useState(1);
  const [currentPageAnimals, setCurrentPageAnimals] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const itemsPerPage = 5;
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const url = `${process.env.REACT_APP_BASE_URL}/api/admin/dashboard`;
        const response = await axios.get(url);
  
        if (response.data) {
          const { reports, adoptableAnimals, rescuedAnimals, falseReports, adoptions } = response.data;
          
          setReports(reports);
          setAdoptableAnimals(adoptableAnimals);
          setRescuedAnimals(rescuedAnimals);
          setFalseReports(falseReports);
          setAdoptions(adoptions);
  
          const reportCounts = getCountsByMonth(reports, 'created_at');
          const rescuedCounts = getCountsByMonth(rescuedAnimals, 'rescued_date');
  
          setChartData(generateChartData(reportCounts, rescuedCounts));
          setTotalReports(reports.length);
        } else {
          setError('Invalid response structure');
        }
      } catch (err) {
        console.error('Fetch error:', err.response ? err.response.data : err);
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchDashboardData();
  }, []);
   

  const getCountsByMonth = (data, dateKey) => {
    const counts = new Array(12).fill(0);
    data.forEach(item => {
      const date = new Date(item[dateKey]);
      const month = date.getMonth(); 
      counts[month]++;
    });
    return counts;
  };

  const generateChartData = (reportCounts, rescuedCounts) => {
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Reports',
          data: reportCounts,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true
        },
        {
          label: 'Rescued Animals',
          data: rescuedCounts,
          borderColor: 'rgba(138, 126, 190, 1)',
          backgroundColor: 'rgba(138, 126, 190, 0.4)',
          fill: true,
        }
      ]
    };
  };

  const generateDoughnutData = () => {
    return {
      labels: ['Reported Animals', 'Remaining Capacity'],
      datasets: [
        {
          data: [totalReports, 1000 - totalReports],
          backgroundColor: ['rgba(138, 126, 190, 1)', 'rgba(200, 200, 200, 0.5)'],
          borderColor: ['rgba(138, 126, 190, 1)', 'rgba(200, 200, 200, 0.5)'],
          borderWidth: 1,
        },
      ],
    };
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      datalabels: {
        display: true,
        color: 'rgba(138, 126, 190, 1)',
        formatter: (value, context) => {
          if (context.dataIndex === 0) {
            return `${totalReports}`; 
          }
          return ''; 
        },
        font: {
          weight: 'bold',
          size: '30',
          color: 'rgba(138, 126, 190, 1)', 
        },
        anchor: 'center',
        align: 'center',
      },
    },
    cutout: '75%', 
    rotation: 240,
    circumference: 240,
  };

  const indexOfLastReport = currentPageReports * itemsPerPage;
  const indexOfFirstReport = indexOfLastReport - itemsPerPage;
  const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPagesReports = Math.ceil(reports.length / itemsPerPage);

  const handleNextReports = () => {
    if (currentPageReports < totalPagesReports) {
      setCurrentPageReports(currentPageReports + 1);
    }
  };

  const handlePreviousReports = () => {
    if (currentPageReports > 1) {
      setCurrentPageReports(currentPageReports - 1);
    }
  };

  const indexOfLastAnimal = currentPageAnimals * itemsPerPage;
  const indexOfFirstAnimal = indexOfLastAnimal - itemsPerPage;
  const currentAnimals = adoptableAnimals.slice(indexOfFirstAnimal, indexOfLastAnimal);
  const totalPagesAnimals = Math.ceil(adoptableAnimals.length / itemsPerPage);

  const handleNextAnimals = () => {
    if (currentPageAnimals < totalPagesAnimals) {
      setCurrentPageAnimals(currentPageAnimals + 1);
    }
  };

  const handlePreviousAnimals = () => {
    if (currentPageAnimals > 1) {
      setCurrentPageAnimals(currentPageAnimals - 1);
    }
  };
  const handleDateSubmit = (startDate, endDate) => {
    setDateRange({ startDate, endDate });
    setIsModalOpen(false);
  
    const filteredReports = reports.filter((report) => {
      const reportDate = new Date(report.created_at);
      return reportDate >= new Date(startDate) && reportDate <= new Date(endDate);
    });
    navigate('/report-preview', { state: { filteredReports, startDate, endDate } });
  };  
  
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // Navigate to report preview page
  const handleReportPreview = () => {
    navigate('/report-preview', { state: { reports, totalReports } });
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="dashboard-container">
    
      <Sidebar />
      <div className="main-content">
        <div className="top-panel"></div>
        <h1>Admin Dashboard</h1>
        <section className='dashboard-panel'>
        <button className="preview-report-btn" onClick={handleOpenModal}>
            <FontAwesomeIcon icon={faEye} /> Preview Report
          </button>
          {isModalOpen && (
            <div className="modal">
                <h2>Select Date Range</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const startDate = e.target.startDate.value;
                    const endDate = e.target.endDate.value;
                    if (new Date(startDate) > new Date(endDate)) {
                      alert('Start date cannot be after end date.');
                      return;
                    }
                    handleDateSubmit(startDate, endDate);
                  }}
                >
                  <label>
                    Start Date:
                    <input type="date" name="startDate" required />
                  </label>
                  <label>
                    End Date:
                    <input type="date" name="endDate" required />
                  </label>
                  <div>
                    <button type="submit">Submit</button>
                    <button type="button" onClick={handleCloseModal}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
          
          )}
          <h2>Reports</h2>
          {currentReports.length === 0 ? (
            <p>No reports available.</p>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Animal Type</th>
                  <th>Details</th>
                  <th>Cruelty Details</th>
                  <th>Date Created</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentReports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td>{report.animal_type}</td>
                    <td>{report.animal_details}</td>
                    <td>{report.cruelty_details}</td>
                    <td>{new Date(report.created_at).toLocaleDateString()}</td>
                    <td>{report.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="pagination">
            <button onClick={handlePreviousReports} disabled={currentPageReports === 1}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span>{currentPageReports} of {totalPagesReports}</span>
            <button onClick={handleNextReports} disabled={currentPageReports === totalPagesReports}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </section>

        <section className='dashboard-panel'>
          <h3>Adoptable Animals</h3>
          {currentAnimals.length === 0 ? (
            <p>No adoptable animals available.</p>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Breed</th>
                  <th>Age</th>
                  <th>Personality</th>
                  <th>Health Status</th>
                </tr>
              </thead>
              <tbody>
                {currentAnimals.map((animal) => (
                  <tr key={animal.id}>
                    <td>{animal.id}</td>
                    <td>{animal.name}</td>
                    <td>{animal.type}</td>
                    <td>{animal.breed}</td>
                    <td>{animal.age}</td>
                    <td>{animal.personality}</td>
                    <td>{animal.health_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="pagination">
            <button onClick={handlePreviousAnimals} disabled={currentPageAnimals === 1}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span>{currentPageAnimals} of {totalPagesAnimals}</span>
            <button onClick={handleNextAnimals} disabled={currentPageAnimals === totalPagesAnimals}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </section>
      </div>

      <div className='chart-position'>
        <section className="chart-section">
          <h2>Reports and Rescued Animals</h2>
          {chartData ? (
            <Line data={chartData} />
          ) : (
            <p>No data available for the chart.</p>
          )}
        </section>

        <section className="doughnut-section">
          <h2>Total Reported Animals</h2>
          <div className="doughnut-container">
            <Doughnut 
              data={generateDoughnutData()} 
              options={doughnutOptions}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
